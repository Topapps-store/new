import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Third batch of apps to update
const appsToUpdate = [
  { id: "shein", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zzkko", originalAppId: "com.zzkko" },
  { id: "rinse", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.rinse", originalAppId: "com.rinse" },
  { id: "lawnlove", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.lawnlove.customers", originalAppId: "com.lawnlove.customers" },
  { id: "doordash", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash", originalAppId: "com.dd.doordash" },
  { id: "lyft", googlePlayUrl: "https://play.google.com/store/apps/details?id=me.lyft.android", originalAppId: "me.lyft.android" }
];

/**
 * Update third batch of apps with Google Play Store information
 */
async function updateApps() {
  try {
    console.log(`Starting batch 3 update for ${appsToUpdate.length} apps...`);
    
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
    
    console.log("Batch 3 update completed!");
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error in batch update:", error);
    process.exit(1);
  }
}

updateApps();