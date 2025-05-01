import { pgTable, text, serial, integer, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// App Schema
export type App = {
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

// Category Schema
export type Category = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}
