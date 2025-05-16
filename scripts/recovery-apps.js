/**
 * Script para recuperar todas las apps a partir de las URLs procesadas
 * Este script lee las URLs procesadas de pending-apps.json y las vuelve a añadir
 * al catálogo de aplicaciones en apps.json
 */

import fs from 'fs';
import path from 'path';
import * as gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene información de una aplicación en Google Play Store
 * @param {string} googlePlayId - ID de la aplicación en Google Play (ej. com.whatsapp)
 * @returns {Promise<Object>} - Datos de la aplicación
 */
async function getAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información para: ${googlePlayId}`);
    
    // Obtener información básica de la app
    const appInfo = await gplay.app({ appId: googlePlayId });
    
    // Formatear los datos para nuestro formato JSON
    const appData = {
      id: createAppId(appInfo.title), // Generamos un ID amigable basado en el título
      name: appInfo.title,
      category: appInfo.genre,
      categoryId: convertCategoryToId(appInfo.genre),
      description: appInfo.description,
      iconUrl: appInfo.icon,
      rating: appInfo.score,
      downloads: formatDownloads(appInfo.installs),
      version: appInfo.version,
      updated: formatDate(appInfo.updated),
      requires: `Android ${appInfo.androidVersion}+`,
      developer: appInfo.developer,
      installs: appInfo.installs,
      downloadUrl: appInfo.url, // URL para descargar
      googlePlayUrl: appInfo.url, // URL de Google Play
      screenshots: appInfo.screenshots,
      isAffiliate: false
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información para ${googlePlayId}:`, error);
    return null;
  }
}

/**
 * Convierte un nombre de categoría a un ID amigable para URLs
 * @param {string} category - Nombre de la categoría
 * @returns {string} - ID de la categoría
 */
function convertCategoryToId(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Crea un ID amigable basado en el nombre de la app
 * @param {string} appName - Nombre de la aplicación
 * @returns {string} - ID amigable para URLs
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formatea el conteo de instalaciones
 * @param {string} installs - Conteo de instalaciones (ej. "1,000,000,000+")
 * @returns {string} - Formato abreviado (ej. "1B+")
 */
function formatDownloads(installs) {
  const numStr = installs.replace(/[^0-9]/g, '');
  const num = parseInt(numStr, 10);
  
  if (num >= 1000000000) {
    return `${Math.floor(num / 1000000000)}B+`;
  } else if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  
  return `${num}+`;
}

/**
 * Formatea una fecha al formato deseado
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej. "May 10, 2023")
 */
function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 * @param {string} url - URL de Google Play
 * @returns {string} - ID de la app
 */
function extractAppIdFromUrl(url) {
  try {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
    
    // Si no hay un parámetro id=, intentamos extraer la última parte de la URL
    const pathMatch = url.match(/details\/([^?]+)/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
    
    throw new Error('No se pudo extraer el ID de la app desde la URL');
  } catch (error) {
    console.error('Error al extraer el ID desde la URL:', error);
    return null;
  }
}

/**
 * Actualiza el archivo apps.json con los datos de nuevas apps
 * @param {Array} newApps - Array de apps a añadir
 * @returns {Promise<void>}
 */
async function updateAppsJson(newApps) {
  try {
    // Ruta al archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    
    // Leer el archivo actual
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    // Crear un mapa de las apps existentes por ID para verificación rápida
    const existingAppsMap = {};
    appsData.apps.forEach(app => {
      existingAppsMap[app.id] = true;
    });
    
    // Filtrar las nuevas apps que no existen aún
    const uniqueNewApps = newApps.filter(app => !existingAppsMap[app.id]);
    
    if (uniqueNewApps.length === 0) {
      console.log('No hay nuevas apps para añadir.');
      return;
    }
    
    // Añadir las nuevas apps
    appsData.apps = [...appsData.apps, ...uniqueNewApps];
    
    // Guardar el archivo actualizado
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log(`Se añadieron ${uniqueNewApps.length} nuevas apps al archivo apps.json`);
  } catch (error) {
    console.error('Error al actualizar el archivo apps.json:', error);
    throw error;
  }
}

/**
 * Función principal para recuperar todas las apps
 */
async function recoverAllApps() {
  try {
    // Ruta al archivo de URLs procesadas
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    // Leer el archivo pendingApps.json
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    const { processedUrls } = pendingAppsData;
    
    if (processedUrls.length === 0) {
      console.log('No hay URLs procesadas para recuperar.');
      return;
    }
    
    console.log(`Recuperando ${processedUrls.length} apps desde URLs procesadas...`);
    
    const newApps = [];
    
    // Procesar cada URL que ya fue procesada previamente
    for (const url of processedUrls) {
      try {
        const appId = extractAppIdFromUrl(url);
        if (!appId) {
          console.error(`No se pudo extraer el ID de la app desde la URL: ${url}`);
          continue;
        }
        
        const appData = await getAppInfo(appId);
        if (appData) {
          newApps.push(appData);
          console.log(`✓ Recuperada app: ${appData.name}`);
        }
      } catch (error) {
        console.error(`Error recuperando la app desde URL ${url}:`, error);
      }
    }
    
    if (newApps.length > 0) {
      // Actualizar apps.json con las apps recuperadas
      await updateAppsJson(newApps);
      console.log(`Recuperación completada. Se añadieron ${newApps.length} apps al catálogo.`);
    } else {
      console.log('No se pudo recuperar ninguna app correctamente.');
    }
  } catch (error) {
    console.error('Error en la recuperación de apps:', error);
  }
}

// Ejecutar la función principal
recoverAllApps().catch(error => {
  console.error('Error al ejecutar la recuperación de apps:', error);
});