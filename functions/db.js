// Cloudflare D1 database adapter
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../shared/schema-sqlite';

export function getDatabase(env) {
  if (!env.DB) {
    throw new Error('D1 database binding not found');
  }
  
  return drizzle(env.DB, { schema });
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