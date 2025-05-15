#!/usr/bin/env node

/**
 * Script para verificar la migración a Neon PostgreSQL
 * 
 * Este script hace lo siguiente:
 * 1. Se conecta a la base de datos Neon usando la URL proporcionada
 * 2. Ejecuta consultas para verificar que los datos se migraron correctamente
 * 3. Muestra estadísticas sobre las tablas
 * 
 * Uso:
 * 1. Asegúrate de que DATABASE_URL apunte a tu base de datos Neon
 * 2. Ejecuta: node scripts/verify-neon-migration.js
 */

const { Pool } = require('@neondatabase/serverless');
const util = require('util');

// Colores para la salida en consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Función para imprimir mensajes con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    log('⛔ ERROR: DATABASE_URL no está configurado. Por favor configúralo con la URL de conexión de Neon.', 'red');
    process.exit(1);
  }

  log('🔍 Verificando conexión a Neon PostgreSQL...', 'cyan');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  try {
    // Verificar la conexión
    const client = await pool.connect();
    log('✅ Conexión exitosa a la base de datos.', 'green');
    
    // Verificar que las tablas existen
    const tables = ['users', 'apps', 'categories', 'affiliate_links', 'app_version_history'];
    log('\n📊 Verificando tablas y contando registros:', 'magenta');
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(result.rows[0].count, 10);
        
        if (count > 0) {
          log(`✅ Tabla ${table}: ${count} registros`, 'green');
        } else {
          log(`⚠️  Tabla ${table}: ${count} registros (vacía)`, 'yellow');
        }
      } catch (err) {
        log(`⛔ Error al verificar tabla ${table}: ${err.message}`, 'red');
      }
    }
    
    // Verificar relaciones (ejemplo con apps y categorías)
    try {
      const appsWithCategories = await client.query(`
        SELECT a.id, a.name, c.name as category_name
        FROM apps a
        JOIN categories c ON a.category_id = c.id
        LIMIT 5
      `);
      
      if (appsWithCategories.rows.length > 0) {
        log('\n✅ Relaciones entre tablas verificadas exitosamente.', 'green');
        log('\n📱 Primeras 5 aplicaciones con sus categorías:', 'blue');
        appsWithCategories.rows.forEach(row => {
          log(`  - ${row.name} (${row.category_name})`, 'cyan');
        });
      } else {
        log('\n⚠️  No se encontraron aplicaciones con categorías asignadas.', 'yellow');
      }
    } catch (err) {
      log(`\n⛔ Error al verificar relaciones: ${err.message}`, 'red');
    }
    
    client.release();
    log('\n🎉 Verificación completada. La migración parece exitosa.', 'green');
    log('   Puedes continuar con la configuración de GitHub y Cloudflare.', 'green');
    
  } catch (err) {
    log(`\n⛔ ERROR: No se pudo conectar a la base de datos: ${err.message}`, 'red');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();