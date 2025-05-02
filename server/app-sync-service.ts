// Import the default export as a namespace
import gplay from 'google-play-scraper';
import appStore from 'app-store-scraper';

// Import our type declarations
/// <reference path="./types/google-play-scraper.d.ts" />
/// <reference path="./types/app-store-scraper.d.ts" />
import { db } from './db';
import { apps, appVersionHistory } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { log } from './vite';
import { storage } from './storage';

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
      'vpn-secure': 'com.tunnelbear.android',
      'uber': 'com.ubercab',
      'ubereats': 'com.ubercab.eats',
      'amazon': 'com.amazon.mShop.android.shopping',
      'doordash': 'com.dd.doordash',
      'grubhub': 'com.grubhub.android',
      'instacart': 'com.instacart.client',
      'lyft': 'me.lyft.android',
      'cashapp': 'com.squareup.cash',
      'venmo': 'com.venmo',
      'zelle': 'com.zellepay.zelle',
      'taskrabbit': 'com.taskrabbit.droid.consumer',
      'thumbtack': 'com.thumbtack.app',
      'handy': 'com.handy.android',
      'teladoc': 'com.teladoc.members',
      'zocdoc': 'com.zocdoc.android',
      'temu': 'com.temu.app',
      'shein': 'com.zzkko',
      'rinse': 'com.rinse.android',
      'lawnlove': 'garden.apps.lawnlove',
      'turo': 'com.relayrides.android.relayrides',
      'bird': 'co.bird.android',
      'lime': 'com.limebike',
      'easypark': 'net.easypark.android',
      'parkmobile': 'net.sharewire.parkmobilev2',
      'spothero': 'com.spothero.spothero',
      'parkwhiz': 'com.parkwhiz.droid',
      'paybyphone': 'com.paybyphone',
      'matriculas-espana': 'gov.dgt.app',
      'work-from-home': 'com.remote.work.jobs',
      'offline-maps': 'com.offlinemapmaps',
      'plus500-trading': 'com.Plus500'
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
      'mobile-legends': '1160056295',
      'uber': '368677368',
      'ubereats': '1058959277',
      'amazon': '297606951',
      'doordash': '719972451',
      'grubhub': '302920553',
      'instacart': '545599256',
      'lyft': '529379082',
      'cashapp': '711923939',
      'venmo': '351727428',
      'zelle': '1213762331',
      'taskrabbit': '374165361',
      'thumbtack': '599584599',
      'handy': '818702544',
      'teladoc': '656872607',
      'zocdoc': '419815170',
      'temu': '1641486558',
      'shein': '878577184',
      'turo': '555063314',
      'bird': '1260842311',
      'lime': '1251822877',
      'easypark': '449594317',
      'parkmobile': '365399774',
      'spothero': '499097243',
      'parkwhiz': '579650499',
      'paybyphone': '448474183'
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
      
    // Get the current app to check for version changes
    const [currentApp] = await db.select()
      .from(apps)
      .where(eq(apps.originalAppId, appData.appId));
    
    if (!currentApp) {
      log(`App ${appData.appId} not found in database`, 'warning');
      return false;
    }
    
    // Check if the version has changed
    const versionChanged = currentApp.version !== appData.version;
      
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
      lastSyncedAt: new Date(),
      // Only update the respective store URL
      ...(appData.storeType === 'android' ? { googlePlayUrl: appData.url } : { iosAppStoreUrl: appData.url })
    };

    // First try to find by original AppId (exact match)
    let [updatedApp] = await db
      .update(apps)
      .set(updateData)
      .where(eq(apps.original_app_id, appData.appId))
      .returning();
    
    // If no app was found with the exact match, try to find by our internal ID
    if (!updatedApp) {
      [updatedApp] = await db
        .update(apps)
        .set(updateData)
        .where(eq(apps.id, appId))
        .returning();
    }
      
    if (updatedApp) {
      log(`Updated app ${appData.name} (${appData.appId}) from ${appData.storeType} store`, 'app-sync');
      
      // If version has changed, record it in version history
      if (versionChanged) {
        try {
          // Extract release notes if available (we don't always have this info from the store APIs)
          // In a real implementation, we might want to track the actual changelog from the store
          const releaseNotes = `New version ${appData.version} released. Updated on ${appData.updated}.`;
          
          // Determine if this is an important update (in a real app, this would be more sophisticated)
          const isImportant = false; // We could implement logic to detect major version changes (e.g., 1.x to 2.0)
          
          // Add to version history
          await storage.addAppVersionHistory({
            appId: updatedApp.id,
            version: appData.version,
            releaseNotes,
            isNotified: false,
            isImportant,
            changesDetected: true
          });
          
          log(`Recorded version change for ${appData.name}: ${currentApp.version} -> ${appData.version}`, 'app-sync');
        } catch (error) {
          log(`Error recording version history: ${error}`, 'error');
        }
      }
      
      return true;
    } else {
      log(`App ${appData.appId} update failed`, 'warning');
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
 * Add missing apps to the database
 */
async function ensureMissingApps() {
  try {
    // First, let's update existing apps that don't have an original_app_id
    const appsWithoutOriginalId = await db
      .select()
      .from(apps)
      .where(eq(apps.original_app_id, ''));

    if (appsWithoutOriginalId.length > 0) {
      log(`Found ${appsWithoutOriginalId.length} apps without original_app_id. Updating...`, 'app-sync');
      
      for (const app of appsWithoutOriginalId) {
        await db
          .update(apps)
          .set({ original_app_id: app.id })
          .where(eq(apps.id, app.id));
        
        log(`Updated app ${app.name} with original_app_id = ${app.id}`, 'app-sync');
      }
    }

    // A list of apps that we want to ensure are in the database
    const essentialApps = [
      "uber", "lyft", "doordash", "grubhub", "ubereats", 
      "cashapp", "venmo", "turo", "instacart", "amazon",
      "zelle", "taskrabbit", "thumbtack", "handy", "teladoc", 
      "zocdoc", "temu", "shein", "bird", "lime", 
      "easypark", "parkmobile", "spothero", "parkwhiz", "paybyphone"
    ];

    // Check which apps are missing
    let existingAppIds = (await db.select({ id: apps.id }).from(apps)).map(a => a.id);
    const missingAppIds = essentialApps.filter(id => !existingAppIds.includes(id));
    
    if (missingAppIds.length === 0) {
      log("All essential apps are already in the database", 'app-sync');
      return;
    }
    
    log(`Adding ${missingAppIds.length} missing apps to the database...`, 'app-sync');
    
    // Map of app categories
    const appCategories: Record<string, string> = {
      "uber": "ride-sharing",
      "lyft": "ride-sharing",
      "doordash": "food-delivery",
      "grubhub": "food-delivery",
      "ubereats": "food-delivery",
      "cashapp": "finance",
      "venmo": "finance",
      "zelle": "finance",
      "turo": "car-rental",
      "instacart": "grocery",
      "amazon": "shopping",
      "taskrabbit": "services",
      "thumbtack": "services",
      "handy": "services",
      "teladoc": "health",
      "zocdoc": "health",
      "temu": "shopping",
      "shein": "shopping",
      "bird": "mobility",
      "lime": "mobility",
      "easypark": "parking",
      "parkmobile": "parking",
      "spothero": "parking",
      "parkwhiz": "parking",
      "paybyphone": "parking"
    };
    
    // Insert missing apps with placeholder data (will be updated on sync)
    for (const appId of missingAppIds) {
      const categoryId = appCategories[appId] || "utilities";
      
      // Check if the category exists
      let categoryResult = await db.select().from(categories).where(eq(categories.id, categoryId));
      if (categoryResult.length === 0) {
        // Create the category if it doesn't exist
        await db.insert(categories).values({
          id: categoryId,
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' '),
          icon: "icon-" + categoryId,
          color: "#4285F4"
        });
        log(`Created category: ${categoryId}`, 'app-sync');
      }
      
      // Add the app with placeholder data
      const appName = appId.charAt(0).toUpperCase() + appId.slice(1);
      await db.insert(apps).values({
        id: appId,
        originalAppId: appId,
        name: appName,
        categoryId: categoryId,
        description: `${appName} app description will be updated on sync.`,
        iconUrl: "https://via.placeholder.com/512",
        screenshots: [],
        rating: 0,
        downloads: "0+",
        version: "1.0.0",
        size: "Varies",
        updated: new Date().toISOString(),
        requires: "Android 5.0+",
        developer: "Unknown",
        installs: "0+",
        googlePlayUrl: "",
        createdAt: new Date()
      });
      
      log(`Added app: ${appId} to database`, 'app-sync');
    }
    
    log(`Successfully added ${missingAppIds.length} missing apps`, 'app-sync');
  } catch (error) {
    log(`Error ensuring missing apps: ${error}`, 'error');
  }
}

/**
 * Sync all apps in the database
 */
export async function syncAllApps() {
  try {
    // First, ensure all essential apps are in the database
    await ensureMissingApps();
    
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