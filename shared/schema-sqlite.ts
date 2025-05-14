import { sqliteTable, text, integer, blob, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  apps: many(apps),
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
  categoryId: text("category_id").notNull().references(() => categories.id),
  description: text("description"),
  iconUrl: text("icon_url"),
  rating: blob("rating", { mode: "number" }).default(0),
  downloads: text("downloads").default("0"),
  version: text("version"),
  size: text("size"),
  updated: text("updated"),
  requires: text("requires"),
  developer: text("developer"),
  installs: text("installs"),
  downloadUrl: text("download_url"),
  googlePlayUrl: text("google_play_url"),
  iosAppStoreUrl: text("ios_app_store_url"),
  originalAppId: text("original_app_id"),
  screenshots: text("screenshots", { mode: "json" }).$type<string[]>(),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
}, (table) => ({
  categoryIdIdx: unique("category_id_idx").on(table.categoryId),
}));

export const appsRelations = relations(apps, ({ one }) => ({
  category: one(categories, {
    fields: [apps.categoryId],
    references: [categories.id],
  }),
}));

export const insertAppSchema = createInsertSchema(apps).omit({
  id: true,
  lastSyncedAt: true,
  createdAt: true,
});

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;

// Legacy types for compatibility
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

// Affiliate links table
export const affiliateLinks = sqliteTable("affiliate_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appId: text("app_id").notNull().references(() => apps.id),
  url: text("url").notNull(),
  buttonText: text("button_text").notNull().default("Download Now"),
  buttonColor: text("button_color").default("#22c55e"),
  label: text("label"),
  clicks: integer("clicks").default(0),
  lastClickedAt: integer("last_clicked_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow(),
});

export const affiliateLinksRelations = relations(affiliateLinks, ({ one }) => ({
  app: one(apps, {
    fields: [affiliateLinks.appId],
    references: [apps.id],
  }),
}));

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  clicks: true,
  lastClickedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;

// App version history table
export const appVersionHistory = sqliteTable("app_version_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appId: text("app_id").notNull().references(() => apps.id),
  version: text("version").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).defaultNow(),
  changeLog: text("change_log"),
  isNotified: integer("is_notified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const appVersionHistoryRelations = relations(appVersionHistory, ({ one }) => ({
  app: one(apps, {
    fields: [appVersionHistory.appId],
    references: [apps.id],
  }),
}));

export const insertAppVersionHistorySchema = createInsertSchema(appVersionHistory).omit({
  id: true,
  isNotified: true,
  createdAt: true,
});

export type InsertAppVersionHistory = z.infer<typeof insertAppVersionHistorySchema>;
export type AppVersionHistory = typeof appVersionHistory.$inferSelect;