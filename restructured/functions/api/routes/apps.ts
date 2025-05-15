/**
 * App Routes
 * 
 * API endpoints for app-related operations
 */

import { eq, desc, sql, like } from 'drizzle-orm';
import { createDbClient } from '../db';
import { apps, categories } from '../../../shared/schema';
import type { ApiResponse } from '../../../shared/schema';

export function registerAppRoutes(router: any) {
  // Get all apps
  router.get('/apps', async (req: any, res: any) => {
    try {
      const { db } = createDbClient();
      const allApps = await db.select().from(apps);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        allApps.map(async (app) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, app.categoryId));
          
          return {
            ...app,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error('[API] Error fetching apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get popular apps
  router.get('/apps/popular', async (req: any, res: any) => {
    try {
      const { db } = createDbClient();
      const popularApps = await db
        .select()
        .from(apps)
        .orderBy(desc(apps.rating))
        .limit(10);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        popularApps.map(async (app) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, app.categoryId));
          
          return {
            ...app,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error('[API] Error fetching popular apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch popular apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get recent apps
  router.get('/apps/recent', async (req: any, res: any) => {
    try {
      const { db } = createDbClient();
      const recentApps = await db
        .select()
        .from(apps)
        .orderBy(desc(apps.createdAt))
        .limit(10);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        recentApps.map(async (app) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, app.categoryId));
          
          return {
            ...app,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error('[API] Error fetching recent apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get "just in time" apps (a mix of popular and recent)
  router.get('/apps/just-in-time', async (req: any, res: any) => {
    try {
      const { db } = createDbClient();
      
      // Custom query to get a mix of popular and recently updated apps
      const justInTimeApps = await db
        .select()
        .from(apps)
        .orderBy(sql`(rating * 0.7) + (extract(epoch from last_synced_at) / extract(epoch from now()) * 0.3) DESC`)
        .limit(10);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        justInTimeApps.map(async (app) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, app.categoryId));
          
          return {
            ...app,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error('[API] Error fetching just-in-time apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch just-in-time apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get app by ID
  router.get('/apps/:id', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { db } = createDbClient();
      
      const [app] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      if (!app) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Get category name
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, app.categoryId));
      
      res.json({
        ...app,
        category: category.name,
      });
    } catch (error) {
      console.error(`[API] Error fetching app ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch app details',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Search apps
  router.get('/apps/search', async (req: any, res: any) => {
    try {
      const { query } = req.query;
      
      if (!query || query.trim() === '') {
        return res.json([]);
      }
      
      const { db } = createDbClient();
      
      // Search by name or developer
      const searchResults = await db
        .select()
        .from(apps)
        .where(
          sql`LOWER(name) LIKE LOWER(${`%${query}%`}) OR LOWER(developer) LIKE LOWER(${`%${query}%`})`
        )
        .limit(20);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        searchResults.map(async (app) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, app.categoryId));
          
          return {
            ...app,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error('[API] Error searching apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get related apps
  router.get('/apps/:id/related', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Get the app's category
      const [app] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, id));
      
      if (!app) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Get other apps in the same category
      const relatedApps = await db
        .select()
        .from(apps)
        .where(
          sql`category_id = ${app.categoryId} AND id != ${id}`
        )
        .limit(5);
      
      // Get category names for each app
      const appsWithCategories = await Promise.all(
        relatedApps.map(async (relatedApp) => {
          const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, relatedApp.categoryId));
          
          return {
            ...relatedApp,
            category: category.name,
          };
        })
      );
      
      res.json(appsWithCategories);
    } catch (error) {
      console.error(`[API] Error fetching related apps for ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch related apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
}