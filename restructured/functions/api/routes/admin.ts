/**
 * Admin Routes
 * 
 * API endpoints for admin operations
 */

import { eq, desc, asc, sql } from 'drizzle-orm';
import { createDbClient } from '../db';
import { 
  apps, 
  categories, 
  affiliateLinks, 
  appVersionHistory, 
  insertAppSchema, 
  insertCategorySchema 
} from '../../../shared/schema';
import { syncAppInfo, syncAllApps } from '../app-sync-service';
import type { ApiResponse } from '../../../shared/schema';

// Helper to check if user is admin
async function isAdmin(req: any): Promise<boolean> {
  if (!req.userId) return false;
  
  try {
    const { db } = createDbClient();
    const [user] = await db
      .select()
      .from({ u: 'users' })
      .where(eq({ 'id': 'u.id' } as any, req.userId));
    
    return user?.isAdmin === true;
  } catch (error) {
    console.error('[Auth] Admin check error:', error);
    return false;
  }
}

export function registerAdminRoutes(router: any) {
  // Admin dashboard data
  router.get('/admin/dashboard', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { db } = createDbClient();
      
      // Get counts
      const [appCount] = await db
        .select({ count: sql`count(*)` })
        .from(apps);
      
      const [categoryCount] = await db
        .select({ count: sql`count(*)` })
        .from(categories);
      
      const [affiliateLinkCount] = await db
        .select({ count: sql`count(*)` })
        .from(affiliateLinks);
      
      const [totalClicks] = await db
        .select({ sum: sql`sum(click_count)` })
        .from(affiliateLinks);
      
      // Get latest updated apps
      const latestUpdatedApps = await db
        .select()
        .from(apps)
        .orderBy(desc(apps.lastSyncedAt))
        .limit(5);
      
      // Get top affiliate links
      const topAffiliateLinks = await db
        .select()
        .from(affiliateLinks)
        .orderBy(desc(affiliateLinks.clickCount))
        .limit(5);
      
      // Enhance affiliate links with app names
      const enhancedLinks = await Promise.all(
        topAffiliateLinks.map(async (link) => {
          const [app] = await db
            .select({ name: apps.name })
            .from(apps)
            .where(eq(apps.id, link.appId));
          
          return {
            ...link,
            appName: app?.name || 'Unknown App',
          };
        })
      );
      
      res.json({
        success: true,
        data: {
          counts: {
            apps: Number(appCount.count) || 0,
            categories: Number(categoryCount.count) || 0,
            affiliateLinks: Number(affiliateLinkCount.count) || 0,
            totalClicks: Number(totalClicks.sum) || 0,
          },
          latestUpdatedApps,
          topAffiliateLinks: enhancedLinks,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error fetching admin dashboard data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Create app (admin only)
  router.post('/admin/apps', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Validate request body
      const result = insertAppSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid app data',
          details: result.error.errors,
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { db } = createDbClient();
      
      // Check if category exists
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, result.data.categoryId));
      
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Create app
      const [app] = await db
        .insert(apps)
        .values(result.data)
        .returning();
      
      res.status(201).json({
        success: true,
        data: {
          ...app,
          category: category.name,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error creating app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create app',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Update app (admin only)
  router.patch('/admin/apps/:id', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Check if app exists
      const [existingApp] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      if (!existingApp) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Update app
      const [updatedApp] = await db
        .update(apps)
        .set(req.body)
        .where(eq(apps.id, id))
        .returning();
      
      // Get category name
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, updatedApp.categoryId));
      
      res.json({
        success: true,
        data: {
          ...updatedApp,
          category: category.name,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error updating app ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to update app',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Delete app (admin only)
  router.delete('/admin/apps/:id', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Check if app exists
      const [existingApp] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      if (!existingApp) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Delete affiliated links first
      await db
        .delete(affiliateLinks)
        .where(eq(affiliateLinks.appId, id));
      
      // Delete version history
      await db
        .delete(appVersionHistory)
        .where(eq(appVersionHistory.appId, id));
      
      // Delete app
      await db
        .delete(apps)
        .where(eq(apps.id, id));
      
      res.json({
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error deleting app ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete app',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Create category (admin only)
  router.post('/admin/categories', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Validate request body
      const result = insertCategorySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category data',
          details: result.error.errors,
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { db } = createDbClient();
      
      // Check if category ID already exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, result.data.id));
      
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          error: 'Category ID already exists',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Create category
      const [category] = await db
        .insert(categories)
        .values(result.data)
        .returning();
      
      res.status(201).json({
        success: true,
        data: category,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error creating category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create category',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Update category (admin only)
  router.patch('/admin/categories/:id', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Update category
      const [updatedCategory] = await db
        .update(categories)
        .set(req.body)
        .where(eq(categories.id, id))
        .returning();
      
      res.json({
        success: true,
        data: updatedCategory,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error updating category ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to update category',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Delete category (admin only)
  router.delete('/admin/categories/:id', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Check if category has apps
      const [appCount] = await db
        .select({ count: sql`count(*)` })
        .from(apps)
        .where(eq(apps.categoryId, id));
      
      if (Number(appCount.count) > 0) {
        return res.status(409).json({
          success: false,
          error: 'Cannot delete category with apps',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Delete category
      await db
        .delete(categories)
        .where(eq(categories.id, id));
      
      res.json({
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error deleting category ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete category',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Sync app data with app stores (admin only)
  router.post('/admin/apps/:id/sync', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { id } = req.params;
      const { storeType = 'both' } = req.body;
      const { db } = createDbClient();
      
      // Check if app exists
      const [existingApp] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      if (!existingApp) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Sync app data
      await syncAppInfo(id, storeType as any);
      
      // Get updated app
      const [updatedApp] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      // Get category name
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, updatedApp.categoryId));
      
      res.json({
        success: true,
        data: {
          ...updatedApp,
          category: category.name,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error syncing app ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync app data',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Sync all apps with app stores (admin only)
  router.post('/admin/apps/sync-all', async (req: any, res: any) => {
    try {
      // Check if user is admin
      if (!(await isAdmin(req))) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { storeTypes = ['android', 'ios', 'both'] } = req.body;
      
      // Start sync process (async)
      syncAllApps(storeTypes).catch(error => {
        console.error('[API] Error in sync all apps background process:', error);
      });
      
      res.json({
        success: true,
        data: {
          message: 'Sync process started in the background',
          startedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error starting sync all apps process:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start sync process',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
}