// Conexión a la base de datos Neon PostgreSQL desde Cloudflare
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Esta función maneja la conexión a la base de datos
export async function getDatabase(env) {
  // Verificar que tenemos la URL de la base de datos
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada. Por favor, configura esta variable en el panel de Cloudflare Pages.');
  }
  
  try {
    // Crear la conexión a la base de datos
    const pool = new Pool({ 
      connectionString: env.DATABASE_URL,
      ssl: true
    });
    
    // Probar la conexión
    await pool.query('SELECT NOW()');
    
    // Retornar pool para uso en los endpoints
    return pool;
  } catch (error) {
    console.error('Error al conectar con la base de datos Neon:', error);
    throw new Error(`No se pudo conectar a la base de datos: ${error.message}`);
  }
}

// Obtener una conexión a la base de datos con Drizzle ORM
export async function getDrizzleDB(env) {
  const pool = await getDatabase(env);
  
  // Importamos el esquema dinámicamente para evitar problemas con la compilación de Cloudflare
  const { default: schema } = await import('./schema.js');
  
  // Crear instancia de Drizzle
  return drizzle(pool, { schema });
}