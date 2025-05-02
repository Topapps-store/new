import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Apps to update with correct information
const appsToUpdate = [
  { 
    id: "whatsappbusiness", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.whatsapp.w4b", 
    originalAppId: "com.whatsapp.w4b",
    name: "WhatsApp Business",
    developer: "WhatsApp LLC",
    category: "business"
  },
  { 
    id: "zelle", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zellepay.zelle", 
    originalAppId: "com.zellepay.zelle",
    name: "Zelle",
    developer: "Early Warning Services, LLC",
    category: "finance"
  }
];

async function updateApps() {
  console.log("Updating WhatsApp Business and Zelle apps with latest information...");
  
  for (const appInfo of appsToUpdate) {
    try {
      console.log(`Updating app: ${appInfo.id}`);
      
      // First update the basic app information
      const [updatedApp] = await db.update(apps)
        .set({
          name: appInfo.name,
          developer: appInfo.developer,
          googlePlayUrl: appInfo.googlePlayUrl,
          originalAppId: appInfo.originalAppId,
          isAffiliate: true,
          lastSyncedAt: new Date()
        })
        .where(eq(apps.id, appInfo.id))
        .returning();
      
      if (updatedApp) {
        console.log(`✓ Updated basic info for app: ${appInfo.id}`);
        
        // Now sync with Google Play to get the latest information
        console.log(`Syncing ${appInfo.id} with Google Play Store...`);
        const syncResult = await syncAppInfo(appInfo.id, "android");
        
        if (syncResult) {
          console.log(`✓ Successfully synced ${appInfo.id} with Google Play Store`);
        } else {
          console.log(`✗ Failed to sync ${appInfo.id} with Google Play Store`);
        }
      } else {
        console.log(`✗ App not found: ${appInfo.id}`);
      }
    } catch (error) {
      console.error(`Error updating app ${appInfo.id}:`, error);
    }
  }
  
  console.log("Updates completed!");
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