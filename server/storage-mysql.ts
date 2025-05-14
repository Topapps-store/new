import { users, type User, type InsertUser, apps, categories, affiliateLinks, appVersionHistory, type AffiliateLink, type InsertAffiliateLink, type AppVersionHistory, type InsertAppVersionHistory } from "@shared/schema-mysql";
import { db } from "./db-mysql";
import { eq, desc, sql, isNull, not, count, and, like } from "drizzle-orm";
import { type AppLegacy, type CategoryLegacy } from "@shared/schema-mysql";
import createMemoryStore from "memorystore";
import session from "express-session";

// Create a memory store for sessions
const MemoryStore = createMemoryStore(session);

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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MySQLStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    // Initialize in-memory session store (in production, you'd want to use a MySQL session store)
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // App operations
  async getApps(): Promise<AppLegacy[]> {
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id));
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  async getPopularApps(): Promise<AppLegacy[]> {
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .orderBy(desc(apps.rating))
    .limit(12);
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  async getRecentApps(): Promise<AppLegacy[]> {
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .orderBy(desc(apps.lastSyncedAt))
    .limit(12);
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  async getJustInTimeApps(): Promise<AppLegacy[]> {
    // Simulating "just in time" apps by getting a different selection
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .orderBy(apps.name)
    .limit(12);
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  async getAppById(id: string): Promise<AppLegacy | undefined> {
    const [result] = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(eq(apps.id, id));
    
    if (!result) return undefined;
    return this.convertToAppLegacy(result.app, result.categoryName || '');
  }
  
  async getRelatedApps(id: string): Promise<AppLegacy[]> {
    // Get the category of the specified app
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    if (!app) return [];
    
    // Get apps from the same category, excluding the original app
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(and(
      eq(apps.categoryId, app.categoryId),
      not(eq(apps.id, id))
    ))
    .limit(8);
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  async searchApps(query: string): Promise<AppLegacy[]> {
    const searchQuery = `%${query}%`;
    
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(
      like(apps.name, searchQuery)
    )
    .limit(50);
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  // Category operations
  async getCategories(): Promise<CategoryLegacy[]> {
    const categoryList = await db.select().from(categories);
    return categoryList.map(category => ({
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
    const [category] = await db.select().from(categories).where(eq(categories.id, categoryId));
    if (!category) return [];
    
    const appResults = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(eq(apps.categoryId, categoryId));
    
    return appResults.map(result => this.convertToAppLegacy(result.app, result.categoryName || ''));
  }
  
  // Helper method to convert from new schema to legacy format
  private convertToAppLegacy(app: any, categoryName: string): AppLegacy {
    return {
      id: app.id,
      name: app.name,
      category: categoryName,
      categoryId: app.categoryId,
      description: app.description || '',
      iconUrl: app.iconUrl || '',
      rating: app.rating || 0,
      downloads: app.downloads || '0',
      version: app.version || '',
      size: app.size || '',
      updated: app.updated || '',
      requires: app.requires || '',
      developer: app.developer || '',
      installs: app.installs || '',
      downloadUrl: app.downloadUrl || '',
      googlePlayUrl: app.googlePlayUrl || '',
      iosAppStoreUrl: app.iosAppStoreUrl,
      originalAppId: app.originalAppId,
      screenshots: app.screenshots || [],
      isAffiliate: false,
      lastSyncedAt: app.lastSyncedAt
    };
  }
  
  // Affiliate links operations
  async getAffiliateLinks(appId: string): Promise<AffiliateLink[]> {
    return db.select().from(affiliateLinks).where(eq(affiliateLinks.appId, appId));
  }
  
  async getAffiliateLinkById(id: number): Promise<AffiliateLink | undefined> {
    const [link] = await db.select().from(affiliateLinks).where(eq(affiliateLinks.id, id));
    return link;
  }
  
  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const [newLink] = await db.insert(affiliateLinks).values(link).returning();
    return newLink;
  }
  
  async updateAffiliateLink(id: number, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const [updatedLink] = await db
      .update(affiliateLinks)
      .set({
        ...link,
        updatedAt: new Date()
      })
      .where(eq(affiliateLinks.id, id))
      .returning();
    
    return updatedLink;
  }
  
  async deleteAffiliateLink(id: number): Promise<boolean> {
    const result = await db.delete(affiliateLinks).where(eq(affiliateLinks.id, id));
    return true; // MySQL doesn't return the deleted count directly
  }
  
  async incrementLinkClickCount(id: number): Promise<AffiliateLink | undefined> {
    const [updatedLink] = await db
      .update(affiliateLinks)
      .set({
        clicks: sql`${affiliateLinks.clicks} + 1`,
        lastClickedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(affiliateLinks.id, id))
      .returning();
    
    return updatedLink;
  }
  
  async updateApp(id: string, appData: Partial<AppLegacy>): Promise<AppLegacy | undefined> {
    // First find the app to get its category info
    const [existingApp] = await db.select({
      app: apps,
      categoryName: categories.name
    })
    .from(apps)
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(eq(apps.id, id));
    
    if (!existingApp) return undefined;
    
    // Convert legacy format to new schema
    const updateData: any = {};
    
    if (appData.name) updateData.name = appData.name;
    if (appData.categoryId) updateData.categoryId = appData.categoryId;
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
    if (appData.screenshots) updateData.screenshots = appData.screenshots;
    
    // Update the app
    const [updatedApp] = await db
      .update(apps)
      .set(updateData)
      .where(eq(apps.id, id))
      .returning();
    
    if (!updatedApp) return undefined;
    
    // If the category ID changed, get the new category name
    let categoryName = existingApp.categoryName || '';
    if (appData.categoryId && appData.categoryId !== existingApp.app.categoryId) {
      const [newCategory] = await db.select().from(categories).where(eq(categories.id, appData.categoryId));
      if (newCategory) categoryName = newCategory.name;
    }
    
    return this.convertToAppLegacy(updatedApp, categoryName);
  }
  
  async deleteApp(id: string): Promise<boolean> {
    // First delete all affiliate links associated with this app
    await db.delete(affiliateLinks).where(eq(affiliateLinks.appId, id));
    
    // Then delete all version history entries
    await db.delete(appVersionHistory).where(eq(appVersionHistory.appId, id));
    
    // Finally delete the app
    await db.delete(apps).where(eq(apps.id, id));
    
    return true;
  }
  
  async getAllAffiliateLinks(): Promise<AffiliateLink[]> {
    return db.select().from(affiliateLinks);
  }
  
  async getAffiliateLinkAnalytics(): Promise<{appId: string, appName: string, totalClicks: number}[]> {
    const results = await db.select({
      appId: affiliateLinks.appId,
      appName: apps.name,
      totalClicks: sql<number>`SUM(${affiliateLinks.clicks})`
    })
    .from(affiliateLinks)
    .leftJoin(apps, eq(affiliateLinks.appId, apps.id))
    .groupBy(affiliateLinks.appId, apps.name)
    .orderBy(desc(sql<number>`SUM(${affiliateLinks.clicks})`));
    
    return results;
  }
  
  // App version history operations
  async getAppVersionHistory(appId: string): Promise<AppVersionHistory[]> {
    return db.select()
      .from(appVersionHistory)
      .where(eq(appVersionHistory.appId, appId))
      .orderBy(desc(appVersionHistory.releaseDate));
  }
  
  async getLatestAppVersion(appId: string): Promise<AppVersionHistory | undefined> {
    const [latest] = await db.select()
      .from(appVersionHistory)
      .where(eq(appVersionHistory.appId, appId))
      .orderBy(desc(appVersionHistory.releaseDate))
      .limit(1);
    
    return latest;
  }
  
  async addAppVersionHistory(versionHistory: InsertAppVersionHistory): Promise<AppVersionHistory> {
    const [newVersionHistory] = await db
      .insert(appVersionHistory)
      .values(versionHistory)
      .returning();
    
    return newVersionHistory;
  }
  
  async markVersionNotified(id: number): Promise<AppVersionHistory | undefined> {
    const [updatedVersion] = await db
      .update(appVersionHistory)
      .set({ isNotified: true })
      .where(eq(appVersionHistory.id, id))
      .returning();
    
    return updatedVersion;
  }
  
  async getRecentAppUpdates(limit: number = 10): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    const results = await db.select({
      app: apps,
      versionHistory: appVersionHistory,
      categoryName: categories.name
    })
    .from(appVersionHistory)
    .innerJoin(apps, eq(appVersionHistory.appId, apps.id))
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .orderBy(desc(appVersionHistory.releaseDate))
    .limit(limit);
    
    return results.map(result => ({
      app: this.convertToAppLegacy(result.app, result.categoryName || ''),
      versionHistory: result.versionHistory
    }));
  }
  
  async getUnnotifiedUpdates(): Promise<{app: AppLegacy, versionHistory: AppVersionHistory}[]> {
    const results = await db.select({
      app: apps,
      versionHistory: appVersionHistory,
      categoryName: categories.name
    })
    .from(appVersionHistory)
    .innerJoin(apps, eq(appVersionHistory.appId, apps.id))
    .leftJoin(categories, eq(apps.categoryId, categories.id))
    .where(eq(appVersionHistory.isNotified, false))
    .orderBy(desc(appVersionHistory.releaseDate));
    
    return results.map(result => ({
      app: this.convertToAppLegacy(result.app, result.categoryName || ''),
      versionHistory: result.versionHistory
    }));
  }
}

export const mysqlStorage = new MySQLStorage();