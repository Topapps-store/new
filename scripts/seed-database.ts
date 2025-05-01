import { db } from "../server/db";
import { apps, categories } from "../shared/schema";
import { getApps } from "../server/data/apps";
import { getCategories } from "../server/data/categories";

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Get legacy app and category data
    const legacyCategories = getCategories();
    const legacyApps = getApps();

    console.log(`Seeding ${legacyCategories.length} categories...`);
    
    // Insert categories
    for (const category of legacyCategories) {
      await db.insert(categories).values({
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color
      }).onConflictDoNothing();
    }

    console.log(`Seeding ${legacyApps.length} apps...`);
    
    // Insert apps
    for (const app of legacyApps) {
      await db.insert(apps).values({
        id: app.id,
        name: app.name,
        categoryId: app.categoryId,
        description: app.description,
        iconUrl: app.iconUrl,
        rating: app.rating,
        downloads: app.downloads,
        version: app.version,
        size: app.size,
        updated: app.updated,
        requires: app.requires,
        developer: app.developer,
        installs: app.installs,
        downloadUrl: app.downloadUrl,
        googlePlayUrl: app.googlePlayUrl,
        screenshots: app.screenshots,
        isAffiliate: app.isAffiliate || false
      }).onConflictDoNothing();
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();