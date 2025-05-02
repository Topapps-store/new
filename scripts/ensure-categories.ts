import { db } from "../server/db";
import { categories } from "../shared/schema";
import { eq } from "drizzle-orm";

// List of required categories
const requiredCategories = [
  { id: "utilities", name: "Utilities" },
  { id: "travel", name: "Travel & Transportation" },
  { id: "business", name: "Business" },
  { id: "dating", name: "Dating" }
];

async function ensureCategories() {
  console.log("Checking and creating missing categories...");
  
  for (const category of requiredCategories) {
    const existingCategory = await db.select().from(categories).where(eq(categories.id, category.id));
    
    if (existingCategory.length === 0) {
      console.log(`Creating missing category: ${category.id}`);
      await db.insert(categories).values({
        id: category.id,
        name: category.name,
        icon: "📱", // Default icon
        color: "#3B82F6" // Default color (blue)
      });
      console.log(`✓ Created category: ${category.id}`);
    } else {
      console.log(`Category already exists: ${category.id}`);
    }
  }
  
  console.log("All categories ensured successfully");
}

// Run the function
ensureCategories()
  .then(() => {
    console.log("Categories setup complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error setting up categories:", error);
    process.exit(1);
  });