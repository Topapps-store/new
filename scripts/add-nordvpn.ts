import { db } from "../server/db";
import { apps } from "../shared/schema";
import { syncAppInfo } from "../server/app-sync-service";

async function addNordVPN() {
  try {
    console.log("Creating NordVPN app...");
    
    // Insert the new app
    const [createdApp] = await db.insert(apps)
      .values({
        id: "nordvpn",
        name: "NordVPN",
        categoryId: "utilities",
        description: "Description for NordVPN will be updated from Google Play.",
        iconUrl: 'https://via.placeholder.com/512',
        screenshots: [],
        rating: 0,
        downloads: '0+',
        version: '1.0.0',
        size: 'Varies',
        updated: new Date().toISOString(),
        requires: 'Android 5.0+',
        developer: 'Nord Security',
        installs: '0+',
        downloadUrl: `https://topapps.store/download/nordvpn`,
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.nordvpn.android",
        originalAppId: "com.nordvpn.android",
        isAffiliate: true
      })
      .returning();
    
    if (createdApp) {
      console.log(`✓ Created app: nordvpn`);
      
      // Sync with Google Play
      const syncResult = await syncAppInfo("nordvpn", "android");
      if (syncResult) {
        console.log(`✓ Synced app: nordvpn`);
      } else {
        console.log(`✗ Failed to sync app: nordvpn`);
      }
    }
    
    console.log("NordVPN app added successfully!");
  } catch (error) {
    console.error("Error adding NordVPN app:", error);
  }
}

// Run the function
addNordVPN()
  .then(() => {
    console.log("Process complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error in process:", error);
    process.exit(1);
  });