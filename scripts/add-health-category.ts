import { db } from "../server/db";
import { categories } from "../shared/schema";
import { eq } from "drizzle-orm";

async function addHealthCategory() {
  console.log("Checking for health category...");
  
  const existingCategory = await db.select().from(categories).where(eq(categories.id, "health"));
  
  if (existingCategory.length === 0) {
    console.log("Creating health category...");
    await db.insert(categories).values({
      id: "health",
      name: "Health & Fitness",
      icon: "🏥", // Health emoji
      color: "#10B981" // Green color
    });
    console.log("✓ Health category created");
  } else {
    console.log("Health category already exists");
  }
}

// Run the function
addHealthCategory()
  .then(() => {
    console.log("Process complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error adding health category:", error);
    process.exit(1);
  });