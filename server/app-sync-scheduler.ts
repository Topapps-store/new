import * as cron from 'node-cron';
import { syncAllApps } from './app-sync-service';
import { log } from './vite';

// Schedule to run once a day at midnight (server time)
const SYNC_SCHEDULE = '0 0 * * *';

/**
 * Initialize the app data synchronization scheduler
 */
export function initializeAppSyncScheduler() {
  try {
    // Validate that the cron schedule is correct
    if (!cron.validate(SYNC_SCHEDULE)) {
      throw new Error(`Invalid cron schedule: ${SYNC_SCHEDULE}`);
    }
    
    // Schedule the sync task
    const task = cron.schedule(SYNC_SCHEDULE, async () => {
      log('Starting scheduled app data synchronization', 'scheduler');
      try {
        const successCount = await syncAllApps();
        log(`Scheduled sync completed. Updated ${successCount} apps.`, 'scheduler');
      } catch (error) {
        log(`Error in scheduled app sync: ${error}`, 'error');
      }
    });
    
    log(`App sync scheduler initialized with schedule: ${SYNC_SCHEDULE}`, 'scheduler');
    
    // Run an initial sync on startup (after a 10-second delay to let the server initialize)
    setTimeout(async () => {
      log('Running initial app data synchronization', 'scheduler');
      try {
        const successCount = await syncAllApps();
        log(`Initial sync completed. Updated ${successCount} apps.`, 'scheduler');
      } catch (error) {
        log(`Error in initial app sync: ${error}`, 'error');
      }
    }, 10000);
    
    return task;
  } catch (error) {
    log(`Failed to initialize app sync scheduler: ${error}`, 'error');
    return null;
  }
}