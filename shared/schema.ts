import { pgTable, text, serial, integer, boolean, jsonb, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  color: varchar("color", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
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
export const apps = pgTable("apps", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: varchar("category_id", { length: 50 }).notNull()
    .references(() => categories.id),
  description: text("description").notNull(),
  iconUrl: varchar("icon_url", { length: 255 }).notNull(),
  rating: real("rating").notNull(),
  downloads: varchar("downloads", { length: 50 }).notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  updated: varchar("updated", { length: 100 }).notNull(),
  requires: varchar("requires", { length: 100 }).notNull(),
  developer: varchar("developer", { length: 255 }).notNull(),
  installs: varchar("installs", { length: 100 }).notNull(),
  downloadUrl: varchar("download_url", { length: 255 }).notNull(),
  googlePlayUrl: varchar("google_play_url", { length: 255 }).notNull(),
  screenshots: jsonb("screenshots").notNull().$type<string[]>(),
  isAffiliate: boolean("is_affiliate").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
  screenshots: string[];
  isAffiliate?: boolean;
}

export type CategoryLegacy = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}
