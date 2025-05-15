import * as cron from 'node-cron';
import { syncAllApps } from './app-sync-service';
import { log } from './vite';

/// <reference path="./types/node-cron.d.ts" />

// Default schedule: Every day at midnight
const DEFAULT_SCHEDULE = '0 0 * * *';

/**
 * Initialize the app data synchronization scheduler
 */
export function initializeAppSyncScheduler(schedule = DEFAULT_SCHEDULE) {
  // Validate the schedule
  if (!cron.validate(schedule)) {
    log(`Invalid cron schedule: ${schedule}, using default`, 'error');
    schedule = DEFAULT_SCHEDULE;
  }

  // Schedule the task
  const task = cron.schedule(schedule, async () => {
    log('Running scheduled app data synchronization', 'scheduler');
    try {
      const updatedCount = await syncAllApps();
      log(`Scheduled sync completed. Updated ${updatedCount} apps.`, 'scheduler');
    } catch (error) {
      log(`Error in scheduled sync: ${error}`, 'error');
    }
  }, {
    scheduled: true,
    timezone: 'UTC' // Use UTC timezone for consistency
  });

  log(`App sync scheduler initialized with schedule: ${schedule}`, 'scheduler');

  // Run an initial sync when the server starts
  setTimeout(async () => {
    log('Running initial app data synchronization', 'scheduler');
    try {
      const updatedCount = await syncAllApps();
      log(`Initial sync completed. Updated ${updatedCount} apps.`, 'scheduler');
    } catch (error) {
      log(`Error in initial sync: ${error}`, 'error');
    }
  }, 10000); // Wait 10 seconds after server start

  return task;
}