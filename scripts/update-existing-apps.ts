import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// List of apps to update
const appsToUpdate = [
  { id: "taskrabbit", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer", originalAppId: "com.taskrabbit.droid.consumer" },
  { id: "zocdoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zocdoc.android", originalAppId: "com.zocdoc.android" },
  { id: "parkmobile", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2", originalAppId: "net.sharewire.parkmobilev2" }
];

async function updateApps() {
  console.log(`Updating ${appsToUpdate.length} existing apps...`);
  
  for (const appInfo of appsToUpdate) {
    try {
      console.log(`Updating app: ${appInfo.id}`);
      
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
      }
    } catch (error) {
      console.error(`Error updating app ${appInfo.id}:`, error);
    }
  }
  
  console.log("All updates completed!");
}

// Run the function
updateApps()
  .then(() => {
    console.log("Process complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error in process:", error);
    process.exit(1);
  });