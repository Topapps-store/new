import { 
  App, AppLegacy, Category, CategoryLegacy, 
  InsertApp, InsertCategory, InsertUser, User,
  AffiliateLink, InsertAffiliateLink,
  apps, categories, users, affiliateLinks
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
  getAppById(id: string): Promise<AppLegacy | undefined>;
  getRelatedApps(id: string): Promise<AppLegacy[]>;
  searchApps(query: string): Promise<AppLegacy[]>;
  
  // Category operations
  getCategories(): Promise<CategoryLegacy[]>;
  getCategoryById(id: string): Promise<CategoryLegacy | undefined>;
  getAppsByCategory(categoryId: string): Promise<AppLegacy[]>;
  
  // Affiliate links operations
  getAffiliateLinks(appId: string): Promise<AffiliateLink[]>;
  getAffiliateLinkById(id: number): Promise<AffiliateLink | undefined>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: number, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: number): Promise<boolean>;
  incrementLinkClickCount(id: number): Promise<AffiliateLink | undefined>;
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
}

export const storage = new DatabaseStorage();
