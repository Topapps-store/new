import { Request, Response } from 'express';
import { syncAppInfo, syncAllApps } from '../app-sync-service';
import { z } from 'zod';
import { log } from '../vite';

// Validation schema for sync single app request
const syncAppRequestSchema = z.object({
  appId: z.string().min(1),
  storeType: z.enum(['android', 'ios', 'both']).default('android')
});

/**
 * Sync a single app's data from the respective app store
 */
export async function syncApp(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = syncAppRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: validationResult.error.errors
      });
    }
    
    const { appId, storeType } = validationResult.data;
    
    // Perform the sync
    const success = await syncAppInfo(appId, storeType);
    
    if (success) {
      return res.status(200).json({
        message: `App ${appId} synchronized successfully from ${storeType} store(s)`
      });
    } else {
      return res.status(404).json({
        message: `Failed to sync app ${appId}. App not found or store data unavailable.`
      });
    }
  } catch (error) {
    log(`Error in syncApp controller: ${error}`, 'error');
    return res.status(500).json({
      message: 'Failed to sync app data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Sync all apps in the database
 */
export async function syncAllAppsController(req: Request, res: Response) {
  try {
    // Start sync as async operation
    res.status(202).json({
      message: 'App synchronization started. This may take some time to complete.'
    });
    
    // Perform the sync in the background
    syncAllApps()
      .then(count => {
        log(`Background sync completed. Updated ${count} apps.`, 'app-sync');
      })
      .catch(error => {
        log(`Error in background sync: ${error}`, 'error');
      });
  } catch (error) {
    log(`Error in syncAllAppsController: ${error}`, 'error');
    return res.status(500).json({
      message: 'Failed to start app sync',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}