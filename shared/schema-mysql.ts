import { mysqlTable, text, int, boolean, timestamp, varchar, json, float, unique } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  color: varchar("color", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
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
export const apps = mysqlTable("apps", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: varchar("category_id", { length: 50 }).notNull().references(() => categories.id),
  description: text("description"),
  iconUrl: varchar("icon_url", { length: 255 }),
  rating: float("rating").default(0),
  downloads: varchar("downloads", { length: 50 }).default("0"),
  version: varchar("version", { length: 50 }),
  size: varchar("size", { length: 50 }),
  updated: varchar("updated", { length: 255 }),
  requires: varchar("requires", { length: 255 }),
  developer: varchar("developer", { length: 255 }),
  installs: varchar("installs", { length: 255 }),
  downloadUrl: varchar("download_url", { length: 255 }),
  googlePlayUrl: varchar("google_play_url", { length: 255 }),
  iosAppStoreUrl: varchar("ios_app_store_url", { length: 255 }),
  originalAppId: varchar("original_app_id", { length: 255 }),
  screenshots: json("screenshots").$type<string[]>(),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
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
export const affiliateLinks = mysqlTable("affiliate_links", {
  id: int("id").primaryKey().autoincrement(),
  appId: varchar("app_id", { length: 50 }).notNull().references(() => apps.id),
  url: varchar("url", { length: 2048 }).notNull(),
  buttonText: varchar("button_text", { length: 100 }).notNull().default("Download Now"),
  buttonColor: varchar("button_color", { length: 50 }).default("#22c55e"),
  label: varchar("label", { length: 255 }),
  clicks: int("clicks").default(0),
  lastClickedAt: timestamp("last_clicked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export const appVersionHistory = mysqlTable("app_version_history", {
  id: int("id").primaryKey().autoincrement(),
  appId: varchar("app_id", { length: 50 }).notNull().references(() => apps.id),
  version: varchar("version", { length: 50 }).notNull(),
  releaseDate: timestamp("release_date").defaultNow(),
  changeLog: text("change_log"),
  isNotified: boolean("is_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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