import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Check if we're running in a Cloudflare environment
const isCloudflare = typeof WebSocket !== 'undefined';

// Only set WebSocket constructor if we're not in a Cloudflare environment
if (!isCloudflare) {
  // Import ws - using dynamic import for ESM compatibility
  import('ws').then(ws => {
    neonConfig.webSocketConstructor = ws.default;
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Enable TLS/SSL for better security
  ssl: true,
});

export const db = drizzle({ client: pool, schema });