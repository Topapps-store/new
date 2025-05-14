import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: 'boolean' }).notNull().default(false),
  createdAt: text("created_at").default(String(new Date().toISOString())),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  createdAt: text("created_at").default(String(new Date().toISOString())),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  apps: many(apps)
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  id: true,
  name: true,
  icon: true,
  color: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Apps table
export const apps = sqliteTable("apps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: text("category_id").notNull()
    .references(() => categories.id),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
  rating: real("rating").notNull(),
  downloads: text("downloads").notNull(),
  version: text("version").notNull(),
  size: text("size").notNull(),
  updated: text("updated").notNull(),
  requires: text("requires").notNull(),
  developer: text("developer").notNull(),
  installs: text("installs").notNull(),
  downloadUrl: text("download_url").notNull(),
  googlePlayUrl: text("google_play_url").notNull(),
  iosAppStoreUrl: text("ios_app_store_url"),
  originalAppId: text("original_app_id"),
  screenshots: text("screenshots").notNull().$type<string>(), // Stored as JSON string in SQLite
  isAffiliate: integer("is_affiliate", { mode: 'boolean' }).default(false),
  lastSyncedAt: text("last_synced_at"),
  createdAt: text("created_at").default(String(new Date().toISOString())),
});

export const appsRelations = relations(apps, ({ one }) => ({
  category: one(categories, {
    fields: [apps.categoryId],
    references: [categories.id]
  })
}));

export const insertAppSchema = createInsertSchema(apps).omit({
  createdAt: true,
});

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;

// Keep legacy types for compatibility
export type AppLegacy = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  version: string;
  size: string;
  updated: string;
  requires: string;
  developer: string;
  installs: string;
  downloadUrl: string;
  googlePlayUrl: string;
  iosAppStoreUrl?: string;
  originalAppId?: string;
  screenshots: string[];
  isAffiliate?: boolean;
  lastSyncedAt?: Date;
}

export type CategoryLegacy = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

// Affiliate Links table for advertisement buttons
export const affiliateLinks = sqliteTable("affiliate_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appId: text("app_id").references(() => apps.id),
  label: text("label").notNull(),
  url: text("url").notNull(),
  buttonText: text("button_text").notNull().default("Download Now"),
  buttonColor: text("button_color").notNull().default("#4CAF50"),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(1),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: text("created_at").default(String(new Date().toISOString())),
  updatedAt: text("updated_at").default(String(new Date().toISOString())),
});

export const affiliateLinksRelations = relations(affiliateLinks, ({ one }) => ({
  app: one(apps, {
    fields: [affiliateLinks.appId],
    references: [apps.id]
  })
}));

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  clickCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;

// App Version History table
export const appVersionHistory = sqliteTable("app_version_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appId: text("app_id").notNull()
    .references(() => apps.id),
  version: text("version").notNull(),
  releaseNotes: text("release_notes"),
  updateDate: text("update_date").default(String(new Date().toISOString())),
  isNotified: integer("is_notified", { mode: 'boolean' }).notNull().default(false),
  isImportant: integer("is_important", { mode: 'boolean' }).notNull().default(false),
  changesDetected: integer("changes_detected", { mode: 'boolean' }).notNull().default(false),
});

export const appVersionHistoryRelations = relations(appVersionHistory, ({ one }) => ({
  app: one(apps, {
    fields: [appVersionHistory.appId],
    references: [apps.id]
  })
}));

export const insertAppVersionHistorySchema = createInsertSchema(appVersionHistory).omit({
  id: true,
  updateDate: true,
});

export type InsertAppVersionHistory = z.infer<typeof insertAppVersionHistorySchema>;
export type AppVersionHistory = typeof appVersionHistory.$inferSelect;
