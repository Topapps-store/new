#!/usr/bin/env node

/**
 * Script para migrar la base de datos a Neon PostgreSQL
 * 
 * Este script hace lo siguiente:
 * 1. Se conecta a la base de datos Neon usando la URL proporcionada
 * 2. Ejecuta Drizzle para crear el esquema
 * 3. Valida la conexión e información de la base de datos
 * 
 * Uso:
 * 1. Configura la variable de entorno DATABASE_URL con la URL de conexión de Neon
 * 2. Ejecuta: node scripts/migrate-to-neon.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Verificar que DATABASE_URL está configurado
if (!process.env.DATABASE_URL) {
  log('⛔ ERROR: DATABASE_URL no está configurado. Por favor configúralo con la URL de conexión de Neon.', 'red');
  log('Ejemplo: export DATABASE_URL="postgres://user:password@host:port/database"', 'yellow');
  process.exit(1);
}

// Verificar si la URL contiene "neon.tech" para asegurarnos de que es una URL de Neon
if (!process.env.DATABASE_URL.includes('neon.tech')) {
  log('⚠️  ADVERTENCIA: La URL de la base de datos no parece ser de Neon.', 'yellow');
  log('Este script está diseñado para migrar a Neon PostgreSQL.', 'yellow');
  log('Si estás seguro de continuar, presiona Enter. De lo contrario, presiona Ctrl+C para cancelar.', 'yellow');
  
  // Esperar confirmación del usuario
  process.stdin.resume();
  process.stdin.on('data', () => {
    process.stdin.pause();
    startMigration();
  });
} else {
  startMigration();
}

function startMigration() {
  log('\n🚀 Iniciando migración a Neon PostgreSQL...', 'cyan');
  
  // Verificar si existe el respaldo
  const backupPath = path.join(__dirname, '..', 'backups', 'topapps_backup.sql');
  
  if (!fs.existsSync(backupPath)) {
    log('⛔ ERROR: No se encontró el archivo de respaldo.', 'red');
    log(`Esperaba encontrarlo en: ${backupPath}`, 'yellow');
    log('Por favor, ejecuta pg_dump primero para crear un respaldo.', 'yellow');
    process.exit(1);
  }
  
  log('✅ Archivo de respaldo encontrado.', 'green');
  
  // Ejecutar drizzle-kit push para crear el esquema en Neon
  log('\n🔧 Creando esquema en Neon usando Drizzle...', 'cyan');
  
  const drizzlePush = spawn('npx', ['drizzle-kit', 'push:pg'], {
    stdio: 'inherit',
    shell: true,
  });
  
  drizzlePush.on('close', (code) => {
    if (code !== 0) {
      log('⛔ ERROR: No se pudo crear el esquema con Drizzle.', 'red');
      process.exit(1);
    }
    
    log('✅ Esquema creado exitosamente.', 'green');
    
    // Mostrar instrucciones para la migración de datos
    log('\n📋 Instrucciones para migrar datos:', 'magenta');
    log('1. Restaura el respaldo en Neon:', 'yellow');
    log(`   psql ${process.env.DATABASE_URL} < ${backupPath}`, 'cyan');
    log('\n2. Verifica la migración con:', 'yellow');
    log('   node scripts/verify-neon-migration.js', 'cyan');
    
    log('\n🎉 Preparación completada. Sigue las instrucciones anteriores para completar la migración.', 'green');
  });
}