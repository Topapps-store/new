import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the connection string for MySQL
const parseConnectionString = (connectionString: string) => {
  try {
    // Handle mysql:// format
    if (connectionString.startsWith('mysql://')) {
      return connectionString;
    }
    
    // If we have individual components in env vars, construct the connection string
    if (process.env.MYSQL_HOST && process.env.MYSQL_USER) {
      return {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
        ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined
      };
    }
    
    // Return the connection string as is
    return connectionString;
  } catch (error) {
    console.error("Error parsing MySQL connection string:", error);
    throw error;
  }
};

// Create connection pool
export const poolPromise = mysql.createPool(parseConnectionString(process.env.DATABASE_URL));

// Initialize Drizzle ORM
export const db = drizzle(poolPromise, { schema, mode: 'default' });

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const conn = await poolPromise.getConnection();
    console.log("Successfully connected to MySQL database");
    conn.release();
    return true;
  } catch (error) {
    console.error("Failed to connect to MySQL database:", error);
    return false;
  }
}