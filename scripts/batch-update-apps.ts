import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Array of apps to update with their Google Play Store links
const appsToUpdate = [
  { id: "ubereats", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab.eats", originalAppId: "com.ubercab.eats" },
  { id: "instacart", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.instacart.shopper", originalAppId: "com.instacart.shopper" },
  { id: "cashapp", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.squareup.cash", originalAppId: "com.squareup.cash" },
  { id: "venmo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.venmo", originalAppId: "com.venmo" },
  { id: "zelle", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zellepay.zelle", originalAppId: "com.zellepay.zelle" },
  { id: "taskrabbit", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.taskrabbit.droid.consumer", originalAppId: "com.taskrabbit.droid.consumer" },
  // For Splitwise, we need to check if it exists and create it if not
  { id: "splitwise", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.Splitwise.SplitwiseMobile", originalAppId: "com.Splitwise.SplitwiseMobile", needsCreate: true, categoryId: "finance" },
  { id: "thumbtack", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.thumbtack.consumer", originalAppId: "com.thumbtack.consumer" },
  { id: "handy", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.handy.handy.prod", originalAppId: "com.handy.handy.prod" },
  { id: "teladoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.teladoc.members", originalAppId: "com.teladoc.members" },
  { id: "zocdoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zocdoc.android", originalAppId: "com.zocdoc.android" },
  { id: "temu", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.einnovation.temu", originalAppId: "com.einnovation.temu" },
  { id: "shein", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zzkko", originalAppId: "com.zzkko" },
  { id: "rinse", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.rinse", originalAppId: "com.rinse" },
  { id: "lawnlove", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.lawnlove.customers", originalAppId: "com.lawnlove.customers" },
  { id: "doordash", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash", originalAppId: "com.dd.doordash" },
  { id: "lyft", googlePlayUrl: "https://play.google.com/store/apps/details?id=me.lyft.android", originalAppId: "me.lyft.android" },
  { id: "turo", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.relayrides.android.relayrides", originalAppId: "com.relayrides.android.relayrides" },
  { id: "bird", googlePlayUrl: "https://play.google.com/store/apps/details?id=co.bird.android", originalAppId: "co.bird.android" },
  { id: "lime", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.limebike", originalAppId: "com.limebike" },
  { id: "easypark", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.easypark.android", originalAppId: "net.easypark.android" },
  { id: "parkmobile", googlePlayUrl: "https://play.google.com/store/apps/details?id=net.sharewire.parkmobilev2", originalAppId: "net.sharewire.parkmobilev2" }
];

/**
 * Update apps with Google Play Store information
 */
async function updateApps() {
  try {
    console.log(`Starting batch update for ${appsToUpdate.length} apps...`);
    
    // Get all categories for apps that need to be created
    const categoriesList = await db.select().from(categories);
    
    // Process each app
    for (const appInfo of appsToUpdate) {
      console.log(`Processing app: ${appInfo.id}`);
      
      try {
        // Check if the app exists
        const [existingApp] = await db.select().from(apps).where(eq(apps.id, appInfo.id));
        
        if (existingApp || !appInfo.needsCreate) {
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
        } else if (appInfo.needsCreate) {
          // Create new app
          console.log(`Creating new app: ${appInfo.id}`);
          
          // Find the right category
          const categoryId = appInfo.categoryId || 'utilities'; // Default to utilities if no category specified
          
          // Insert the new app
          const [createdApp] = await db.insert(apps)
            .values({
              id: appInfo.id,
              name: appInfo.id.charAt(0).toUpperCase() + appInfo.id.slice(1), // Capitalize first letter
              categoryId: categoryId,
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
          } else {
            console.log(`✗ Failed to create app: ${appInfo.id}`);
          }
        }
      } catch (error) {
        console.error(`Error processing app ${appInfo.id}:`, error);
      }
    }
    
    console.log("Batch update completed!");
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error in batch update:", error);
    process.exit(1);
  }
}

updateApps();