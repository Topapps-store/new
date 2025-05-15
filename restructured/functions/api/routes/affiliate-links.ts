/**
 * Affiliate Link Routes
 * 
 * API endpoints for affiliate link management
 */

import { eq } from 'drizzle-orm';
import { createDbClient } from '../db';
import { affiliateLinks, apps, insertAffiliateLinkSchema } from '../../../shared/schema';
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

export function registerAffiliateLinkRoutes(router: any) {
  // Get affiliate links for an app
  router.get('/apps/:appId/affiliate-links', async (req: any, res: any) => {
    try {
      const { appId } = req.params;
      const { db } = createDbClient();
      
      // Check if app exists
      const [app] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, appId));
      
      if (!app) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Get active affiliate links for this app
      const links = await db
        .select()
        .from(affiliateLinks)
        .where(eq(affiliateLinks.appId, appId))
        .orderBy({ displayOrder: 'asc' });
      
      res.json(links);
    } catch (error) {
      console.error(`[API] Error fetching affiliate links for app ${req.params.appId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch affiliate links',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Track affiliate link click
  router.post('/affiliate-links/:id/click', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { db } = createDbClient();
      
      // Get the link
      const [link] = await db
        .select()
        .from(affiliateLinks)
        .where(eq(affiliateLinks.id, parseInt(id)));
      
      if (!link) {
        return res.status(404).json({
          success: false,
          error: 'Affiliate link not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Increment click count
      await db
        .update(affiliateLinks)
        .set({ clickCount: link.clickCount + 1 })
        .where(eq(affiliateLinks.id, parseInt(id)));
      
      res.json({
        success: true,
        data: { url: link.url },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error tracking affiliate link click ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to track click',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // --- Admin Routes ---
  
  // Create affiliate link (admin only)
  router.post('/admin/affiliate-links', async (req: any, res: any) => {
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
      const result = insertAffiliateLinkSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid affiliate link data',
          details: result.error.errors,
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { db } = createDbClient();
      
      // Check if app exists
      const [app] = await db
        .select()
        .from(apps)
        .where(eq(apps.id, result.data.appId));
      
      if (!app) {
        return res.status(404).json({
          success: false,
          error: 'App not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Create affiliate link
      const [link] = await db
        .insert(affiliateLinks)
        .values(result.data)
        .returning();
      
      res.status(201).json({
        success: true,
        data: link,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error creating affiliate link:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create affiliate link',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Update affiliate link (admin only)
  router.patch('/admin/affiliate-links/:id', async (req: any, res: any) => {
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
      
      // Check if link exists
      const [existingLink] = await db
        .select()
        .from(affiliateLinks)
        .where(eq(affiliateLinks.id, parseInt(id)));
      
      if (!existingLink) {
        return res.status(404).json({
          success: false,
          error: 'Affiliate link not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Update link
      const [updatedLink] = await db
        .update(affiliateLinks)
        .set(req.body)
        .where(eq(affiliateLinks.id, parseInt(id)))
        .returning();
      
      res.json({
        success: true,
        data: updatedLink,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error updating affiliate link ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to update affiliate link',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Delete affiliate link (admin only)
  router.delete('/admin/affiliate-links/:id', async (req: any, res: any) => {
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
      
      // Check if link exists
      const [existingLink] = await db
        .select()
        .from(affiliateLinks)
        .where(eq(affiliateLinks.id, parseInt(id)));
      
      if (!existingLink) {
        return res.status(404).json({
          success: false,
          error: 'Affiliate link not found',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Delete link
      await db
        .delete(affiliateLinks)
        .where(eq(affiliateLinks.id, parseInt(id)));
      
      res.json({
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[API] Error deleting affiliate link ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete affiliate link',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get affiliate link analytics (admin only)
  router.get('/admin/affiliate-links/analytics', async (req: any, res: any) => {
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
      
      // Get all affiliate links with their click counts
      const links = await db
        .select({
          id: affiliateLinks.id,
          appId: affiliateLinks.appId,
          label: affiliateLinks.label,
          url: affiliateLinks.url,
          clickCount: affiliateLinks.clickCount,
          createdAt: affiliateLinks.createdAt,
        })
        .from(affiliateLinks)
        .orderBy({ clickCount: 'desc' });
      
      // Enhance data with app names
      const enhancedLinks = await Promise.all(
        links.map(async (link) => {
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
        data: enhancedLinks,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API] Error fetching affiliate link analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
}