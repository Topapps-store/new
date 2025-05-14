import { 
  App, AppLegacy, Category, CategoryLegacy, 
  InsertApp, InsertCategory, InsertUser, User,
  AffiliateLink, InsertAffiliateLink,
  AppVersionHistory, InsertAppVersionHistory,
  apps, categories, users, affiliateLinks, appVersionHistory
} from "@shared/schema";
import { db } from "./db";
import { asc, desc, eq, inArray } from "drizzle-orm";

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
  deleteApp(id: string): Promise<boolean>;
  
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
    // You can choose between two approaches:
    
    // APPROACH 1: Sort by downloads (default behavior)
    // Get apps with most downloads - parsed as number for sorting
    const appsList = await db.select().from(apps)
      .orderBy(desc(apps.downloads));
    
    // APPROACH 2: Use a fixed list of specific app IDs you want to feature
    // Uncomment the code below and add the app IDs you want to feature
    /*
    const popularAppIds = [
      "facebook", "instagram", "tiktok", "snapchat", "whatsapp", 
      "spotify", "netflix", "youtube", "pinterest", "twitter"
    ];
    
    const appsList = await db.select().from(apps).where(
      inArray(apps.id, popularAppIds)
    );
    */
    
    const categoriesList = await db.select().from(categories);
    
    // Convert database apps to AppLegacy format
    return appsList.map(app => {
      const category = categoriesList.find(cat => cat.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    }).slice(0, 10); // Showing up to 10 popular apps
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
  
  async deleteApp(id: string): Promise<boolean> {
    // First, delete any affiliate links associated with this app
    await db.delete(affiliateLinks).where(eq(affiliateLinks.appId, id));
    
    // Then, delete any version history associated with this app
    await db.delete(appVersionHistory).where(eq(appVersionHistory.appId, id));
    
    // Finally, delete the app itself
    const [deletedApp] = await db.delete(apps).where(eq(apps.id, id)).returning();
    
    return !!deletedApp;
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
    
    if (versionHistories.length === 0) {
      return [];
    }
    
    // Get the associated apps - handle 'in' operator issue by using OR conditions
    const appIds = versionHistories.map(vh => vh.appId);
    
    // Get all apps and filter in memory
    const appsList = await db.select().from(apps);
    const filteredApps = appsList.filter(app => appIds.includes(app.id));
    
    const categoriesList = await db.select().from(categories);
    
    // Combine the data
    return versionHistories.map(versionHistory => {
      const app = filteredApps.find(a => a.id === versionHistory.appId);
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
    
    if (versionHistories.length === 0) {
      return [];
    }
    
    // Get the associated apps - handle 'in' operator issue by using OR conditions
    const appIds = versionHistories.map(vh => vh.appId);
    
    // Get all apps and filter in memory
    const appsList = await db.select().from(apps);
    const filteredApps = appsList.filter(app => appIds.includes(app.id));
    
    const categoriesList = await db.select().from(categories);
    
    // Combine the data
    return versionHistories.map(versionHistory => {
      const app = filteredApps.find(a => a.id === versionHistory.appId);
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

//export const storage = new DatabaseStorage();

// Implementación en memoria para desarrollo/pruebas
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: '$2b$10$GYVLR0VLgUJIzw/LkECv7OB1.RDUU5eIYJDwpXEXK.mEQ9xR.wfoW', // admin123
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
  ];
  
  private categories: Category[] = [
    {
      id: 'social',
      name: 'Social Media',
      icon: '🌐',
      color: '#4267B2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: '🛠️',
      color: '#34C759',
      createdAt: new Date().toISOString()
    }
  ];
  
  private apps: App[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      categoryId: 'social',
      description: 'Connect with friends, family and other people you know.',
      iconUrl: 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s180-rw',
      rating: 4.2,
      downloads: '5,000,000,000+',
      version: '430.0.0.23.113',
      size: 'Varies with device',
      updated: 'May 7, 2023',
      requires: 'Varies with device',
      developer: 'Meta Platforms, Inc.',
      installs: '5,000,000,000+',
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
      googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
      iosAppStoreUrl: 'https://apps.apple.com/us/app/facebook/id284882215',
      screenshots: ['https://example.com/screenshot1.jpg', 'https://example.com/screenshot2.jpg'],
      isAffiliate: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Messenger',
      categoryId: 'social',
      description: 'Simple. Reliable. Secure messaging.',
      iconUrl: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw',
      rating: 4.4,
      downloads: '5,000,000,000+',
      version: '2.23.9.76',
      size: 'Varies with device',
      updated: 'May 5, 2023',
      requires: 'Varies with device',
      developer: 'WhatsApp LLC',
      installs: '5,000,000,000+',
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      iosAppStoreUrl: 'https://apps.apple.com/us/app/whatsapp-messenger/id310633997',
      screenshots: ['https://example.com/whatsapp1.jpg', 'https://example.com/whatsapp2.jpg'],
      isAffiliate: false,
      createdAt: new Date().toISOString(),
    }
  ];
  
  private affiliateLinks: AffiliateLink[] = [
    {
      id: 1,
      appId: 'facebook',
      label: 'Download via Affiliate',
      url: 'https://example.com/affiliate/facebook',
      buttonText: 'Download Now',
      buttonColor: '#4CAF50',
      isActive: true,
      displayOrder: 1,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  private appVersionHistory: AppVersionHistory[] = [
    {
      id: 1,
      appId: 'facebook',
      version: '430.0.0.23.113',
      releaseNotes: 'Various bug fixes and improvements',
      updateDate: new Date().toISOString(),
      isNotified: false,
      isImportant: false,
      changesDetected: true
    }
  ];

  sessionStore = new MemoryStore({
    checkPeriod: 86400000 // Prune expired entries every 24h
  });
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      ...insertUser,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }
  
  // App methods
  async getApps(): Promise<AppLegacy[]> {
    return this.apps.map(app => {
      const category = this.categories.find(c => c.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  async getPopularApps(): Promise<AppLegacy[]> {
    return this.apps.map(app => {
      const category = this.categories.find(c => c.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  async getRecentApps(): Promise<AppLegacy[]> {
    return this.apps.map(app => {
      const category = this.categories.find(c => c.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  async getJustInTimeApps(): Promise<AppLegacy[]> {
    return this.apps.map(app => {
      const category = this.categories.find(c => c.id === app.categoryId);
      return this.convertToAppLegacy(app, category?.name || 'Unknown');
    });
  }
  
  async getAppById(id: string): Promise<AppLegacy | undefined> {
    const app = this.apps.find(a => a.id === id);
    if (!app) return undefined;
    
    const category = this.categories.find(c => c.id === app.categoryId);
    return this.convertToAppLegacy(app, category?.name || 'Unknown');
  }
  
  async getRelatedApps(id: string): Promise<AppLegacy[]> {
    const app = this.apps.find(a => a.id === id);
    if (!app) return [];
    
    return this.apps
      .filter(a => a.categoryId === app.categoryId && a.id !== id)
      .map(app => {
        const category = this.categories.find(c => c.id === app.categoryId);
        return this.convertToAppLegacy(app, category?.name || 'Unknown');
      });
  }
  
  async searchApps(query: string): Promise<AppLegacy[]> {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    
    return this.apps
      .filter(app => 
        app.name.toLowerCase().includes(lowercaseQuery) || 
        app.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(app => {
        const category = this.categories.find(c => c.id === app.categoryId);
        return this.convertToAppLegacy(app, category?.name || 'Unknown');
      });
  }
  
  // Category methods
  async getCategories(): Promise<CategoryLegacy[]> {
    return this.categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color
    }));
  }
  
  async getCategoryById(id: string): Promise<CategoryLegacy | undefined> {
    const category = this.categories.find(c => c.id === id);
    if (!category) return undefined;
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color
    };
  }
  
  async getAppsByCategory(categoryId: string): Promise<AppLegacy[]> {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    return this.apps
      .filter(app => app.categoryId === categoryId)
      .map(app => this.convertToAppLegacy(app, category.name));
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
      iosAppStoreUrl: app.iosAppStoreUrl,
      originalAppId: app.originalAppId,
      screenshots: app.screenshots,
      isAffiliate: app.isAffiliate || false,
      lastSyncedAt: app.lastSyncedAt ? new Date(app.lastSyncedAt) : undefined
    };
  }
  
  // Affiliate link methods
  async getAffiliateLinks(appId: string): Promise<AffiliateLink[]> {
    return this.affiliateLinks.filter(link => link.appId === appId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getAllAffiliateLinks(): Promise<AffiliateLink[]> {
    return [...this.affiliateLinks];
  }
  
  async getAffiliateLinkById(id: number): Promise<AffiliateLink | undefined> {
    return this.affiliateLinks.find(link => link.id === id);
  }
  
  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const newId = this.affiliateLinks.length > 0 ? Math.max(...this.affiliateLinks.map(l => l.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newLink: AffiliateLink = {
      id: newId,
      ...link,
      clickCount: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.affiliateLinks.push(newLink);
    return newLink;
  }
  
  async updateAffiliateLink(id: number, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const index = this.affiliateLinks.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    this.affiliateLinks[index] = {
      ...this.affiliateLinks[index],
      ...link,
      updatedAt: new Date().toISOString()
    };
    
    return this.affiliateLinks[index];
  }
  
  async deleteAffiliateLink(id: number): Promise<boolean> {
    const initialLength = this.affiliateLinks.length;
    this.affiliateLinks = this.affiliateLinks.filter(l => l.id !== id);
    return initialLength > this.affiliateLinks.length;
  }
  
  async incrementLinkClickCount(id: number): Promise<AffiliateLink | undefined> {
    const link = this.affiliateLinks.find(l => l.id === id);
    if (!link) return undefined;
    
    link.clickCount += 1;
    link.updatedAt = new Date().toISOString();
    
    return link;
  }
  
  async getAffiliateLinkAnalytics(): Promise<{appId: string, appName: string, totalClicks: number}[]> {
    const analytics: Record<string, {appId: string, appName: string, totalClicks: number}> = {};
    
    for (const link of this.affiliateLinks) {
      if (link.appId) {
        if (!analytics[link.appId]) {
          const app = this.apps.find(a => a.id === link.appId);
          analytics[link.appId] = {
            appId: link.appId,
            appName: app?.name || 'Unknown App',
            totalClicks: 0
          };
        }
        
        analytics[link.appId].totalClicks += link.clickCount;
      }
    }
    
    return Object.values(analytics).sort((a, b) => b.totalClicks - a.totalClicks);
  }
  
  // App version history methods
  async getAppVersionHistory(appId: string): Promise<AppVersionHistory[]> {
    return this.appVersionHistory.filter(v => v.appId === appId)
      .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
  }
  
  async getLatestAppVersion(appId: string): Promise<AppVersionHistory | undefined> {
    const versions = await this.getAppVersionHistory(appId);
    return versions.length > 0 ? versions[0] : undefined;
  }
  
  async addAppVersionHistory(versionHistory: InsertAppVersionHistory): Promise<AppVersionHistory> {
    const newId = this.appVersionHistory.length > 0 ? 
      Math.max(...this.appVersionHistory.map(v => v.id)) + 1 : 1;
    
    const newVersion: AppVersionHistory = {
      id: newId,
      ...versionHistory,
      updateDate: new Date().toISOString()
    };
    
    this.appVersionHistory.push(newVersion);
    return newVersion;
  }
  
  async markVersionNotified(id: number): Promise<AppVersionHistory | undefined> {
    const version = this.appVersionHistory.find(v => v.id === id);
    if (!version) return undefined;
    
    version.isNotified = true;
    return version;
  }
  
  async getRecentAppUpdates(limit: number = 10): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    const updates = this.appVersionHistory
      .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime())
      .slice(0, limit);
    
    const result: {app: AppLegacy, versionHistory: AppVersionHistory}[] = [];
    
    for (const update of updates) {
      const app = this.apps.find(a => a.id === update.appId);
      if (app) {
        const category = this.categories.find(c => c.id === app.categoryId);
        result.push({
          app: this.convertToAppLegacy(app, category?.name || 'Unknown'),
          versionHistory: update
        });
      }
    }
    
    return result;
  }
  
  async getUnnotifiedUpdates(): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    const updates = this.appVersionHistory.filter(v => !v.isNotified);
    const result: {app: AppLegacy, versionHistory: AppVersionHistory}[] = [];
    
    for (const update of updates) {
      const app = this.apps.find(a => a.id === update.appId);
      if (app) {
        const category = this.categories.find(c => c.id === app.categoryId);
        result.push({
          app: this.convertToAppLegacy(app, category?.name || 'Unknown'),
          versionHistory: update
        });
      }
    }
    
    return result;
  }
  
  // Admin app methods
  async updateApp(id: string, appData: Partial<AppLegacy>): Promise<AppLegacy | undefined> {
    const index = this.apps.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.apps[index] = {
      ...this.apps[index],
      ...appData,
      // Handle special cases
      categoryId: appData.categoryId || this.apps[index].categoryId,
      isAffiliate: appData.isAffiliate !== undefined ? appData.isAffiliate : this.apps[index].isAffiliate,
      screenshots: appData.screenshots || this.apps[index].screenshots
    };
    
    const category = this.categories.find(c => c.id === this.apps[index].categoryId);
    return this.convertToAppLegacy(this.apps[index], category?.name || 'Unknown');
  }
  
  async deleteApp(id: string): Promise<boolean> {
    const initialLength = this.apps.length;
    
    // Delete affiliate links
    this.affiliateLinks = this.affiliateLinks.filter(l => l.appId !== id);
    
    // Delete version history
    this.appVersionHistory = this.appVersionHistory.filter(v => v.appId !== id);
    
    // Delete app
    this.apps = this.apps.filter(a => a.id !== id);
    
    return initialLength > this.apps.length;
  }
}

// Usar MemStorage para desarrollo local
export const storage = new MemStorage();
