/**
 * App Store Synchronization Service
 * 
 * This service synchronizes app data from Google Play Store and Apple App Store.
 * It automatically updates app information, version history, and screenshots.
 */

import * as googlePlay from 'google-play-scraper';
import * as appStore from 'app-store-scraper';
import { eq, and, isNotNull, ne, sql } from 'drizzle-orm';
import { createDbClient } from './db';
import { apps, appVersionHistory, type AppStoreData } from '../../shared/schema';

// Default store types to sync from
const DEFAULT_STORE_TYPES = ['android', 'ios', 'both'];

/**
 * Fetch app data from Google Play Store
 * 
 * @param packageName Android package name (e.g., 'com.spotify.music')
 * @returns App data or null if not found
 */
async function getAndroidAppData(packageName: string): Promise<AppStoreData | null> {
  try {
    // Get app details from Google Play Store
    const appInfo = await googlePlay.app({ appId: packageName });
    
    // Get app screenshots
    const screenshots = await googlePlay.screenshots({
      appId: packageName,
      lang: 'en',
      country: 'us',
    });
    
    // Format the data
    return {
      appId: packageName,
      name: appInfo.title,
      description: appInfo.description,
      version: appInfo.version || 'Unknown',
      developer: appInfo.developer,
      icon: appInfo.icon,
      screenshots: screenshots || [],
      rating: appInfo.score || 0,
      reviews: appInfo.reviews || 0,
      size: appInfo.size || 'Unknown',
      releaseDate: new Date(appInfo.updated),
      price: appInfo.price || 0,
      url: appInfo.url,
      genre: appInfo.genre || 'Utility',
      updated: new Date(appInfo.updated).toISOString(),
      storeType: 'android',
    };
  } catch (error) {
    console.error(`[AppSync] Error fetching Android app data for ${packageName}:`, error);
    return null;
  }
}

/**
 * Fetch app data from Apple App Store
 * 
 * @param appId iOS app ID
 * @returns App data or null if not found
 */
async function getIosAppData(appId: string): Promise<AppStoreData | null> {
  try {
    // Get app details from Apple App Store
    const appInfo = await appStore.app({ id: appId });
    
    // Format the data
    return {
      appId: appId,
      name: appInfo.title,
      description: appInfo.description,
      version: appInfo.version || 'Unknown',
      developer: appInfo.developer,
      icon: appInfo.icon,
      screenshots: appInfo.screenshots || [],
      rating: appInfo.score || 0,
      reviews: appInfo.reviews || 0,
      size: appInfo.size || 'Unknown',
      releaseDate: new Date(appInfo.updated),
      price: appInfo.price || 0,
      url: appInfo.url,
      genre: appInfo.primaryGenre || 'Utility',
      updated: new Date(appInfo.updated).toISOString(),
      storeType: 'ios',
    };
  } catch (error) {
    console.error(`[AppSync] Error fetching iOS app data for ${appId}:`, error);
    return null;
  }
}

/**
 * Update app information in the database
 * 
 * @param appData App data from store
 */
async function updateAppInDatabase(appData: AppStoreData) {
  const { db } = createDbClient();
  
  try {
    // Find the app in our database
    const [existingApp] = await db
      .select()
      .from(apps)
      .where(eq(apps.originalAppId, appData.appId));
    
    if (!existingApp) {
      console.log(`[AppSync] App with original ID ${appData.appId} not found in database`);
      return;
    }
    
    // Check if version has changed
    const versionChanged = existingApp.version !== appData.version;
    
    // Update the app data
    await db
      .update(apps)
      .set({
        name: appData.name,
        description: appData.description,
        iconUrl: appData.icon,
        rating: appData.rating,
        downloads: appData.reviews.toString(),
        version: appData.version,
        size: appData.size,
        updated: appData.updated,
        developer: appData.developer,
        screenshots: appData.screenshots,
        lastSyncedAt: new Date(),
      })
      .where(eq(apps.id, existingApp.id));
    
    // Add version history entry if version changed
    if (versionChanged) {
      await db
        .insert(appVersionHistory)
        .values({
          appId: existingApp.id,
          version: appData.version,
          releaseNotes: 'Updated from app store',
          isNotified: false,
          isImportant: false,
          changesDetected: true,
        })
        .returning();
      
      console.log(`[AppSync] Version history added for ${existingApp.id}: ${appData.version}`);
    }
    
    console.log(`[AppSync] Updated app ${existingApp.id} from ${appData.storeType}`);
  } catch (error) {
    console.error(`[AppSync] Error updating app in database:`, error);
  }
}

/**
 * Synchronize app information for a single app
 * 
 * @param appId App ID in our database
 * @param storeType Which store to sync from
 */
export async function syncAppInfo(appId: string, storeType: 'android' | 'ios' | 'both') {
  const { db } = createDbClient();
  
  try {
    // Get app from database
    const [app] = await db
      .select()
      .from(apps)
      .where(eq(apps.id, appId));
    
    if (!app) {
      console.error(`[AppSync] App ${appId} not found in database`);
      return;
    }
    
    // Skip if no original app ID
    if (!app.originalAppId) {
      console.warn(`[AppSync] App ${appId} has no original app ID, skipping sync`);
      return;
    }
    
    // Sync from appropriate store
    if (storeType === 'android' || storeType === 'both') {
      const androidData = await getAndroidAppData(app.originalAppId);
      if (androidData) {
        await updateAppInDatabase(androidData);
      }
    }
    
    if (storeType === 'ios' || storeType === 'both') {
      // iOS App Store ID might be different
      const iosId = app.iosAppStoreUrl ? 
        app.iosAppStoreUrl.match(/id(\d+)/)?.[1] : 
        null;
      
      if (iosId) {
        const iosData = await getIosAppData(iosId);
        if (iosData) {
          await updateAppInDatabase(iosData);
        }
      }
    }
    
    console.log(`[AppSync] Sync completed for app ${appId}`);
  } catch (error) {
    console.error(`[AppSync] Error syncing app ${appId}:`, error);
  }
}

/**
 * Sync all apps in the database
 * 
 * @param storeTypes Which stores to sync from
 */
export async function syncAllApps(storeTypes = DEFAULT_STORE_TYPES) {
  const { db } = createDbClient();
  
  try {
    // Get all apps with original app IDs
    const allApps = await db
      .select()
      .from(apps)
      .where(
        // Only select apps with an original app ID
        and(
          isNotNull(apps.originalAppId),
          ne(apps.originalAppId, '')
        )
      );
    
    console.log(`[AppSync] Starting sync for ${allApps.length} apps`);
    
    // Process apps in batches of 5 to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < allApps.length; i += batchSize) {
      const batch = allApps.slice(i, i + batchSize);
      
      // Process each app in the batch
      await Promise.all(
        batch.map(app => {
          // Determine which store to sync from based on URLs
          let storeType: 'android' | 'ios' | 'both' = 'android';
          
          if (app.iosAppStoreUrl && app.googlePlayUrl) {
            storeType = 'both';
          } else if (app.iosAppStoreUrl) {
            storeType = 'ios';
          }
          
          // Only sync from stores specified in storeTypes
          if (storeTypes.includes(storeType)) {
            return syncAppInfo(app.id, storeType);
          }
          return Promise.resolve();
        })
      );
      
      // Wait a bit between batches to avoid rate limiting
      if (i + batchSize < allApps.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`[AppSync] All apps sync completed`);
  } catch (error) {
    console.error(`[AppSync] Error syncing all apps:`, error);
  }
}