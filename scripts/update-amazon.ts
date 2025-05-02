import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Update the Amazon app with correct Google Play Store info
 */
async function updateAmazon() {
  try {
    console.log("Updating Amazon app details...");
    
    // Update the Amazon app
    const [updatedApp] = await db.update(apps)
      .set({
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
        originalAppId: "com.amazon.mShop.android.shopping", // This is the package name from the URL
        rating: 4.4, // From the provided screenshot/content
        description: "Browse, search, view product details, read reviews, and purchase millions of products. Amazon delivers to 100+ countries in as quickly as 3-5 days. Whether you're buying gifts, reading reviews, tracking orders, scanning products, or just shopping, the Amazon Shopping app offers more benefits than shopping on Amazon via your desktop.",
        downloads: "500M+", // From the provided screenshot
        installs: "500,000,000+",
        developer: "Amazon Mobile LLC", // From the provided screenshot
        iconUrl: "https://play-lh.googleusercontent.com/1Ns1T_qN0pEXMvZeZ5lQNAR8z4blP7ce2J2Nn5doXvt2T1g_W7VMORdWHaApkOooupI=w480-h960-rw", // From the provided screenshot
        isAffiliate: true
      })
      .where(eq(apps.id, "amazon"))
      .returning();
    
    if (updatedApp) {
      console.log("Successfully updated Amazon app with Google Play Store details:", updatedApp);
    } else {
      console.log("Failed to update Amazon app - app not found.");
    }
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error updating Amazon app:", error);
    process.exit(1);
  }
}

updateAmazon();