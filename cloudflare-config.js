/**
 * Configuración para despliegue en Cloudflare Pages
 * 
 * Este archivo contiene la configuración específica para el despliegue
 * estático en Cloudflare Pages.
 */

// Definición de variables de entorno para Cloudflare
const CLOUDFLARE_CONFIG = {
  // URL de la API en Replit (para proxy)
  REPLIT_API_URL: 'https://topapps.replit.app',
  
  // Indicador de entorno estático
  IS_STATIC: true,
  
  // Asegurarse de que usamos el archivo JSON en lugar de la base de datos
  USE_JSON_DATA: true,
  
  // Configuración para manejo de enlaces
  DOWNLOAD_LINK_BASE: 'https://topapps.store/download',
  
  // Versión del proyecto (actualizar con cada despliegue)
  VERSION: '1.0.0',

  // Fecha de última actualización
  LAST_UPDATED: new Date().toISOString()
};

module.exports = CLOUDFLARE_CONFIG;