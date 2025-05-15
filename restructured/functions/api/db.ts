import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../../shared/schema';

// Configure WebSocket for Neon in serverless environments
neonConfig.webSocketConstructor = ws;

export function createDbClient() {
  // Check for DATABASE_URL in the environment
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment');
  }

  // Create a connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Create a Drizzle client with the schema
  const db = drizzle({ client: pool, schema });
  
  return { pool, db };
}