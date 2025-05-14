import { Request, Response } from 'express';
import { syncAppInfo } from '../app-sync-service';
import { db } from '../db';
import { apps, categories } from '@shared/schema';
import { eq } from 'drizzle-orm';
import gplay from 'google-play-scraper';
import appStore from 'app-store-scraper';
import { log } from '../vite';

/**
 * Import app data from Google Play Store or App Store
 */
export async function importFromGooglePlay(req: Request, res: Response) {
  try {
    const { googlePlayUrl, appStoreUrl, categoryId, customAppId, storeType = 'android' } = req.body;

    // Determinar qué tienda está usando el usuario
    const isAndroid = storeType === 'android';
    const storeUrl = isAndroid ? googlePlayUrl : appStoreUrl;

    if (!storeUrl) {
      return res.status(400).json({ error: `${isAndroid ? 'Google Play' : 'App Store'} URL is required` });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Check if category exists
    const [categoryExists] = await db.select().from(categories).where(eq(categories.id, categoryId));
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    // Extraer el identificador según la tienda
    let storeId = '';
    let originalAppId = '';

    if (isAndroid) {
      // Extract package name from Google Play URL
      const urlPattern = /https:\/\/play\.google\.com\/store\/apps\/details\?id=([^&]+)/;
      const packageMatch = storeUrl.match(urlPattern);
      storeId = packageMatch && packageMatch[1] ? packageMatch[1] : storeUrl;
      originalAppId = storeId;
    } else {
      // Extract app ID from App Store URL
      // Formato: https://apps.apple.com/{country}/app/{app-name}/id{id}
      const urlPattern = /\/id(\d+)/;
      const idMatch = storeUrl.match(urlPattern);
      storeId = idMatch && idMatch[1] ? idMatch[1] : storeUrl;
      originalAppId = storeId;
    }

    if (!storeId) {
      return res.status(400).json({ error: `Invalid ${isAndroid ? 'Google Play' : 'App Store'} URL` });
    }

    // Generate app ID if not provided
    const appId = customAppId || generateAppId(storeId);

    // Check if app already exists
    const [existingApp] = await db.select().from(apps).where(eq(apps.id, appId));
    if (existingApp) {
      return res.status(409).json({ error: 'App with this ID already exists' });
    }

    try {
      // Fetch app data from the appropriate store
      let appData;
      let screenshots: string[] = [];
      let downloads = '1K+';
      let rating = 0;
      let requires = '';

      if (isAndroid) {
        // Fetch from Google Play
        appData = await gplay.app({
          appId: storeId,
          lang: 'en',
          country: 'us'
        });

        screenshots = appData.screenshots || [];
        rating = typeof appData.score === 'number' ? appData.score : 0;
        
        // Format downloads
        downloads = appData.reviews > 1000000 
          ? `${Math.floor(appData.reviews / 1000000)}M+` 
          : appData.reviews > 1000 
            ? `${Math.floor(appData.reviews / 1000)}K+` 
            : `${appData.reviews}+`;
            
        requires = 'Android 5.0+';
      } else {
        // Fetch from App Store
        appData = await appStore.app({
          id: storeId,
          country: 'us'
        });

        screenshots = appData.screenshots || [];
        
        rating = typeof appData.score === 'number' ? appData.score : 0;
        
        // No tenemos datos exactos de descargas en App Store
        downloads = appData.reviews > 1000000 
          ? `${Math.floor(appData.reviews / 1000000)}M+` 
          : appData.reviews > 1000 
            ? `${Math.floor(appData.reviews / 1000)}K+` 
            : `${appData.reviews}+`;
            
        requires = appData.requiredOsVersion ? `iOS ${appData.requiredOsVersion}+` : 'iOS 12.0+';
      }

      // Insert app into database con los datos obtenidos
      const [newApp] = await db.insert(apps).values({
        id: appId,
        name: appData.title,
        categoryId: categoryId,
        description: appData.description || '',
        iconUrl: appData.icon || '',
        screenshots: screenshots,
        rating: rating,
        downloads: downloads,
        version: appData.version || '',
        size: appData.size || '',
        updated: appData.updated || new Date().toDateString(),
        requires: requires,
        developer: appData.developer || '',
        installs: downloads,
        downloadUrl: appData.url || storeUrl,
        googlePlayUrl: isAndroid ? appData.url || googlePlayUrl : '',
        iosAppStoreUrl: !isAndroid ? appData.url || appStoreUrl : '',
        originalAppId: originalAppId,
        lastSyncedAt: new Date()
      }).returning();

      // Return created app
      return res.status(201).json(newApp);
    } catch (error) {
      log(`Error fetching app data from ${isAndroid ? 'Google Play' : 'App Store'}: ${error}`, 'error');
      return res.status(500).json({ error: `Failed to fetch app data from ${isAndroid ? 'Google Play' : 'App Store'}` });
    }
  } catch (error) {
    log(`Error importing app: ${error}`, 'error');
    return res.status(500).json({ error: 'Server error' });
  }
}

// Helper to generate app ID from store ID
function generateAppId(storeId: string): string {
  // Extract the app name part to create a friendly ID
  const parts = storeId.split('.');
  let appId = '';
  
  if (parts.length > 1) {
    // Google Play IDs like com.company.appname
    appId = parts[parts.length - 1].toLowerCase();
  } else {
    // App Store numeric IDs
    // Try to get the last part of URL if available
    appId = `app${storeId}`;
  }
  
  // Clean up app ID (only lowercase letters, numbers, and dashes)
  appId = appId.replace(/[^a-z0-9-]/g, '-');
  
  return appId;
}