import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { syncAppInfo } from "../server/app-sync-service";
import { eq } from "drizzle-orm";

// New ride-sharing and travel apps to add
const appsToAdd = [
  { 
    id: "ringgo", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=co.uk.ringgo.android", 
    originalAppId: "co.uk.ringgo.android", 
    categoryId: "travel",
    name: "RingGo: Mobile Car Parking App",
    developer: "RingGo"
  },
  { 
    id: "justpark", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.justpark.jp", 
    originalAppId: "com.justpark.jp", 
    categoryId: "travel",
    name: "JustPark Parking",
    developer: "JustPark"
  },
  { 
    id: "grab", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger", 
    originalAppId: "com.grabtaxi.passenger", 
    categoryId: "travel",
    name: "Grab - Taxi & Food Delivery",
    developer: "Grab Holdings"
  },
  { 
    id: "indrive", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver", 
    originalAppId: "sinet.startup.inDriver", 
    categoryId: "travel",
    name: "inDrive - Book a Safe Car Ride",
    developer: "SUOL INNOVATIONS LTD"
  },
  { 
    id: "rappi", 
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grability.rappi", 
    originalAppId: "com.grability.rappi", 
    categoryId: "food",
    name: "Rappi",
    developer: "Rappi Inc."
  }
];

async function addApps() {
  console.log(`Adding ${appsToAdd.length} new travel and transportation apps...`);
  
  for (const appInfo of appsToAdd) {
    try {
      console.log(`Processing app: ${appInfo.id}`);
      
      // Check if the app already exists
      const existingApp = await db.select().from(apps).where(eq(apps.id, appInfo.id));
      
      if (existingApp.length > 0) {
        console.log(`Updating existing app: ${appInfo.id}`);
        
        // Update the existing app
        const [updatedApp] = await db.update(apps)
          .set({
            name: appInfo.name,
            developer: appInfo.developer,
            googlePlayUrl: appInfo.googlePlayUrl,
            originalAppId: appInfo.originalAppId,
            isAffiliate: true
          })
          .where(eq(apps.id, appInfo.id))
          .returning();
        
        if (updatedApp) {
          console.log(`✓ Updated app: ${appInfo.id}`);
        }
      } else {
        console.log(`Creating new app: ${appInfo.id}`);
        
        // Insert the new app
        const [createdApp] = await db.insert(apps)
          .values({
            id: appInfo.id,
            name: appInfo.name,
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
            developer: appInfo.developer,
            installs: '0+',
            downloadUrl: `https://topapps.store/download/${appInfo.id}`,
            googlePlayUrl: appInfo.googlePlayUrl,
            originalAppId: appInfo.originalAppId,
            isAffiliate: true
          })
          .returning();
        
        if (createdApp) {
          console.log(`✓ Created app: ${appInfo.id}`);
        }
      }
      
      // Sync with Google Play Store
      console.log(`Syncing ${appInfo.id} with Google Play Store...`);
      const syncResult = await syncAppInfo(appInfo.id, "android");
      
      if (syncResult) {
        console.log(`✓ Successfully synced ${appInfo.id} with Google Play Store`);
      } else {
        console.log(`✗ Failed to sync ${appInfo.id} with Google Play Store`);
      }
    } catch (error) {
      console.error(`Error processing app ${appInfo.id}:`, error);
    }
  }
  
  console.log("All apps processing completed!");
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
  await addApps();
  console.log("Process complete");
  process.exit(0);
}

main().catch(error => {
  console.error("Error in process:", error);
  process.exit(1);
});