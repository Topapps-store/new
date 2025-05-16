import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Variable de configuración para detectar si estamos en entorno estático (Cloudflare Pages)
const isStaticEnvironment = process.env.IS_STATIC === 'true' || 
                           typeof WebSocket !== 'undefined' ||
                           process.env.CF_PAGES === 'true';

// Variable global para almacenar la instancia de db
let dbInstance = null;
let poolInstance = null;

// Solo configurar la base de datos si no estamos en entorno estático
if (!isStaticEnvironment) {
  try {
    // Only set WebSocket constructor if we're not in a Cloudflare environment
    // Import ws - using dynamic import for ESM compatibility
    import('ws').then(ws => {
      neonConfig.webSocketConstructor = ws.default;
    }).catch(err => {
      console.warn('Error importing ws module:', err.message);
    });

    // Verificar que DATABASE_URL está definido
    if (process.env.DATABASE_URL) {
      poolInstance = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        // Enable TLS/SSL for better security
        ssl: true,
      });
      
      dbInstance = drizzle({ client: poolInstance, schema });
      console.log('Database connection configured successfully');
    } else {
      console.warn('DATABASE_URL not defined, database connection not established');
    }
  } catch (error) {
    console.error('Error initializing database connection:', error.message);
  }
}

// Exportar las instancias con verificación de nulos
export const pool = poolInstance;
export const db = dbInstance;