import gplay from 'google-play-scraper';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { apps, appVersionHistory } from '@shared/schema';
import { log } from './vite';

interface AppData {
  appId: string;
  name: string;
  description: string;
  version: string;
  developer: string;
  icon: string;
  screenshots: string[];
  rating: number;
  reviews: number;
  size: string;
  releaseDate: Date;
  price: number;
  url: string;
  genre: string;
  updated: string;
  storeType: 'android' | 'ios' | 'both';
}

/**
 * Fetch app data from Google Play Store
 */
async function getAndroidAppData(packageName: string): Promise<AppData | null> {
  try {
    const appData = await gplay.app({
      appId: packageName,
      lang: 'en',
      country: 'us'
    });

    return {
      appId: packageName,
      name: appData.title,
      description: appData.description,
      version: appData.version,
      developer: appData.developer,
      icon: appData.icon,
      screenshots: appData.screenshots || [],
      rating: typeof appData.score === 'number' ? appData.score : 0,
      reviews: appData.reviews || 0,
      size: appData.size || '',
      releaseDate: new Date(appData.released || Date.now()),
      price: appData.price || 0,
      url: appData.url,
      genre: appData.genre || '',
      updated: appData.updated || new Date().toDateString(),
      storeType: 'android'
    };
  } catch (error) {
    log(`Error fetching Android app data for ${packageName}: ${error}`, 'error');
    return null;
  }
}

/**
 * Fetch app data from Apple App Store
 */
async function getIosAppData(appId: string): Promise<AppData | null> {
  // Placeholder for iOS app data fetching, to be implemented later
  return null;
}

/**
 * Update app information in the database
 */
async function updateAppInDatabase(appData: AppData, appId: string) {
  try {
    // Get current app data for version comparison
    const [existingApp] = await db.select().from(apps).where(eq(apps.id, appId));

    if (!existingApp) {
      log(`App ${appId} not found in database`, 'error');
      return false;
    }

    // Format downloads string
    const downloads = appData.reviews > 1000000 
      ? `${Math.floor(appData.reviews / 1000000)}M+` 
      : appData.reviews > 1000 
        ? `${Math.floor(appData.reviews / 1000)}K+` 
        : `${appData.reviews}+`;

    // Check if version changed for version history
    const versionChanged = existingApp.version !== appData.version && appData.version;

    // Update app in database
    await db.update(apps).set({
      name: appData.name,
      description: appData.description,
      iconUrl: appData.icon || existingApp.iconUrl,
      screenshots: appData.screenshots.length ? appData.screenshots : existingApp.screenshots,
      rating: appData.rating || existingApp.rating,
      downloads: downloads,
      version: appData.version || existingApp.version,
      size: appData.size || existingApp.size,
      updated: appData.updated || new Date().toDateString(),
      developer: appData.developer || existingApp.developer,
      lastSyncedAt: new Date()
    }).where(eq(apps.id, appId));

    // If version changed, add to version history
    if (versionChanged) {
      await db.insert(appVersionHistory).values({
        app_id: appId,
        version: appData.version,
        releaseDate: new Date(),
        changes: 'Automatically detected version update',
        notified: false
      });
    }

    log(`App ${appId} updated successfully`, 'info');
    return true;
  } catch (error) {
    log(`Error updating app ${appId} in database: ${error}`, 'error');
    return false;
  }
}

/**
 * Synchronize app information for a single app
 */
export async function syncAppInfo(appId: string, storeType: 'android' | 'ios' | 'both' = 'both') {
  try {
    // Get app from database
    const [app] = await db.select().from(apps).where(eq(apps.id, appId));

    if (!app) {
      log(`App ${appId} not found in database`, 'error');
      return false;
    }

    // Get originalAppId (package name for Android or app ID for iOS)
    const originalAppId = app.originalAppId || '';

    if (!originalAppId) {
      log(`No original app ID found for app ${appId}`, 'error');
      return false;
    }

    let appData: AppData | null = null;

    // Fetch from Android store if needed
    if (storeType === 'android' || storeType === 'both') {
      appData = await getAndroidAppData(originalAppId);
    }

    // Fetch from iOS store if needed and Android didn't work
    if ((storeType === 'ios' || (storeType === 'both' && !appData)) && app.iosAppStoreUrl) {
      const iosAppId = app.iosAppStoreUrl.split('/id')[1];
      if (iosAppId) {
        appData = await getIosAppData(iosAppId);
      }
    }

    // Update database if appData was fetched
    if (appData) {
      return await updateAppInDatabase(appData, appId);
    }

    return false;
  } catch (error) {
    log(`Error syncing app ${appId}: ${error}`, 'error');
    return false;
  }
}

/**
 * Sync all apps in the database
 */
export async function syncAllApps() {
  try {
    const allApps = await db.select({ id: apps.id }).from(apps);
    const results = [];

    // Process apps in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < allApps.length; i += batchSize) {
      const batch = allApps.slice(i, i + batchSize);
      const batchPromises = batch.map(app => syncAppInfo(app.id));
      results.push(...await Promise.all(batchPromises));
      
      // Add delay between batches
      if (i + batchSize < allApps.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = results.filter(Boolean).length;
    log(`Synced ${successCount} out of ${allApps.length} apps successfully`, 'info');
    return successCount;
  } catch (error) {
    log(`Error syncing all apps: ${error}`, 'error');
    return 0;
  }
}