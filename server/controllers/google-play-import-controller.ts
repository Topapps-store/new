import { Request, Response } from 'express';
import { syncAppInfo } from '../app-sync-service';
import { db } from '../db';
import { apps, categories } from '@shared/schema';
import { eq } from 'drizzle-orm';
import gplay from 'google-play-scraper';
import { log } from '../vite';

/**
 * Import app data from Google Play Store
 */
export async function importFromGooglePlay(req: Request, res: Response) {
  try {
    const { googlePlayUrl, categoryId, customAppId } = req.body;

    if (!googlePlayUrl) {
      return res.status(400).json({ error: 'Google Play URL is required' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Check if category exists
    const [categoryExists] = await db.select().from(categories).where(eq(categories.id, categoryId));
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    // Extract package name from Google Play URL
    const urlPattern = /https:\/\/play\.google\.com\/store\/apps\/details\?id=([^&]+)/;
    const packageMatch = googlePlayUrl.match(urlPattern);
    const packageName = packageMatch && packageMatch[1] ? packageMatch[1] : googlePlayUrl;

    if (!packageName) {
      return res.status(400).json({ error: 'Invalid Google Play URL' });
    }

    // Generate app ID if not provided
    const appId = customAppId || generateAppId(packageName);

    // Check if app already exists
    const [existingApp] = await db.select().from(apps).where(eq(apps.id, appId));
    if (existingApp) {
      return res.status(409).json({ error: 'App with this ID already exists' });
    }

    // Fetch app data from Google Play
    try {
      const appData = await gplay.app({
        appId: packageName,
        lang: 'en',
        country: 'us'
      });

      // Create screenshots array
      const screenshots = appData.screenshots || [];

      // Format downloads
      const downloads = appData.reviews > 1000000 
        ? `${Math.floor(appData.reviews / 1000000)}M+` 
        : appData.reviews > 1000 
          ? `${Math.floor(appData.reviews / 1000)}K+` 
          : `${appData.reviews}+`;

      // Insert app into database
      const [newApp] = await db.insert(apps).values({
        id: appId,
        name: appData.title,
        categoryId: categoryId,
        description: appData.description || '',
        iconUrl: appData.icon || '',
        screenshots: screenshots,
        rating: typeof appData.score === 'number' ? appData.score : 0,
        downloads: downloads,
        version: appData.version || '',
        size: appData.size || '',
        updated: appData.updated || new Date().toDateString(),
        requires: 'Android 5.0+',
        developer: appData.developer || '',
        installs: downloads,
        downloadUrl: appData.url || '',
        googlePlayUrl: appData.url || '',
        originalAppId: packageName,
        lastSyncedAt: new Date()
      }).returning();

      // Return created app
      return res.status(201).json(newApp);
    } catch (error) {
      log(`Error fetching app data from Google Play: ${error}`, 'error');
      return res.status(500).json({ error: 'Failed to fetch app data from Google Play' });
    }
  } catch (error) {
    log(`Error importing from Google Play: ${error}`, 'error');
    return res.status(500).json({ error: 'Server error' });
  }
}

// Helper to generate app ID from package name
function generateAppId(packageName: string): string {
  // Extract the last part after the last dot
  const parts = packageName.split('.');
  let appId = parts[parts.length - 1].toLowerCase();
  
  // Clean up app ID (only lowercase letters, numbers, and dashes)
  appId = appId.replace(/[^a-z0-9-]/g, '-');
  
  return appId;
}