import { syncAppInfo } from "../server/app-sync-service";

/**
 * Sync the GrubHub app with the Google Play Store
 */
async function syncGrubhub() {
  try {
    console.log("Syncing GrubHub app with Google Play Store...");
    
    // Sync the app (update with latest data from Google Play)
    const result = await syncAppInfo("grubhub", "android");
    
    if (result) {
      console.log("Successfully synced GrubHub app with Google Play Store");
    } else {
      console.log("Failed to sync GrubHub app");
    }
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error syncing GrubHub app:", error);
    process.exit(1);
  }
}

syncGrubhub();