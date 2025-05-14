import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema-sqlite";
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure the data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create or open the SQLite database
export const sqlite = new Database(join(dataDir, 'topapps.db'));

// Initialize Drizzle ORM
export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema });

// Helper function to run migrations if needed
export function runMigrations() {
  try {
    // For simple setup, we'll just create tables directly rather than using migrations
    const tables = [
      schema.users,
      schema.categories,
      schema.apps,
      schema.affiliateLinks,
      schema.appVersionHistory
    ];
    
    // Create all tables if they don't exist
    for (const table of tables) {
      const tableName = table._.name.toString();
      const exists = sqlite.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(tableName);
      
      if (!exists) {
        console.log(`Creating table: ${tableName}`);
        // Simple schema creation - in production, you'd use proper migrations
        // This is just to get started
        const fields = Object.entries(table._.columns).map(([name, column]) => {
          const colDef = (column as any).$type;
          const isText = colDef === 'text' || colDef === 'varchar';
          const isInt = colDef === 'integer' || colDef === 'int';
          const isPrimary = name === 'id' && isInt;
          
          return `${name} ${isText ? 'TEXT' : isInt ? 'INTEGER' : 'BLOB'} ${isPrimary ? 'PRIMARY KEY AUTOINCREMENT' : ''}`;
        }).join(', ');
        
        sqlite.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${fields})`);
      }
    }
    
    console.log("Database setup complete");
    
    return true;
  } catch (error) {
    console.error("Error setting up SQLite database:", error);
    return false;
  }
}

// Helper function to check database connection
export function checkDatabaseConnection() {
  try {
    // Simple query to test the connection
    const result = sqlite.prepare('SELECT 1 as connected').get();
    console.log("Successfully connected to SQLite database");
    return true;
  } catch (error) {
    console.error("Failed to connect to SQLite database:", error);
    return false;
  }
}