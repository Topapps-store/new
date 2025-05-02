import { syncAppInfo } from "../server/app-sync-service";

/**
 * Sync the Amazon app with the Google Play Store
 */
async function syncAmazon() {
  try {
    console.log("Syncing Amazon app with Google Play Store...");
    
    // Sync the app (update with latest data from Google Play)
    const result = await syncAppInfo("amazon", "android");
    
    if (result) {
      console.log("Successfully synced Amazon app with Google Play Store");
    } else {
      console.log("Failed to sync Amazon app");
    }
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error syncing Amazon app:", error);
    process.exit(1);
  }
}

syncAmazon();