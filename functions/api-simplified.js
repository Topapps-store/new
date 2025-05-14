// Simplified API for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      };

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
      }

      // Health check endpoint
      if (url.pathname === '/api/health') {
        return new Response(
          JSON.stringify({
            status: "ok",
            message: "API is running",
            version: "1.0.0",
            environment: env.NODE_ENV || "production"
          }), 
          { status: 200, headers }
        );
      }

      // Check for D1 database
      if (!env.DB) {
        return new Response(
          JSON.stringify({ error: "Database not configured" }),
          { status: 500, headers }
        );
      }

      // Handle API endpoints
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, url, env.DB, headers);
      }

      // Default response for non-API routes
      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers }
      );
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({
          error: error.message || "Unknown error",
          stack: env.NODE_ENV === 'development' ? error.stack : undefined
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

// Handle API requests using native D1 queries instead of Drizzle ORM
async function handleApiRequest(request, url, db, headers) {
  const path = url.pathname.slice(5); // Remove '/api/' prefix
  const method = request.method;

  try {
    // GET /api/categories - Get all categories
    if (path === 'categories' && method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM categories').all();
      return new Response(JSON.stringify(results || []), { headers });
    }

    // GET /api/apps/popular - Get popular apps
    if (path === 'apps/popular' && method === 'GET') {
      const { results } = await db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        ORDER BY a.rating DESC
        LIMIT 12
      `).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/apps/recent - Get recent apps
    if (path === 'apps/recent' && method === 'GET') {
      const { results } = await db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        ORDER BY a.last_synced_at DESC
        LIMIT 12
      `).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/apps/just-in-time - Get just-in-time apps
    if (path === 'apps/just-in-time' && method === 'GET') {
      const { results } = await db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        ORDER BY a.name
        LIMIT 12
      `).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/app/{id} - Get app by ID
    if (path.match(/^app\/[^\/]+$/) && method === 'GET') {
      const id = path.split('/')[1];
      const stmt = db.prepare('SELECT a.*, c.name as category_name FROM apps a LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?');
      const result = await stmt.bind(id).first();
      
      if (!result) {
        return new Response(JSON.stringify({ error: 'App not found' }), { status: 404, headers });
      }
      
      return new Response(JSON.stringify(formatAppFromRow(result)), { headers });
    }

    // GET /api/category/{id}/apps - Get apps by category
    if (path.match(/^category\/[^\/]+\/apps$/) && method === 'GET') {
      const id = path.split('/')[1];
      
      // First check if category exists
      const categoryStmt = db.prepare('SELECT * FROM categories WHERE id = ?');
      const category = await categoryStmt.bind(id).first();
      
      if (!category) {
        return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404, headers });
      }
      
      // Then get apps in this category
      const stmt = db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.category_id = ?
      `);
      const { results } = await stmt.bind(id).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/search?q={query} - Search apps
    if (path === 'search' && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const searchTerm = `%${query}%`;
      
      const stmt = db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.name LIKE ?
        LIMIT 50
      `);
      const { results } = await stmt.bind(searchTerm).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/app/{id}/related - Get related apps
    if (path.match(/^app\/[^\/]+\/related$/) && method === 'GET') {
      const id = path.split('/')[1];
      
      // First get the app's category
      const appStmt = db.prepare('SELECT category_id FROM apps WHERE id = ?');
      const app = await appStmt.bind(id).first();
      
      if (!app) {
        return new Response(JSON.stringify({ error: 'App not found' }), { status: 404, headers });
      }
      
      // Then get other apps in the same category
      const stmt = db.prepare(`
        SELECT a.*, c.name as category_name 
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.category_id = ? AND a.id != ?
        LIMIT 8
      `);
      const { results } = await stmt.bind(app.category_id, id).all();
      
      const formattedApps = (results || []).map(row => formatAppFromRow(row));
      return new Response(JSON.stringify(formattedApps), { headers });
    }

    // GET /api/app/{id}/affiliate-links - Get affiliate links for an app
    if (path.match(/^app\/[^\/]+\/affiliate-links$/) && method === 'GET') {
      const id = path.split('/')[1];
      
      const stmt = db.prepare('SELECT * FROM affiliate_links WHERE app_id = ?');
      const { results } = await stmt.bind(id).all();
      
      return new Response(JSON.stringify(results || []), { headers });
    }

    // GET /api/app-updates/unnotified - Get unnotified app updates
    if (path === 'app-updates/unnotified' && method === 'GET') {
      const { results } = await db.prepare(`
        SELECT 
          a.*, 
          c.name as category_name,
          v.id as version_id,
          v.version,
          v.release_date,
          v.change_log,
          v.is_notified
        FROM app_version_history v
        INNER JOIN apps a ON v.app_id = a.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE v.is_notified = 0
        ORDER BY v.release_date DESC
      `).all();
      
      const formattedResults = (results || []).map(row => ({
        app: formatAppFromRow(row),
        versionHistory: {
          id: row.version_id,
          appId: row.id,
          version: row.version,
          releaseDate: row.release_date,
          changeLog: row.change_log,
          isNotified: Boolean(row.is_notified),
        }
      }));
      
      return new Response(JSON.stringify(formattedResults), { headers });
    }

    // If no route matched
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }), 
      { status: 404, headers }
    );
  } catch (error) {
    console.error('API Route Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers }
    );
  }
}

// Helper function to format app data from a database row
function formatAppFromRow(row) {
  // Parse screenshots from JSON string if needed
  let screenshots = [];
  if (row.screenshots) {
    if (typeof row.screenshots === 'string') {
      try {
        screenshots = JSON.parse(row.screenshots);
      } catch (e) {
        screenshots = [];
      }
    } else if (Array.isArray(row.screenshots)) {
      screenshots = row.screenshots;
    }
  }
  
  return {
    id: row.id,
    name: row.name,
    category: row.category_name || '',
    categoryId: row.category_id,
    description: row.description || '',
    iconUrl: row.icon_url || '',
    rating: parseFloat(row.rating) || 0,
    downloads: row.downloads || '0',
    version: row.version || '',
    size: row.size || '',
    updated: row.updated || '',
    requires: row.requires || '',
    developer: row.developer || '',
    installs: row.installs || '',
    downloadUrl: row.download_url || '',
    googlePlayUrl: row.google_play_url || '',
    iosAppStoreUrl: row.ios_app_store_url,
    originalAppId: row.original_app_id,
    screenshots: screenshots,
    isAffiliate: false,
    lastSyncedAt: row.last_synced_at ? new Date(row.last_synced_at * 1000) : undefined
  };
}