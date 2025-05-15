/**
 * Category Routes
 * 
 * API endpoints for category-related operations
 */

import { eq } from 'drizzle-orm';
import { createDbClient } from '../db';
import { apps, categories } from '../../../shared/schema';
import type { ApiResponse } from '../../../shared/schema';

export function registerCategoryRoutes(router: any) {
  // Get all categories
  router.get('/categories', async (req: any, res: any) => {
    try {
      const { db } = createDbClient();
      const allCategories = await db
        .select()
        .from(categories);
      
      res.json(allCategories);
    } catch (error) {
      console.error('[API] Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get category by ID
  router.get('/categories/:id', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { db } = createDbClient();
      
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      res.json(category);
    } catch (error) {
      console.error(`[API] Error fetching category ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch category details',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get apps by category
  router.get('/categories/:id/apps', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Verify category exists
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));
      
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Get apps in this category
      const categoryApps = await db
        .select()
        .from(apps)
        .where(eq(apps.categoryId, id));
      
      // Add category name to each app
      const appsWithCategory = categoryApps.map(app => ({
        ...app,
        category: category.name,
      }));
      
      res.json(appsWithCategory);
    } catch (error) {
      console.error(`[API] Error fetching apps for category ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch category apps',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
}