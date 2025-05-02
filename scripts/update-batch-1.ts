import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// First batch of apps to update
const appsToUpdate = [
  { id: "ubereats", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab.eats", originalAppId: "com.ubercab.eats" },
  { id: "instacart", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instacart.shopper", originalAppId: "com.instacart.shopper" },
  { id: "cashapp", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.squareup.cash", originalAppId: "com.squareup.cash" },
  { id: "venmo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.venmo", originalAppId: "com.venmo" },
  { id: "zelle", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zellepay.zelle", originalAppId: "com.zellepay.zelle" },
  { id: "taskrabbit", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer", originalAppId: "com.taskrabbit.droid.consumer" }
];

/**
 * Update first batch of apps with Google Play Store information
 */
async function updateApps() {
  try {
    console.log(`Starting batch 1 update for ${appsToUpdate.length} apps...`);
    
    // Process each app
    for (const appInfo of appsToUpdate) {
      console.log(`Processing app: ${appInfo.id}`);
      
      try {
        // Update existing app
        const [updatedApp] = await db.update(apps)
          .set({
            googlePlayUrl: appInfo.googlePlayUrl,
            originalAppId: appInfo.originalAppId,
            isAffiliate: true
          })
          .where(eq(apps.id, appInfo.id))
          .returning();
        
        if (updatedApp) {
          console.log(`✓ Updated app: ${appInfo.id}`);
          
          // Sync with Google Play
          const syncResult = await syncAppInfo(appInfo.id, "android");
          if (syncResult) {
            console.log(`✓ Synced app: ${appInfo.id}`);
          } else {
            console.log(`✗ Failed to sync app: ${appInfo.id}`);
          }
        } else {
          console.log(`✗ Failed to update app: ${appInfo.id} - app not found`);
        }
      } catch (error) {
        console.error(`Error processing app ${appInfo.id}:`, error);
      }
    }
    
    console.log("Batch 1 update completed!");
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error in batch update:", error);
    process.exit(1);
  }
}

updateApps();