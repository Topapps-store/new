import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Second batch of apps to update
const appsToUpdate = [
  // For Splitwise, we need to check if it exists and create it if not
  { id: "splitwise", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.Splitwise.SplitwiseMobile", originalAppId: "com.Splitwise.SplitwiseMobile", needsCreate: true, categoryId: "finance" },
  { id: "thumbtack", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.thumbtack.consumer", originalAppId: "com.thumbtack.consumer" },
  { id: "handy", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.handy.handy.prod", originalAppId: "com.handy.handy.prod" },
  { id: "teladoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.teladoc.members", originalAppId: "com.teladoc.members" },
  { id: "zocdoc", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.zocdoc.android", originalAppId: "com.zocdoc.android" },
  { id: "temu", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.einnovation.temu", originalAppId: "com.einnovation.temu" }
];

/**
 * Update second batch of apps with Google Play Store information
 */
async function updateApps() {
  try {
    console.log(`Starting batch 2 update for ${appsToUpdate.length} apps...`);
    
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
    
    console.log("Batch 2 update completed!");
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error in batch update:", error);
    process.exit(1);
  }
}

updateApps();