import { Request, Response } from 'express';
import { storage } from '../storage';
import { syncAppInfo } from '../app-sync-service';

/**
 * Get list of apps for admin dashboard
 */
export async function getAppsForAdmin(req: Request, res: Response) {
  try {
    const apps = await storage.getApps();
    return res.status(200).json(apps);
  } catch (error) {
    console.error('Admin getApps error:', error);
    return res.status(500).json({ message: 'Error fetching apps' });
  }
}

/**
 * Get app details for admin editing
 */
export async function getAppForAdmin(req: Request, res: Response) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'App ID is required' });
  }
  
  try {
    const app = await storage.getAppById(id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    
    // Get affiliate links for this app
    const affiliateLinks = await storage.getAffiliateLinks(id);
    
    return res.status(200).json({
      app,
      affiliateLinks
    });
  } catch (error) {
    console.error('Admin getApp error:', error);
    return res.status(500).json({ message: 'Error fetching app details' });
  }
}

/**
 * Update app details
 */
export async function updateApp(req: Request, res: Response) {
  const { id } = req.params;
  const appData = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'App ID is required' });
  }
  
  try {
    const app = await storage.getAppById(id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    
    // Update app
    const updatedApp = await storage.updateApp(id, appData);
    
    return res.status(200).json(updatedApp);
  } catch (error) {
    console.error('Admin updateApp error:', error);
    return res.status(500).json({ message: 'Error updating app' });
  }
}

/**
 * Manually sync app with app store
 */
export async function syncApp(req: Request, res: Response) {
  const { id } = req.params;
  const { storeType } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'App ID is required' });
  }
  
  if (!storeType || !['android', 'ios', 'both'].includes(storeType)) {
    return res.status(400).json({ message: 'Valid storeType is required (android, ios, or both)' });
  }
  
  try {
    const app = await storage.getAppById(id);
    
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    
    // Trigger app sync
    await syncAppInfo(id, storeType as 'android' | 'ios' | 'both');
    
    // Get updated app
    const updatedApp = await storage.getAppById(id);
    
    return res.status(200).json(updatedApp);
  } catch (error) {
    console.error('Admin syncApp error:', error);
    return res.status(500).json({ message: 'Error syncing app', error: (error as Error).message });
  }
}

/**
 * Get all affiliate links
 */
export async function getAffiliateLinks(req: Request, res: Response) {
  try {
    const links = await storage.getAllAffiliateLinks();
    return res.status(200).json(links);
  } catch (error) {
    console.error('Admin getAffiliateLinks error:', error);
    return res.status(500).json({ message: 'Error fetching affiliate links' });
  }
}

/**
 * Create affiliate link
 */
export async function createAffiliateLink(req: Request, res: Response) {
  const linkData = req.body;
  
  try {
    const link = await storage.createAffiliateLink(linkData);
    return res.status(201).json(link);
  } catch (error) {
    console.error('Admin createAffiliateLink error:', error);
    return res.status(500).json({ message: 'Error creating affiliate link' });
  }
}

/**
 * Update affiliate link
 */
export async function updateAffiliateLink(req: Request, res: Response) {
  const { id } = req.params;
  const linkData = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'Link ID is required' });
  }
  
  try {
    const link = await storage.getAffiliateLinkById(Number(id));
    
    if (!link) {
      return res.status(404).json({ message: 'Affiliate link not found' });
    }
    
    // Update link
    const updatedLink = await storage.updateAffiliateLink(Number(id), linkData);
    
    return res.status(200).json(updatedLink);
  } catch (error) {
    console.error('Admin updateAffiliateLink error:', error);
    return res.status(500).json({ message: 'Error updating affiliate link' });
  }
}

/**
 * Delete affiliate link
 */
export async function deleteAffiliateLink(req: Request, res: Response) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'Link ID is required' });
  }
  
  try {
    const link = await storage.getAffiliateLinkById(Number(id));
    
    if (!link) {
      return res.status(404).json({ message: 'Affiliate link not found' });
    }
    
    // Delete link
    await storage.deleteAffiliateLink(Number(id));
    
    return res.status(200).json({ message: 'Affiliate link deleted successfully' });
  } catch (error) {
    console.error('Admin deleteAffiliateLink error:', error);
    return res.status(500).json({ message: 'Error deleting affiliate link' });
  }
}

/**
 * Get affiliate link analytics
 */
export async function getAffiliateLinkAnalytics(req: Request, res: Response) {
  try {
    const analytics = await storage.getAffiliateLinkAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    console.error('Admin getAffiliateLinkAnalytics error:', error);
    return res.status(500).json({ message: 'Error fetching affiliate link analytics' });
  }
}