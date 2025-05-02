import { db } from "../server/db";
import { apps } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Update the GrubHub app with correct Google Play Store info
 */
async function updateGrubhub() {
  try {
    console.log("Updating GrubHub app details...");
    
    // Update the GrubHub app
    const [updatedApp] = await db.update(apps)
      .set({
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.grubhub.android&pcampaignid=web_share",
        originalAppId: "com.grubhub.android" // This is the package name from the URL
      })
      .where(eq(apps.id, "grubhub"))
      .returning();
    
    if (updatedApp) {
      console.log("Successfully updated GrubHub app with Google Play Store details:", updatedApp);
    } else {
      console.log("Failed to update GrubHub app - app not found.");
    }
    
    // Exit
    process.exit(0);
  } catch (error) {
    console.error("Error updating GrubHub app:", error);
    process.exit(1);
  }
}

updateGrubhub();