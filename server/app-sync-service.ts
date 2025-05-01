import * as gplay from 'google-play-scraper';
import * as appStore from 'app-store-scraper';

// Add type declarations for the modules
declare module 'google-play-scraper';
declare module 'app-store-scraper';
import { db } from './db';
import { apps } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { log } from './vite';

// Common interface for both stores
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
    const appData = await gplay.app({ appId: packageName });
    const appScreenshots = await gplay.screenshots({ appId: packageName });
    
    return {
      appId: packageName,
      name: appData.title,
      description: appData.description,
      version: appData.version,
      developer: appData.developer,
      icon: appData.icon,
      screenshots: appScreenshots,
      rating: appData.score,
      reviews: appData.reviews,
      size: appData.size,
      releaseDate: new Date(appData.released),
      price: appData.price,
      url: appData.url,
      genre: appData.genre,
      updated: appData.updated,
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
  try {
    const appData = await appStore.app({ id: appId });
    const screenshots = await appStore.screenshots({ id: appId });
    
    return {
      appId: appId,
      name: appData.title,
      description: appData.description,
      version: appData.version,
      developer: appData.developer,
      icon: appData.icon,
      screenshots: screenshots,
      rating: appData.score,
      reviews: appData.reviews,
      size: appData.size,
      releaseDate: new Date(appData.released),
      price: appData.price,
      url: appData.url,
      genre: appData.genre,
      updated: appData.updated,
      storeType: 'ios'
    };
  } catch (error) {
    log(`Error fetching iOS app data for ${appId}: ${error}`, 'error');
    return null;
  }
}

/**
 * Update app information in the database
 */
async function updateAppInDatabase(appData: AppData) {
  try {
    // Convert to download count format
    const downloads = appData.reviews > 1000000 
      ? `${Math.floor(appData.reviews / 1000000)}M+` 
      : appData.reviews > 1000 
        ? `${Math.floor(appData.reviews / 1000)}K+` 
        : `${appData.reviews}+`;
        
    // Format for "requires" field
    const requires = appData.storeType === 'android' 
      ? 'Android 5.0+' 
      : 'iOS 12.0+';
      
    // Build the update object
    const updateData = {
      name: appData.name,
      description: appData.description,
      iconUrl: appData.icon,
      screenshots: appData.screenshots,
      rating: appData.rating,
      downloads: downloads,
      version: appData.version,
      size: appData.size,
      updated: appData.updated,
      requires: requires,
      developer: appData.developer,
      installs: downloads,
      // Only update the respective store URL
      ...(appData.storeType === 'android' ? { googlePlayUrl: appData.url } : { iosAppStoreUrl: appData.url })
    };

    // Find app by ID and update
    const [updatedApp] = await db
      .update(apps)
      .set(updateData)
      .where(eq(apps.originalAppId, appData.appId))
      .returning();
      
    if (updatedApp) {
      log(`Updated app ${appData.name} (${appData.appId}) from ${appData.storeType} store`, 'app-sync');
      return true;
    } else {
      log(`App ${appData.appId} not found in database`, 'warning');
      return false;
    }
  } catch (error) {
    log(`Error updating app in database: ${error}`, 'error');
    return false;
  }
}

/**
 * Synchronize app information for a single app
 */
export async function syncAppInfo(appId: string, storeType: 'android' | 'ios' | 'both') {
  try {
    // Get app data
    const [app] = await db.select().from(apps).where(eq(apps.id, appId));
    
    if (!app) {
      log(`App not found: ${appId}`, 'error');
      return false;
    }
    
    // Get original app ID (package name or App Store ID)
    const originalAppId = app.originalAppId || app.id;
    
    // Fetch from Android if applicable
    if (storeType === 'android' || storeType === 'both') {
      const androidData = await getAndroidAppData(originalAppId);
      if (androidData) {
        await updateAppInDatabase(androidData);
      }
    }
    
    // Fetch from iOS if applicable
    if (storeType === 'ios' || storeType === 'both') {
      const iosData = await getIosAppData(originalAppId);
      if (iosData) {
        await updateAppInDatabase(iosData);
      }
    }
    
    return true;
  } catch (error) {
    log(`Error syncing app info: ${error}`, 'error');
    return false;
  }
}

/**
 * Sync all apps in the database
 */
export async function syncAllApps() {
  try {
    const allApps = await db.select().from(apps);
    let successCount = 0;
    
    log(`Starting sync for ${allApps.length} apps`, 'app-sync');
    
    for (const app of allApps) {
      // Determine which store to use based on available data
      let storeType: 'android' | 'ios' | 'both' = 'android';
      
      if (app.iosAppStoreUrl && !app.googlePlayUrl) {
        storeType = 'ios';
      } else if (app.iosAppStoreUrl && app.googlePlayUrl) {
        storeType = 'both';
      }
      
      const success = await syncAppInfo(app.id, storeType);
      if (success) successCount++;
    }
    
    log(`Completed app sync. Successfully updated ${successCount}/${allApps.length} apps`, 'app-sync');
    return successCount;
  } catch (error) {
    log(`Error in syncAllApps: ${error}`, 'error');
    return 0;
  }
}