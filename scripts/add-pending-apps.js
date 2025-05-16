/**
 * Script para procesar las URLs pendientes y añadir las aplicaciones a apps.json
 * Este script lee las URLs pendientes de pending-apps.json y las procesa
 * para obtener información de Google Play y añadirlas al catálogo
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
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
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej. "May 10, 2023")
 */
function formatDate(date) {
  // Si date es string, usarlo como está (ya viene formateado de la API)
  if (typeof date === 'string') {
    return date;
  }
  
  // Si es objeto Date, formatearlo
  if (date instanceof Date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // En caso de error, devolver la fecha actual
  const now = new Date();
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return now.toLocaleDateString('en-US', options);
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 * @param {string} url - URL de Google Play
 * @returns {string|null} - ID de la app
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
 * @returns {Promise<Array>} - Array de apps añadidas
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
    const uniqueNewApps = newApps.filter(app => app && !existingAppsMap[app.id]);
    
    if (uniqueNewApps.length === 0) {
      console.log('No hay nuevas apps para añadir.');
      return [];
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
    return uniqueNewApps;
  } catch (error) {
    console.error('Error al actualizar el archivo apps.json:', error);
    return [];
  }
}

/**
 * Lee y procesa las URLs pendientes del archivo pending-apps.json
 */
async function processPendingApps() {
  try {
    // Ruta al archivo de URLs pendientes
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    // Leer el archivo actual
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    const { pendingUrls, processedUrls } = pendingAppsData;
    
    if (pendingUrls.length === 0) {
      console.log('No hay URLs pendientes para procesar.');
      return;
    }
    
    console.log(`Procesando ${pendingUrls.length} URLs pendientes...`);
    
    const newApps = [];
    const newProcessedUrls = [...processedUrls];
    const failedUrls = [];
    
    // Procesar cada URL pendiente
    for (const url of pendingUrls) {
      try {
        const appId = extractAppIdFromUrl(url);
        if (!appId) {
          console.error(`No se pudo extraer el ID de la app desde la URL: ${url}`);
          failedUrls.push(url);
          continue;
        }
        
        const appData = await getAppInfo(appId);
        if (appData) {
          newApps.push(appData);
          newProcessedUrls.push(url);
          console.log(`✓ Procesada app: ${appData.name}`);
        } else {
          failedUrls.push(url);
        }
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
        failedUrls.push(url);
      }
    }
    
    // Actualizar apps.json con las nuevas apps
    const addedApps = await updateAppsJson(newApps);
    
    // Actualizar pending-apps.json para mover las URLs procesadas
    const updatedPendingApps = {
      pendingUrls: failedUrls, // Las URLs que permanecen pendientes
      processedUrls: newProcessedUrls
    };
    
    fs.writeFileSync(
      pendingAppsPath,
      JSON.stringify(updatedPendingApps, null, 2),
      'utf8'
    );
    
    if (addedApps.length > 0) {
      console.log(`Proceso completado. Se añadieron ${addedApps.length} nuevas apps al catálogo.`);
      console.log('Apps añadidas:');
      addedApps.forEach(app => console.log(` - ${app.name}`));
    } else {
      console.log('No se añadieron nuevas apps al catálogo.');
    }
    
    if (failedUrls.length > 0) {
      console.log(`ATENCIÓN: ${failedUrls.length} URLs no pudieron ser procesadas y permanecen pendientes.`);
    }
  } catch (error) {
    console.error('Error procesando URLs pendientes:', error);
  }
}

// Ejecutar el script cuando se importa directamente
processPendingApps()
  .then(() => {
    console.log('Proceso de sincronización finalizado.');
  })
  .catch(error => {
    console.error('Error en el proceso de sincronización:', error);
  });