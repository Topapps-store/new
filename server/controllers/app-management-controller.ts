import { Request, Response } from 'express';
import { storage } from '../storage';
import { syncAppInfo } from '../app-sync-service';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Convert fs.writeFile to promise-based
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

/**
 * Get app details for admin editing
 */
export async function getAppForAdmin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const app = await storage.getAppById(id);
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json(app);
  } catch (error) {
    console.error('Error getting app:', error);
    res.status(500).json({ error: 'Failed to get app details' });
  }
}

/**
 * Create a new app
 */
export async function createApp(req: Request, res: Response) {
  try {
    const appData = req.body;
    
    // Basic validation
    if (!appData.id || !appData.name || !appData.description || !appData.categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if app with this ID already exists
    const existingApp = await storage.getAppById(appData.id);
    if (existingApp) {
      return res.status(409).json({ error: 'App with this ID already exists' });
    }
    
    // Format: Add required fields with defaults if not provided
    const formattedAppData = {
      id: appData.id,
      originalAppId: appData.id, // Use the same ID as originalAppId for consistency
      name: appData.name,
      categoryId: appData.categoryId,
      description: appData.description,
      iconUrl: "https://via.placeholder.com/512", // Default placeholder
      screenshots: [],
      rating: parseFloat(appData.rating) || 4.0,
      downloads: "0+",
      version: appData.version || "1.0",
      size: appData.size || "Varies",
      updated: new Date().toISOString(),
      requires: appData.requires || "Android 5.0+",
      developer: appData.developer || "Unknown",
      installs: "0+",
      googlePlayUrl: appData.googlePlayUrl || "",
      iosAppStoreUrl: appData.iosAppStoreUrl || "",
      createdAt: new Date()
    };
    
    // Create the app
    const createdApp = await storage.updateApp(appData.id, formattedAppData);
    
    // If app creation was successful
    if (createdApp) {
      res.status(201).json(createdApp);
    } else {
      res.status(500).json({ error: 'Failed to create app' });
    }
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: 'Failed to create app' });
  }
}

/**
 * Update app details
 */
export async function updateApp(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const appData = req.body;
    
    // Check if app exists
    const existingApp = await storage.getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Update the app
    const updatedApp = await storage.updateApp(id, {
      ...appData,
      rating: parseFloat(appData.rating) || existingApp.rating,
      updated: new Date().toISOString(),
    });
    
    if (updatedApp) {
      res.json(updatedApp);
    } else {
      res.status(500).json({ error: 'Failed to update app' });
    }
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Failed to update app' });
  }
}

/**
 * Delete app
 */
export async function deleteApp(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Check if app exists
    const existingApp = await storage.getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Delete the app
    const success = await storage.deleteApp(id);
    
    if (success) {
      res.json({ success: true, message: 'App deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete app' });
    }
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: 'Failed to delete app' });
  }
}

/**
 * Upload app logo
 */
export async function uploadLogo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Check if app exists
    const existingApp = await storage.getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create directory if it doesn't exist
    const uploadsDir = path.join('client', 'public', 'uploads', 'logos');
    try {
      await access(uploadsDir, fs.constants.F_OK);
    } catch (err) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Save the file
    const filename = `${id}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
    const filePath = path.join(uploadsDir, filename);
    
    await writeFile(filePath, req.file.buffer);
    
    // Update the app with the new logo URL
    const logoUrl = `/uploads/logos/${filename}`;
    const updatedApp = await storage.updateApp(id, {
      iconUrl: logoUrl,
      updated: new Date().toISOString(),
    });
    
    if (updatedApp) {
      res.json({ 
        success: true, 
        message: 'Logo uploaded successfully',
        logoUrl 
      });
    } else {
      res.status(500).json({ error: 'Failed to update app with new logo' });
    }
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
}

/**
 * Update app logo from URL
 */
export async function updateLogoFromUrl(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { logoUrl } = req.body;
    
    if (!logoUrl) {
      return res.status(400).json({ error: 'No logo URL provided' });
    }
    
    // Check if app exists
    const existingApp = await storage.getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Update the app with the new logo URL
    const updatedApp = await storage.updateApp(id, {
      iconUrl: logoUrl,
      updated: new Date().toISOString(),
    });
    
    if (updatedApp) {
      res.json({ 
        success: true, 
        message: 'Logo URL updated successfully' 
      });
    } else {
      res.status(500).json({ error: 'Failed to update app with new logo URL' });
    }
  } catch (error) {
    console.error('Error updating logo URL:', error);
    res.status(500).json({ error: 'Failed to update logo URL' });
  }
}

/**
 * Manually sync a single app with app store
 */
export async function manualSyncApp(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Check if app exists
    const existingApp = await storage.getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Determine store type
    let storeType: 'android' | 'ios' | 'both' = 'android';
    if (existingApp.iosAppStoreUrl && !existingApp.googlePlayUrl) {
      storeType = 'ios';
    } else if (existingApp.iosAppStoreUrl && existingApp.googlePlayUrl) {
      storeType = 'both';
    }
    
    // Sync the app info
    const success = await syncAppInfo(id, storeType);
    
    if (success) {
      // Get the updated app
      const updatedApp = await storage.getAppById(id);
      res.json({ 
        success: true, 
        message: 'App synced successfully',
        app: updatedApp
      });
    } else {
      res.status(500).json({ error: 'Failed to sync app' });
    }
  } catch (error) {
    console.error('Error syncing app:', error);
    res.status(500).json({ error: 'Failed to sync app' });
  }
}