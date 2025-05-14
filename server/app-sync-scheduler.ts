import cron from 'node-cron';
import { syncAllApps } from './app-sync-service';
import { log } from './vite';

// Default schedule is every day at 4:00 AM
const DEFAULT_SCHEDULE = '0 4 * * *';

let syncJob: ReturnType<typeof cron.schedule> | null = null;

/**
 * Initialize the app data synchronization scheduler
 */
export function initializeAppSyncScheduler(schedule = DEFAULT_SCHEDULE) {
  if (syncJob) {
    syncJob.stop();
  }

  syncJob = cron.schedule(schedule, async () => {
    log('Starting scheduled app sync operation', 'info');
    try {
      const syncedCount = await syncAllApps();
      log(`Scheduled app sync completed. Updated ${syncedCount} apps successfully.`, 'info');
    } catch (error) {
      log(`Error during scheduled app sync: ${error}`, 'error');
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  log(`App sync scheduler initialized with schedule: ${schedule}`, 'info');
  return syncJob;
}

/**
 * Stop the app sync scheduler
 */
export function stopAppSyncScheduler() {
  if (syncJob) {
    syncJob.stop();
    syncJob = null;
    log('App sync scheduler stopped', 'info');
    return true;
  }
  return false;
}

/**
 * Run a manual sync of all apps
 */
export async function runManualSync() {
  log('Starting manual app sync operation', 'info');
  try {
    const syncedCount = await syncAllApps();
    log(`Manual app sync completed. Updated ${syncedCount} apps successfully.`, 'info');
    return syncedCount;
  } catch (error) {
    log(`Error during manual app sync: ${error}`, 'error');
    throw error;
  }
}