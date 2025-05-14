// Cloudflare D1 database adapter for Workers
import { drizzle } from 'drizzle-orm/d1';

// Note: Cloudflare Workers can't directly import from TypeScript files
// So we'll define a simplified schema here
const schema = {
  users: {
    id: { name: 'id' },
    username: { name: 'username' },
    password: { name: 'password' },
    isAdmin: { name: 'is_admin' },
    createdAt: { name: 'created_at' }
  },
  categories: {
    id: { name: 'id' },
    name: { name: 'name' },
    icon: { name: 'icon' },
    color: { name: 'color' },
    createdAt: { name: 'created_at' }
  },
  apps: {
    id: { name: 'id' },
    name: { name: 'name' },
    categoryId: { name: 'category_id' },
    description: { name: 'description' },
    iconUrl: { name: 'icon_url' },
    rating: { name: 'rating' },
    downloads: { name: 'downloads' },
    version: { name: 'version' },
    size: { name: 'size' },
    updated: { name: 'updated' },
    requires: { name: 'requires' },
    developer: { name: 'developer' },
    installs: { name: 'installs' },
    downloadUrl: { name: 'download_url' },
    googlePlayUrl: { name: 'google_play_url' },
    iosAppStoreUrl: { name: 'ios_app_store_url' },
    originalAppId: { name: 'original_app_id' },
    screenshots: { name: 'screenshots' },
    lastSyncedAt: { name: 'last_synced_at' },
    createdAt: { name: 'created_at' }
  },
  affiliateLinks: {
    id: { name: 'id' },
    appId: { name: 'app_id' },
    url: { name: 'url' },
    buttonText: { name: 'button_text' },
    buttonColor: { name: 'button_color' },
    label: { name: 'label' },
    clicks: { name: 'clicks' },
    lastClickedAt: { name: 'last_clicked_at' },
    createdAt: { name: 'created_at' },
    updatedAt: { name: 'updated_at' }
  },
  appVersionHistory: {
    id: { name: 'id' },
    appId: { name: 'app_id' },
    version: { name: 'version' },
    releaseDate: { name: 'release_date' },
    changeLog: { name: 'change_log' },
    isNotified: { name: 'is_notified' },
    createdAt: { name: 'created_at' }
  }
};

export function getDatabase(env) {
  if (!env.DB) {
    console.error('D1 database binding not found');
    return null;
  }
  
  return drizzle(env.DB);
}

// Helper function to convert app database model to legacy format
export function convertToAppLegacy(app, categoryName) {
  // Parse screenshots from JSON string if needed
  let screenshots = [];
  if (app.screenshots) {
    if (typeof app.screenshots === 'string') {
      try {
        screenshots = JSON.parse(app.screenshots);
      } catch (e) {
        screenshots = [];
      }
    } else if (Array.isArray(app.screenshots)) {
      screenshots = app.screenshots;
    }
  }
  
  return {
    id: app.id,
    name: app.name,
    category: categoryName,
    categoryId: app.categoryId,
    description: app.description || '',
    iconUrl: app.iconUrl || '',
    rating: app.rating || 0,
    downloads: app.downloads || '0',
    version: app.version || '',
    size: app.size || '',
    updated: app.updated || '',
    requires: app.requires || '',
    developer: app.developer || '',
    installs: app.installs || '',
    downloadUrl: app.downloadUrl || '',
    googlePlayUrl: app.googlePlayUrl || '',
    iosAppStoreUrl: app.iosAppStoreUrl,
    originalAppId: app.originalAppId,
    screenshots: screenshots,
    isAffiliate: false,
    lastSyncedAt: app.lastSyncedAt ? new Date(app.lastSyncedAt) : undefined
  };
}