/**
 * Script para procesar las URLs pendientes y añadir las aplicaciones a apps.json
 * Este script lee las URLs pendientes de pending-apps.json y las procesa
 * para obtener información de Google Play y añadirlas al catálogo
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Detecta el idioma desde una URL de App Store
 * @param {string} url - URL del App Store
 * @returns {string} - Código de idioma (ej. 'fr', 'es', 'en')
 */
function detectLanguageFromUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Para App Store URLs: apps.apple.com/[locale]/app/...
    if (urlObj.hostname === 'apps.apple.com') {
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 2 && pathParts[1] !== 'app') {
        return pathParts[1]; // Retorna el código de idioma (fr, es, de, etc.)
      }
    }
    
    // Para Google Play URLs: play.google.com/store/apps/details?hl=[locale]
    if (urlObj.hostname === 'play.google.com') {
      const hlParam = urlObj.searchParams.get('hl');
      if (hlParam) {
        return hlParam;
      }
    }
    
    return 'en'; // Por defecto inglés
  } catch (error) {
    console.warn('Error detectando idioma desde URL:', error);
    return 'en';
  }
}

/**
 * Obtiene información de una aplicación desde App Store en el idioma específico
 * @param {string} appStoreId - ID de la aplicación en App Store
 * @param {string} language - Código de idioma (ej. 'fr', 'es')
 * @returns {Promise<Object>} - Datos de la aplicación
 */
async function getAppStoreInfo(appStoreId, language = 'en') {
  try {
    console.log(`Obteniendo información de App Store para: ${appStoreId} en idioma: ${language}`);
    
    // Obtener información básica de la app
    const appInfo = await store.app({ 
      id: appStoreId,
      country: getCountryFromLanguage(language)
    });
    
    // Formatear los datos para nuestro formato JSON
    const appData = {
      id: createAppId(appInfo.title),
      name: appInfo.title,
      category: appInfo.genres?.[0] || 'Utilities',
      categoryId: convertCategoryToId(appInfo.genres?.[0] || 'Utilities'),
      description: appInfo.description,
      iconUrl: appInfo.icon,
      rating: appInfo.score || 4.0,
      downloads: '1M+', // App Store no proporciona descargas exactas
      version: appInfo.version,
      updated: formatDate(appInfo.updated),
      requires: `iOS ${appInfo.requiredOsVersion}+`,
      developer: appInfo.developer,
      installs: '1,000,000+',
      downloadUrl: appInfo.url,
      googlePlayUrl: appInfo.url,
      appStoreUrl: appInfo.url,
      screenshots: appInfo.screenshots,
      isAffiliate: false,
      originalLanguage: language
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información de App Store para ${appStoreId}:`, error);
    return null;
  }
}

/**
 * Obtiene información de una aplicación en Google Play Store con idioma específico
 * @param {string} googlePlayId - ID de la aplicación en Google Play (ej. com.whatsapp)
 * @param {string} language - Código de idioma
 * @returns {Promise<Object>} - Datos de la aplicación
 */
async function getGooglePlayInfo(googlePlayId, language = 'en') {
  try {
    console.log(`Obteniendo información de Google Play para: ${googlePlayId} en idioma: ${language}`);
    
    // Obtener información básica de la app
    const appInfo = await gplay.app({ 
      appId: googlePlayId,
      lang: language,
      country: getCountryFromLanguage(language)
    });
    
    // Formatear los datos para nuestro formato JSON
    const appData = {
      id: createAppId(appInfo.title),
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
      downloadUrl: appInfo.url,
      googlePlayUrl: appInfo.url,
      screenshots: appInfo.screenshots,
      isAffiliate: false,
      originalLanguage: language
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información de Google Play para ${googlePlayId}:`, error);
    return null;
  }
}

/**
 * Función principal para obtener información de app (App Store o Google Play)
 * @param {string} url - URL completa de la app
 * @returns {Promise<Object>} - Datos de la aplicación
 */
async function getAppInfo(url) {
  try {
    const language = detectLanguageFromUrl(url);
    console.log(`Detectado idioma: ${language} desde URL: ${url}`);
    
    if (url.includes('apps.apple.com')) {
      // Es una URL de App Store
      const appId = extractAppStoreIdFromUrl(url);
      if (!appId) {
        throw new Error('No se pudo extraer el ID de App Store');
      }
      return await getAppStoreInfo(appId, language);
    } else if (url.includes('play.google.com')) {
      // Es una URL de Google Play
      const appId = extractGooglePlayIdFromUrl(url);
      if (!appId) {
        throw new Error('No se pudo extraer el ID de Google Play');
      }
      return await getGooglePlayInfo(appId, language);
    } else {
      throw new Error('URL no soportada. Solo se admiten URLs de App Store y Google Play');
    }
  } catch (error) {
    console.error(`Error al obtener información de la app:`, error);
    return null;
  }
}

/**
 * Mapea códigos de idioma a códigos de país
 * @param {string} language - Código de idioma
 * @returns {string} - Código de país
 */
function getCountryFromLanguage(language) {
  const languageCountryMap = {
    'fr': 'fr',
    'es': 'es', 
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'nl': 'nl',
    'sv': 'se',
    'da': 'dk',
    'fi': 'fi',
    'no': 'no',
    'pl': 'pl',
    'ru': 'ru',
    'ja': 'jp',
    'ko': 'kr',
    'zh': 'cn',
    'ar': 'sa',
    'hi': 'in',
    'tr': 'tr',
    'ro': 'ro',
    'hu': 'hu',
    'en': 'us'
  };
  
  return languageCountryMap[language] || 'us';
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
 * Extrae el ID de App Store desde una URL
 * @param {string} url - URL de App Store
 * @returns {string|null} - ID de la app
 */
function extractAppStoreIdFromUrl(url) {
  try {
    // Patrones para URLs de App Store: 
    // https://apps.apple.com/fr/app/taptap-send-transfert-dargent/id1413346006?mt=8
    const idMatch = url.match(/\/id(\d+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
    
    throw new Error('No se pudo extraer el ID de App Store desde la URL');
  } catch (error) {
    console.error('Error al extraer el ID de App Store desde la URL:', error);
    return null;
  }
}

/**
 * Extrae el ID de Google Play desde una URL
 * @param {string} url - URL de Google Play
 * @returns {string|null} - ID de la app
 */
function extractGooglePlayIdFromUrl(url) {
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
    
    throw new Error('No se pudo extraer el ID de Google Play desde la URL');
  } catch (error) {
    console.error('Error al extraer el ID de Google Play desde la URL:', error);
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
        console.log(`Procesando URL: ${url}`);
        
        const appData = await getAppInfo(url);
        if (appData) {
          newApps.push(appData);
          newProcessedUrls.push(url);
          console.log(`✓ Procesada app: ${appData.name} (Idioma: ${appData.originalLanguage || 'en'})`);
        } else {
          console.error(`No se pudo obtener información para la URL: ${url}`);
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