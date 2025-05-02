import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { syncAppInfo } from "../server/app-sync-service";
import { eq } from "drizzle-orm";

// Rappi app info
const rappiInfo = { 
  id: "rappi", 
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grability.rappi", 
  originalAppId: "com.grability.rappi", 
  categoryId: "food",
  name: "Rappi",
  developer: "Rappi Inc."
};

async function addRappi() {
  console.log("Adding Rappi app...");
  
  try {
    // Check if the app already exists
    const existingApp = await db.select().from(apps).where(eq(apps.id, rappiInfo.id));
    
    if (existingApp.length > 0) {
      console.log(`Updating existing app: ${rappiInfo.id}`);
      
      // Update the existing app
      const [updatedApp] = await db.update(apps)
        .set({
          name: rappiInfo.name,
          developer: rappiInfo.developer,
          googlePlayUrl: rappiInfo.googlePlayUrl,
          originalAppId: rappiInfo.originalAppId,
          isAffiliate: true
        })
        .where(eq(apps.id, rappiInfo.id))
        .returning();
      
      if (updatedApp) {
        console.log(`✓ Updated app: ${rappiInfo.id}`);
      }
    } else {
      console.log(`Creating new app: ${rappiInfo.id}`);
      
      // Insert the new app
      const [createdApp] = await db.insert(apps)
        .values({
          id: rappiInfo.id,
          name: rappiInfo.name,
          categoryId: rappiInfo.categoryId,
          description: `Description for ${rappiInfo.id} will be updated from Google Play.`,
          iconUrl: 'https://via.placeholder.com/512',
          screenshots: [],
          rating: 0,
          downloads: '0+',
          version: '1.0.0',
          size: 'Varies',
          updated: new Date().toISOString(),
          requires: 'Android 5.0+',
          developer: rappiInfo.developer,
          installs: '0+',
          downloadUrl: `https://topapps.store/download/${rappiInfo.id}`,
          googlePlayUrl: rappiInfo.googlePlayUrl,
          originalAppId: rappiInfo.originalAppId,
          isAffiliate: true
        })
        .returning();
      
      if (createdApp) {
        console.log(`✓ Created app: ${rappiInfo.id}`);
      }
    }
    
    // Sync with Google Play Store
    console.log(`Syncing ${rappiInfo.id} with Google Play Store...`);
    const syncResult = await syncAppInfo(rappiInfo.id, "android");
    
    if (syncResult) {
      console.log(`✓ Successfully synced ${rappiInfo.id} with Google Play Store`);
    } else {
      console.log(`✗ Failed to sync ${rappiInfo.id} with Google Play Store`);
    }
  } catch (error) {
    console.error(`Error processing app ${rappiInfo.id}:`, error);
  }
  
  console.log("Process complete");
}

// Make sure we have a food category
async function ensureFoodCategory() {
  try {
    const existingCategory = await db.select().from(categories).where(eq(categories.id, "food"));
    
    if (existingCategory.length === 0) {
      console.log("Creating food category...");
      await db.insert(categories).values({
        id: "food",
        name: "Food & Delivery",
        icon: "🍔",
        color: "#FF6B6B"
      });
      console.log("✓ Food category created");
    } else {
      console.log("Food category already exists");
    }
  } catch (error) {
    console.error("Error checking food category:", error);
  }
}

// Run the function
async function main() {
  await ensureFoodCategory();
  await addRappi();
  process.exit(0);
}

main().catch(error => {
  console.error("Error in process:", error);
  process.exit(1);
});