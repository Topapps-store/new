import { pgTable, text, serial, integer, boolean, jsonb, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  iosAppStoreUrl: varchar("ios_app_store_url", { length: 255 }),
  originalAppId: varchar("original_app_id", { length: 100 }),
  screenshots: jsonb("screenshots").notNull().$type<string[]>(),
  isAffiliate: boolean("is_affiliate").default(false),
  lastSyncedAt: timestamp("last_synced_at"),
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
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  appId: varchar("app_id", { length: 100 }).references(() => apps.id),
  label: varchar("label", { length: 100 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  buttonText: varchar("button_text", { length: 100 }).notNull().default("Download Now"),
  buttonColor: varchar("button_color", { length: 50 }).notNull().default("#4CAF50"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(1),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export const appVersionHistory = pgTable("app_version_history", {
  id: serial("id").primaryKey(),
  appId: varchar("app_id", { length: 100 }).notNull()
    .references(() => apps.id),
  version: varchar("version", { length: 50 }).notNull(),
  releaseNotes: text("release_notes"),
  updateDate: timestamp("update_date").defaultNow(),
  isNotified: boolean("is_notified").notNull().default(false),
  isImportant: boolean("is_important").notNull().default(false),
  changesDetected: boolean("changes_detected").notNull().default(false),
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

// Click Fraud Protection tables

// Blocked IPs table for storing fraudulent/suspicious IP addresses
export const blockedIps = pgTable("blocked_ips", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull().unique(),
  reason: varchar("reason", { length: 255 }).notNull(),
  riskScore: integer("risk_score").notNull().default(0),
  isVpn: boolean("is_vpn").notNull().default(false),
  isProxy: boolean("is_proxy").notNull().default(false),
  country: varchar("country", { length: 2 }),
  city: varchar("city", { length: 100 }),
  userAgent: text("user_agent"),
  clickCount: integer("click_count").notNull().default(0),
  lastClickAt: timestamp("last_click_at"),
  blockedAt: timestamp("blocked_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
});

export const insertBlockedIpSchema = createInsertSchema(blockedIps).omit({
  id: true,
  clickCount: true,
  blockedAt: true,
});

export type InsertBlockedIp = z.infer<typeof insertBlockedIpSchema>;
export type BlockedIp = typeof blockedIps.$inferSelect;

// Click Events table for tracking all clicks and analyzing patterns
export const clickEvents = pgTable("click_events", {
  id: serial("id").primaryKey(),
  appId: varchar("app_id", { length: 100 }).references(() => apps.id),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  clickTimestamp: timestamp("click_timestamp").defaultNow(),
  sessionId: varchar("session_id", { length: 100 }),
  country: varchar("country", { length: 2 }),
  city: varchar("city", { length: 100 }),
  isVpn: boolean("is_vpn").notNull().default(false),
  isProxy: boolean("is_proxy").notNull().default(false),
  isBot: boolean("is_bot").notNull().default(false),
  riskScore: integer("risk_score").notNull().default(0),
  clickDuration: integer("click_duration"), // Time from page load to click in milliseconds
  mouseMovements: integer("mouse_movements").notNull().default(0),
  keyboardEvents: integer("keyboard_events").notNull().default(0),
  scrollEvents: integer("scroll_events").notNull().default(0),
  screenResolution: varchar("screen_resolution", { length: 20 }),
  timezone: varchar("timezone", { length: 50 }),
  language: varchar("language", { length: 10 }),
  isFraudulent: boolean("is_fraudulent").notNull().default(false),
  fraudReason: varchar("fraud_reason", { length: 255 }),
  conversionTracked: boolean("conversion_tracked").notNull().default(false),
});

export const clickEventsRelations = relations(clickEvents, ({ one }) => ({
  app: one(apps, {
    fields: [clickEvents.appId],
    references: [apps.id]
  })
}));

export const insertClickEventSchema = createInsertSchema(clickEvents).omit({
  id: true,
  clickTimestamp: true,
});

export type InsertClickEvent = z.infer<typeof insertClickEventSchema>;
export type ClickEvent = typeof clickEvents.$inferSelect;

// Fraud Detection Rules table for configurable detection rules
export const fraudDetectionRules = pgTable("fraud_detection_rules", {
  id: serial("id").primaryKey(),
  ruleName: varchar("rule_name", { length: 100 }).notNull().unique(),
  description: text("description"),
  ruleType: varchar("rule_type", { length: 50 }).notNull(), // 'ip_based', 'behavioral', 'time_based', 'pattern_based'
  conditions: jsonb("conditions").notNull(), // JSON with rule conditions
  action: varchar("action", { length: 50 }).notNull(), // 'block', 'flag', 'monitor'
  severity: integer("severity").notNull().default(1), // 1-10 scale
  isActive: boolean("is_active").notNull().default(true),
  triggerCount: integer("trigger_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFraudDetectionRuleSchema = createInsertSchema(fraudDetectionRules).omit({
  id: true,
  triggerCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFraudDetectionRule = z.infer<typeof insertFraudDetectionRuleSchema>;
export type FraudDetectionRule = typeof fraudDetectionRules.$inferSelect;

// Google Ads Integration table for managing campaign exclusions
export const googleAdsExclusions = pgTable("google_ads_exclusions", {
  id: serial("id").primaryKey(),
  campaignId: varchar("campaign_id", { length: 100 }).notNull(),
  campaignName: varchar("campaign_name", { length: 255 }),
  excludedIpAddress: varchar("excluded_ip_address", { length: 45 }).notNull(),
  exclusionReason: varchar("exclusion_reason", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // 'pending', 'active', 'failed'
  googleAdsResponse: jsonb("google_ads_response"),
  excludedAt: timestamp("excluded_at").defaultNow(),
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertGoogleAdsExclusionSchema = createInsertSchema(googleAdsExclusions).omit({
  id: true,
  excludedAt: true,
  lastSyncAt: true,
});

export type InsertGoogleAdsExclusion = z.infer<typeof insertGoogleAdsExclusionSchema>;
export type GoogleAdsExclusion = typeof googleAdsExclusions.$inferSelect;
