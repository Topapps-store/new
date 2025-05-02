import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { eq } from "drizzle-orm";
import { syncAppInfo } from "../server/app-sync-service";

// Second batch of apps to check
const appsToCheck = [
  { id: "aliexpress", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd", originalAppId: "com.alibaba.aliexpresshd", categoryId: "shopping" },
  { id: "canva", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.canva.editor", originalAppId: "com.canva.editor", categoryId: "productivity" },
  { id: "chatgpt", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", originalAppId: "com.openai.chatgpt", categoryId: "productivity" }
];

/**
 * Check if apps exist and update them with Google Play Store info
 */
async function checkAndUpdateApps() {
  try {
    console.log(`Starting app check for ${appsToCheck.length} apps...`);
    
    // Get all existing apps to compare against
    const existingApps = await db.select().from(apps);
    const existingAppIds = existingApps.map(app => app.id);
    
    // Create a list of missing apps that need to be created
    const missingApps = appsToCheck.filter(app => !existingAppIds.includes(app.id));
    const appsToUpdate = appsToCheck.filter(app => existingAppIds.includes(app.id));
    
    console.log(`Found ${missingApps.length} apps to create and ${appsToUpdate.length} apps to update`);
    
    // Update existing apps
    for (const appInfo of appsToUpdate) {
      console.log(`Updating app: ${appInfo.id}`);
      
      try {
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
    
    // Create missing apps
    for (const appInfo of missingApps) {
      console.log(`Creating new app: ${appInfo.id}`);
      
      try {
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
    
    console.log("App check and update completed!");
    
    // Return the list of missing apps that were created
    return missingApps.map(app => app.id);
  } catch (error) {
    console.error("Error checking apps:", error);
    return [];
  }
}

// Main function
async function main() {
  const newlyCreatedApps = await checkAndUpdateApps();
  
  if (newlyCreatedApps.length > 0) {
    console.log("Newly created apps:");
    newlyCreatedApps.forEach(app => console.log(`- ${app}`));
  }
  
  process.exit(0);
}

main();