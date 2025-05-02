import { 
  App, AppLegacy, Category, CategoryLegacy, 
  InsertApp, InsertCategory, InsertUser, User,
  AffiliateLink, InsertAffiliateLink,
  AppVersionHistory, InsertAppVersionHistory,
  apps, categories, users, affiliateLinks, appVersionHistory
} from "@shared/schema";
import { db } from "./db";
import { asc, desc, eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // App operations
  getApps(): Promise<AppLegacy[]>;
  getPopularApps(): Promise<AppLegacy[]>;  
  getRecentApps(): Promise<AppLegacy[]>;
  getJustInTimeApps(): Promise<AppLegacy[]>;
  getAppById(id: string): Promise<AppLegacy | undefined>;
  getRelatedApps(id: string): Promise<AppLegacy[]>;
  searchApps(query: string): Promise<AppLegacy[]>;
  updateApp(id: string, appData: Partial<AppLegacy>): Promise<AppLegacy | undefined>;
  
  // Category operations
  getCategories(): Promise<CategoryLegacy[]>;
  getCategoryById(id: string): Promise<CategoryLegacy | undefined>;
  getAppsByCategory(categoryId: string): Promise<AppLegacy[]>;
  
  // Affiliate links operations
  getAffiliateLinks(appId: string): Promise<AffiliateLink[]>;
  getAllAffiliateLinks(): Promise<AffiliateLink[]>;
  getAffiliateLinkById(id: number): Promise<AffiliateLink | undefined>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: number, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: number): Promise<boolean>;
  incrementLinkClickCount(id: number): Promise<AffiliateLink | undefined>;
  getAffiliateLinkAnalytics(): Promise<{appId: string, appName: string, totalClicks: number}[]>;
  
  // App version history operations
  getAppVersionHistory(appId: string): Promise<AppVersionHistory[]>;
  getLatestAppVersion(appId: string): Promise<AppVersionHistory | undefined>;
  addAppVersionHistory(versionHistory: InsertAppVersionHistory): Promise<AppVersionHistory>;
  markVersionNotified(id: number): Promise<AppVersionHistory | undefined>;
  getRecentAppUpdates(limit?: number): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]>;
  getUnnotifiedUpdates(): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // App methods
  async getApps(): Promise<AppLegacy[]> {
    const appsList = await db.select().from(apps);
    const categoriesList = await db.select().from(categories);
    
    // Convert database apps to AppLegacy format
    return appsList.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  async getPopularApps(): Promise<AppLegacy[]> {
    // Get apps with most downloads - parsed as number for sorting
    const appsList = await db.select().from(apps)
      .orderBy(desc(apps.downloads));
    
    const categoriesList = await db.select().from(categories);
    
    // Convert database apps to AppLegacy format
    return appsList.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    }).slice(0, 8);
  }
  
  async getRecentApps(): Promise<AppLegacy[]> {
    // Get most recently added apps (using createdAt or updated field)
    const appsList = await db.select().from(apps)
      .orderBy(desc(apps.createdAt));
    
    const categoriesList = await db.select().from(categories);
    
    // Convert database apps to AppLegacy format
    return appsList.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    }).slice(0, 8);
  }
  
  async getJustInTimeApps(): Promise<AppLegacy[]> {
    // Get specially curated "just-in-time" apps - apps for on-demand services
    const appsList = await db.select().from(apps);
    const categoriesList = await db.select().from(categories);
    
    // Filter the specific apps we want to display in the just-in-time section
    // These would typically be rideshare, food delivery, and other on-demand services
    const justInTimeAppIds = [
      "uber", "lyft", "doordash", "grubhub", "ubereats", 
      "cashapp", "venmo", "turo", "instacart", "amazon"
    ];
    
    const filteredApps = appsList.filter(app => 
      justInTimeAppIds.includes(app.id)
    );
    
    // Convert database apps to AppLegacy format
    return filteredApps.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    }).slice(0, 10);
  }
  
  async getAppById(id: string): Promise<AppLegacy | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    
    if (!app) return undefined;
    
    const [category] = await db.select().from(categories).where(eq(categories.id, app.categoryId));
    
    return this.convertToAppLegacy(app, category?.name || 'Unknown');
  }
  
  async getRelatedApps(id: string): Promise<AppLegacy[]> {
    // Find the app
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    
    if (!app) return [];
    
    // Get other apps in the same category
    const relatedApps = await db
      .select()
      .from(apps)
      .where(eq(apps.categoryId, app.categoryId));
    
    const categoriesList = await db.select().from(categories);
    
    // Convert database apps to AppLegacy format and filter out the current app
    return relatedApps
      .filter(relatedApp => relatedApp.id !== id)
      .map(app => {
        const category = categoriesList.find(cat => cat.id === app.categoryId);
        return this.convertToAppLegacy(app, category?.name || 'Unknown');
      })
      .slice(0, 4); // Return top 4 related apps
  }
  
  async searchApps(query: string): Promise<AppLegacy[]> {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    
    // Basic search implementation - in a real app, you'd use more sophisticated search
    const appsList = await db.select().from(apps);
    const categoriesList = await db.select().from(categories);
    
    const filteredApps = appsList.filter(app => 
      app.name.toLowerCase().includes(lowercaseQuery) || 
      app.description.toLowerCase().includes(lowercaseQuery)
    );
    
    // Convert database apps to AppLegacy format
    return filteredApps.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  // Category methods
  async getCategories(): Promise<CategoryLegacy[]> {
    const categoriesList = await db.select().from(categories);
    
    // Convert database categories to CategoryLegacy format
    return categoriesList.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon || undefined,
      color: category.color || undefined
    }));
  }
  
  async getCategoryById(id: string): Promise<CategoryLegacy | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    
    if (!category) return undefined;
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon || undefined,
      color: category.color || undefined
    };
  }
  
  async getAppsByCategory(categoryId: string): Promise<AppLegacy[]> {
    const appsList = await db.select().from(apps).where(eq(apps.categoryId, categoryId));
    const [category] = await db.select().from(categories).where(eq(categories.id, categoryId));
    
    if (!category) return [];
    
    // Convert database apps to AppLegacy format
    return appsList.map(app => this.convertToAppLegacy(app, category.name));
  }
  
  // Helper for converting DB app to legacy format
  private convertToAppLegacy(app: App, categoryName: string): AppLegacy {
    return {
      id: app.id,
      name: app.name,
      categoryId: app.categoryId,
      category: categoryName,
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
      iosAppStoreUrl: app.iosAppStoreUrl || undefined,
      originalAppId: app.originalAppId || undefined,
      screenshots: app.screenshots,
      isAffiliate: app.isAffiliate || false,
      lastSyncedAt: app.lastSyncedAt ? new Date(app.lastSyncedAt) : undefined
    };
  }
  
  // Affiliate link methods
  async getAffiliateLinks(appId: string): Promise<AffiliateLink[]> {
    return db.select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.appId, appId))
      .orderBy(asc(affiliateLinks.displayOrder));
  }
  
  async getAffiliateLinkById(id: number): Promise<AffiliateLink | undefined> {
    const [link] = await db.select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.id, id));
    
    return link || undefined;
  }
  
  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const [createdLink] = await db.insert(affiliateLinks)
      .values(link)
      .returning();
    
    return createdLink;
  }
  
  async updateAffiliateLink(id: number, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const [updatedLink] = await db.update(affiliateLinks)
      .set(link)
      .where(eq(affiliateLinks.id, id))
      .returning();
    
    return updatedLink || undefined;
  }
  
  async deleteAffiliateLink(id: number): Promise<boolean> {
    const [deletedLink] = await db.delete(affiliateLinks)
      .where(eq(affiliateLinks.id, id))
      .returning();
    
    return !!deletedLink;
  }
  
  async incrementLinkClickCount(id: number): Promise<AffiliateLink | undefined> {
    const [link] = await db.select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.id, id));
    
    if (!link) return undefined;
    
    const [updatedLink] = await db.update(affiliateLinks)
      .set({ clickCount: link.clickCount + 1 })
      .where(eq(affiliateLinks.id, id))
      .returning();
    
    return updatedLink || undefined;
  }
  
  // Admin methods
  async updateApp(id: string, appData: Partial<AppLegacy>): Promise<AppLegacy | undefined> {
    // Get the original app first
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    
    if (!app) return undefined;
    
    // Prepare update data (convert from AppLegacy to the DB schema)
    const updateData: Partial<typeof apps.$inferInsert> = {};
    
    if (appData.name) updateData.name = appData.name;
    if (appData.description) updateData.description = appData.description;
    if (appData.iconUrl) updateData.iconUrl = appData.iconUrl;
    if (appData.rating !== undefined) updateData.rating = appData.rating;
    if (appData.downloads) updateData.downloads = appData.downloads;
    if (appData.version) updateData.version = appData.version;
    if (appData.size) updateData.size = appData.size;
    if (appData.updated) updateData.updated = appData.updated;
    if (appData.requires) updateData.requires = appData.requires;
    if (appData.developer) updateData.developer = appData.developer;
    if (appData.installs) updateData.installs = appData.installs;
    if (appData.downloadUrl) updateData.downloadUrl = appData.downloadUrl;
    if (appData.googlePlayUrl) updateData.googlePlayUrl = appData.googlePlayUrl;
    if (appData.iosAppStoreUrl) updateData.iosAppStoreUrl = appData.iosAppStoreUrl;
    if (appData.originalAppId) updateData.originalAppId = appData.originalAppId;
    if (appData.isAffiliate !== undefined) updateData.isAffiliate = appData.isAffiliate;
    
    // Handle screenshots (convert to string array)
    if (appData.screenshots && Array.isArray(appData.screenshots)) {
      updateData.screenshots = appData.screenshots;
    }
    
    // Update the app in DB
    const [updatedApp] = await db.update(apps)
      .set(updateData)
      .where(eq(apps.id, id))
      .returning();
    
    if (!updatedApp) return undefined;
    
    // Get the updated category to return the full app info
    const [category] = await db.select().from(categories).where(eq(categories.id, updatedApp.categoryId));
    
    return this.convertToAppLegacy(updatedApp, category?.name || 'Unknown');
  }
  
  async getAllAffiliateLinks(): Promise<AffiliateLink[]> {
    return db.select().from(affiliateLinks).orderBy(asc(affiliateLinks.appId), asc(affiliateLinks.displayOrder));
  }
  
  async getAffiliateLinkAnalytics(): Promise<{appId: string, appName: string, totalClicks: number}[]> {
    // Get all affiliate links and their click counts
    const links = await db.select().from(affiliateLinks);
    
    // Get all app info
    const appsList = await db.select().from(apps);
    
    // Group by app and calculate total clicks
    const analytics: Record<string, {appId: string, appName: string, totalClicks: number}> = {};
    
    // Process each link
    for (const link of links) {
      if (link.appId) {
        if (!analytics[link.appId]) {
          const app = appsList.find(a => a.id === link.appId);
          analytics[link.appId] = {
            appId: link.appId,
            appName: app?.name || 'Unknown App',
            totalClicks: 0
          };
        }
        
        analytics[link.appId].totalClicks += link.clickCount;
      }
    }
    
    // Convert to array and sort by total clicks (descending)
    return Object.values(analytics).sort((a, b) => b.totalClicks - a.totalClicks);
  }
  
  // App Version History methods
  async getAppVersionHistory(appId: string): Promise<AppVersionHistory[]> {
    return db.select()
      .from(appVersionHistory)
      .where(eq(appVersionHistory.appId, appId))
      .orderBy(desc(appVersionHistory.updateDate));
  }
  
  async getLatestAppVersion(appId: string): Promise<AppVersionHistory | undefined> {
    const [latestVersion] = await db.select()
      .from(appVersionHistory)
      .where(eq(appVersionHistory.appId, appId))
      .orderBy(desc(appVersionHistory.updateDate))
      .limit(1);
    
    return latestVersion || undefined;
  }
  
  async addAppVersionHistory(versionHistory: InsertAppVersionHistory): Promise<AppVersionHistory> {
    const [created] = await db.insert(appVersionHistory)
      .values(versionHistory)
      .returning();
    
    return created;
  }
  
  async markVersionNotified(id: number): Promise<AppVersionHistory | undefined> {
    const [updated] = await db.update(appVersionHistory)
      .set({ isNotified: true })
      .where(eq(appVersionHistory.id, id))
      .returning();
    
    return updated || undefined;
  }
  
  async getRecentAppUpdates(limit: number = 10): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    // Get the latest version updates
    const versionHistories = await db.select()
      .from(appVersionHistory)
      .orderBy(desc(appVersionHistory.updateDate))
      .limit(limit);
    
    // Get the associated apps
    const appIds = versionHistories.map(vh => vh.appId);
    const appsList = await db.select().from(apps).where(
      appIds.length > 0 ? apps.id.in(appIds) : undefined
    );
    const categoriesList = await db.select().from(categories);
    
    // Combine the data
    return versionHistories.map(versionHistory => {
      const app = appsList.find(a => a.id === versionHistory.appId);
      if (!app) {
        throw new Error(`App with ID ${versionHistory.appId} not found`);
      }
      
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      const appLegacy = this.convertToAppLegacy(app, category?.name || 'Unknown');
      
      return {
        app: appLegacy,
        versionHistory
      };
    });
  }
  
  async getUnnotifiedUpdates(): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    // Get unnotified version updates
    const versionHistories = await db.select()
      .from(appVersionHistory)
      .where(eq(appVersionHistory.isNotified, false))
      .orderBy(desc(appVersionHistory.updateDate));
    
    // Get the associated apps
    const appIds = versionHistories.map(vh => vh.appId);
    const appsList = await db.select().from(apps).where(
      appIds.length > 0 ? apps.id.in(appIds) : undefined
    );
    const categoriesList = await db.select().from(categories);
    
    // Combine the data
    return versionHistories.map(versionHistory => {
      const app = appsList.find(a => a.id === versionHistory.appId);
      if (!app) {
        throw new Error(`App with ID ${versionHistory.appId} not found`);
      }
      
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      const appLegacy = this.convertToAppLegacy(app, category?.name || 'Unknown');
      
      return {
        app: appLegacy,
        versionHistory
      };
    });
  }
}

export const storage = new DatabaseStorage();
