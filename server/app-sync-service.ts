// Import the default export as a namespace
import gplay from 'google-play-scraper';
import appStore from 'app-store-scraper';

// Import our type declarations
/// <reference path="./types/google-play-scraper.d.ts" />
/// <reference path="./types/app-store-scraper.d.ts" />
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
    // Map our simple ID to the actual Google Play package name if needed
    const packageMap: Record<string, string> = {
      'whatsapp': 'com.whatsapp',
      'facebook': 'com.facebook.katana',
      'instagram': 'com.instagram.android',
      'tiktok': 'com.zhiliaoapp.musically',
      'netflix': 'com.netflix.mediaclient',
      'spotify': 'com.spotify.music',
      'ing-espana': 'www.ingdirect.nativeframe',
      'mobile-legends': 'com.mobile.legends',
      'windows-11': 'com.microsoft.windows',
      'rv-gesundheit': 'de.techniker.tk',
      'doco-renfe': 'at.oebb.ts',
      'vpn-secure': 'com.tunnelbear.android'
    };

    // Use the mapped package name if available
    const actualPackageName = packageMap[packageName] || packageName;
    
    // Fetch app data
    const appData = await gplay.app({
      appId: actualPackageName,
      lang: 'en',
      country: 'us'
    });
    
    // Try to get screenshots
    let screenshotUrls: string[] = [];
    try {
      if (appData.screenshots && appData.screenshots.length > 0) {
        screenshotUrls = appData.screenshots;
      }
    } catch (e) {
      log(`Could not fetch screenshots for ${packageName}`, 'warning');
    }
    
    return {
      appId: packageName, // Keep our original ID
      name: appData.title,
      description: appData.description || '',
      version: appData.version || '',
      developer: appData.developer || '',
      icon: appData.icon || '',
      screenshots: screenshotUrls,
      rating: typeof appData.score === 'number' ? appData.score : 0,
      reviews: typeof appData.reviews === 'number' ? appData.reviews : 0,
      size: appData.size || '',
      releaseDate: new Date(appData.released || Date.now()),
      price: typeof appData.price === 'number' ? appData.price : 0,
      url: appData.url || '',
      genre: appData.genre || '',
      updated: typeof appData.updated === 'string' ? appData.updated : new Date().toISOString(),
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
    // Map our simple ID to actual iOS App Store ID if needed
    const appIdMap: Record<string, string> = {
      'whatsapp': '310633997',
      'facebook': '284882215',
      'instagram': '389801252',
      'tiktok': '835599320',
      'netflix': '363590051',
      'spotify': '324684580',
      'ing-espana': '542941827',
      'mobile-legends': '1160056295'
      // Add more mappings as needed
    };

    // Use the mapped ID if available
    const actualAppId = appIdMap[appId] || appId;
    
    // Fetch the app data from App Store
    const appData = await appStore.app({ 
      id: actualAppId,
      country: 'us'
    });
    
    // Try to get screenshots
    let screenshotUrls: string[] = [];
    try {
      if (appData.screenshots && appData.screenshots.length > 0) {
        screenshotUrls = appData.screenshots;
      } else {
        // Try to get screenshots separately (may not be needed anymore)
        const screenshots = await appStore.screenshots({ id: actualAppId });
        if (screenshots && screenshots.length > 0) {
          screenshotUrls = screenshots;
        }
      }
    } catch (e) {
      log(`Could not fetch screenshots for ${appId} from iOS App Store`, 'warning');
    }
    
    return {
      appId: appId, // Keep our original ID
      name: appData.title,
      description: appData.description || '',
      version: appData.version || '',
      developer: appData.developer || '',
      icon: appData.icon || '',
      screenshots: screenshotUrls,
      rating: typeof appData.score === 'number' ? appData.score : 0,
      reviews: typeof appData.reviews === 'number' ? appData.reviews : 0,
      size: appData.size || '',
      releaseDate: new Date(appData.released || Date.now()),
      price: typeof appData.price === 'number' ? appData.price : 0,
      url: appData.url || '',
      genre: appData.primaryGenre || (appData.genres && appData.genres.length > 0 ? appData.genres[0] : ''),
      updated: appData.updated || new Date().toISOString(),
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