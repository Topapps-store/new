/**
 * Este script limpia la base de datos de aplicaciones y categorías
 */

import { db } from '../server/db-sqlite';
import { apps, categories, affiliateLinks } from '../shared/schema-sqlite';
import { sql } from 'drizzle-orm';

/**
 * Script de limpieza de base de datos
 */
async function cleanDatabase() {
  console.log('Iniciando limpieza de la base de datos...');
  
  try {
    // Verificamos primero qué tablas existen
    console.log('Verificando tablas existentes...');
    
    try {
      // Eliminar enlaces de afiliados
      console.log('Eliminando enlaces de afiliados...');
      await db.delete(affiliateLinks);
    } catch (error) {
      console.log('Tabla de enlaces de afiliados no existe o está vacía.');
    }
    
    try {
      // Eliminar apps
      console.log('Eliminando aplicaciones...');
      await db.delete(apps);
    } catch (error) {
      console.log('Tabla de aplicaciones no existe o está vacía.');
    }
    
    // Inicializar la tabla de aplicaciones si es necesario
    try {
      await db.run(sql`CREATE TABLE IF NOT EXISTS apps (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        description TEXT,
        icon_url TEXT,
        rating REAL DEFAULT 0,
        downloads TEXT DEFAULT '0',
        version TEXT,
        size TEXT,
        updated TEXT,
        requires TEXT,
        developer TEXT,
        installs TEXT,
        download_url TEXT,
        google_play_url TEXT,
        original_app_id TEXT,
        screenshots TEXT,
        last_synced_at INTEGER,
        created_at INTEGER DEFAULT (unixepoch())
      )`);
      console.log('Tabla de aplicaciones inicializada.');
    } catch (error) {
      console.error('Error al inicializar la tabla de aplicaciones:', error);
    }
    
    // Inicializar la tabla de categorías si es necesario
    try {
      await db.run(sql`CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        created_at INTEGER DEFAULT (unixepoch())
      )`);
      console.log('Tabla de categorías inicializada.');
    } catch (error) {
      console.error('Error al inicializar la tabla de categorías:', error);
    }
    
    // Inicializar la tabla de enlaces de afiliados si es necesario
    try {
      await db.run(sql`CREATE TABLE IF NOT EXISTS affiliate_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_id TEXT NOT NULL,
        url TEXT NOT NULL,
        button_text TEXT NOT NULL DEFAULT 'Download Now',
        button_color TEXT DEFAULT '#22c55e',
        label TEXT,
        clicks INTEGER DEFAULT 0,
        last_clicked_at INTEGER,
        created_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (app_id) REFERENCES apps(id)
      )`);
      console.log('Tabla de enlaces de afiliados inicializada.');
    } catch (error) {
      console.error('Error al inicializar la tabla de enlaces de afiliados:', error);
    }
    
    console.log('¡Base de datos limpiada e inicializada con éxito!');
  } catch (error) {
    console.error('Error general al limpiar la base de datos:', error);
  }
}

// Ejecutar la función principal
cleanDatabase().catch(console.error);