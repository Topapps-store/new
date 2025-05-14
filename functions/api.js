import { getDatabaseForCloudflare, convertToAppLegacy } from './db.js';
import { eq, desc, like, and, not } from 'drizzle-orm';

export default {
  async fetch(request, env, ctx) {
    try {
      // Check if this is a health check
      const url = new URL(request.url);
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: "ok",
          message: "API is running",
          version: "1.0.0",
          environment: env.NODE_ENV || "development"
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      // Get the D1 database connection
      const db = getDatabaseForCloudflare(env);
      
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, url, db);
      }
      
      return new Response("API endpoint not found", { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({
        error: error.message || "Unknown error",
        stack: env.NODE_ENV === 'development' ? error.stack : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Handler for API requests
async function handleApiRequest(request, url, db) {
  const path = url.pathname.replace('/api/', '');
  const method = request.method;
  
  // Set CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  // Extract the schema tables
  const { apps, categories, users, affiliateLinks, appVersionHistory } = db._.schema;
  
  // Route handling
  try {
    // GET /api/apps
    if (path === 'apps' && method === 'GET') {
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id));
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/apps/popular
    if (path === 'apps/popular' && method === 'GET') {
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .orderBy(desc(apps.rating))
      .limit(12);
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/apps/recent
    if (path === 'apps/recent' && method === 'GET') {
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .orderBy(desc(apps.lastSyncedAt))
      .limit(12);
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/apps/just-in-time
    if (path === 'apps/just-in-time' && method === 'GET') {
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .orderBy(apps.name)
      .limit(12);
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/app/{id}
    if (path.startsWith('app/') && method === 'GET') {
      const id = path.split('/')[1];
      const [result] = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .where(eq(apps.id, id));
      
      if (!result) {
        return new Response(JSON.stringify({ error: 'App not found' }), { status: 404, headers });
      }
      
      const formattedApp = convertToAppLegacy(result.app, result.categoryName || '');
      return new Response(JSON.stringify(formattedApp), { headers });
    }
    
    // GET /api/categories
    if (path === 'categories' && method === 'GET') {
      const categoryList = await db.select().from(categories);
      const formattedCategories = categoryList.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || undefined,
        color: category.color || undefined
      }));
      return new Response(JSON.stringify(formattedCategories), { headers });
    }
    
    // GET /api/category/{id}/apps
    if (path.startsWith('category/') && path.endsWith('/apps') && method === 'GET') {
      const id = path.split('/')[1];
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      
      if (!category) {
        return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404, headers });
      }
      
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .where(eq(apps.categoryId, id));
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/search
    if (path.startsWith('search') && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const searchTerm = `%${query}%`;
      
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .where(like(apps.name, searchTerm))
      .limit(50);
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/app/{id}/related
    if (path.startsWith('app/') && path.endsWith('/related') && method === 'GET') {
      const id = path.split('/')[1];
      
      // Get the app to find its category
      const [app] = await db.select().from(apps).where(eq(apps.id, id));
      if (!app) {
        return new Response(JSON.stringify({ error: 'App not found' }), { status: 404, headers });
      }
      
      // Get related apps in the same category
      const appResults = await db.select({
        app: apps,
        categoryName: categories.name
      })
      .from(apps)
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .where(and(
        eq(apps.categoryId, app.categoryId),
        not(eq(apps.id, id))
      ))
      .limit(8);
      
      const formattedApps = appResults.map(result => convertToAppLegacy(result.app, result.categoryName || ''));
      return new Response(JSON.stringify(formattedApps), { headers });
    }
    
    // GET /api/app/{id}/affiliate-links
    if (path.startsWith('app/') && path.endsWith('/affiliate-links') && method === 'GET') {
      const id = path.split('/')[1];
      const links = await db.select().from(affiliateLinks).where(eq(affiliateLinks.appId, id));
      return new Response(JSON.stringify(links), { headers });
    }
    
    // GET /api/app-updates/unnotified
    if (path === 'app-updates/unnotified' && method === 'GET') {
      const results = await db.select({
        versionHistory: appVersionHistory,
        app: apps,
        categoryName: categories.name
      })
      .from(appVersionHistory)
      .innerJoin(apps, eq(appVersionHistory.appId, apps.id))
      .leftJoin(categories, eq(apps.categoryId, categories.id))
      .where(eq(appVersionHistory.isNotified, false))
      .orderBy(desc(appVersionHistory.releaseDate));
      
      const formattedResults = results.map(result => ({
        app: convertToAppLegacy(result.app, result.categoryName || ''),
        versionHistory: result.versionHistory
      }));
      
      return new Response(JSON.stringify(formattedResults), { headers });
    }
    
    // If no route matched
    return new Response(JSON.stringify({ error: 'Endpoint not found' }), { status: 404, headers });
  } catch (error) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}