import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Fourth batch of apps to update
const appsToUpdate = [
  { id: "turo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.relayrides.android.relayrides", originalAppId: "com.relayrides.android.relayrides" },
  { id: "bird", googlePlayUrl: "https://play.google.com/store/apps/details?id=co.bird.android", originalAppId: "co.bird.android" },
  { id: "lime", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.limebike", originalAppId: "com.limebike" },
  { id: "easypark", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.easypark.android", originalAppId: "net.easypark.android" },
  { id: "parkmobile", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2", originalAppId: "net.sharewire.parkmobilev2" }
];

/**
 * Update fourth batch of apps with Google Play Store information
 */
async function updateApps() {
  try {
    console.log(`Starting batch 4 update for ${appsToUpdate.length} apps...`);
    
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
    
    console.log("Batch 4 update completed!");
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error in batch update:", error);
    process.exit(1);
  }
}

updateApps();