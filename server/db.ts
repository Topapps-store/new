import { drizzle } from 'drizzle-orm/d1';
import * as schema from "@shared/schema";
import BetterSqlite3 from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { join } from 'path';

// This file handles both environments: 
// 1. Local development (Replit) using better-sqlite3
// 2. Production (Cloudflare) using D1

// For local development
let localDb;

// Function that will be used in the Express server
export function getDatabaseForServer() {
  // Only create the local database if we're not in production
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dataDir = process.env.DATA_DIR || '.';
      const sqlite = new BetterSqlite3(join(dataDir, 'topapps.db'));
      localDb = drizzleSqlite(sqlite, { schema });
      return localDb;
    } catch (error) {
      console.error('Failed to initialize local SQLite database:', error);
      throw error;
    }
  } else {
    console.warn('Warning: Attempting to use getDatabaseForServer in production.');
    return null;
  }
}

// This will be imported by the Cloudflare function
export function getDatabaseForCloudflare(env) {
  if (!env || !env.DB) {
    throw new Error('D1 database binding not found.');
  }
  return drizzle(env.DB, { schema });
}

// For backward compatibility
export const db = process.env.NODE_ENV !== 'production' ? getDatabaseForServer() : null;