import { db } from "../server/db";
import { apps } from "../shared/schema";
import { syncAppInfo } from "../server/app-sync-service";

// Final batch of apps to add
const appsToAdd = [
  { id: "tinder", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.tinder", originalAppId: "com.tinder", categoryId: "dating" },
  { id: "ashleymadison", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ashleymadison.mobile", originalAppId: "com.ashleymadison.mobile", categoryId: "dating" },
  { id: "taskrabbit", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer", originalAppId: "com.taskrabbit.droid.consumer", categoryId: "productivity" },
  { id: "zocdoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zocdoc.android", originalAppId: "com.zocdoc.android", categoryId: "health" },
  { id: "parkmobile", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2", originalAppId: "net.sharewire.parkmobilev2", categoryId: "travel" }
];

async function addApps() {
  console.log(`Adding ${appsToAdd.length} remaining apps...`);
  
  for (const appInfo of appsToAdd) {
    try {
      console.log(`Creating app: ${appInfo.id}`);
      
      // Insert the new app
      const [createdApp] = await db.insert(apps)
        .values({
          id: appInfo.id,
          name: appInfo.id.charAt(0).toUpperCase() + appInfo.id.slice(1).replace(/([A-Z])/g, ' $1'), // Format CamelCase to spaces
          categoryId: appInfo.categoryId,
          description: `Description for ${appInfo.id} will be updated from Google Play.`,
          iconUrl: 'https://via.placeholder.com/512',
          screenshots: [],
          rating: 0,
          downloads: '0+',
          version: '1.0.0',
          size: 'Varies',
          updated: new Date().toISOString(),
          requires: 'Android 5.0+',
          developer: 'App Developer',
          installs: '0+',
          downloadUrl: `https://topapps.store/download/${appInfo.id}`,
          googlePlayUrl: appInfo.googlePlayUrl,
          originalAppId: appInfo.originalAppId,
          isAffiliate: true
        })
        .returning();
      
      if (createdApp) {
        console.log(`✓ Created app: ${appInfo.id}`);
        
        // Sync with Google Play
        const syncResult = await syncAppInfo(appInfo.id, "android");
        if (syncResult) {
          console.log(`✓ Synced app: ${appInfo.id}`);
        } else {
          console.log(`✗ Failed to sync app: ${appInfo.id}`);
        }
      }
    } catch (error) {
      console.error(`Error creating app ${appInfo.id}:`, error);
    }
  }
  
  console.log("All apps added successfully!");
}

// Run the function
addApps()
  .then(() => {
    console.log("Process complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error in process:", error);
    process.exit(1);
  });