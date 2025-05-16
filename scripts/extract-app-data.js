// Script para extraer información real de Google Play Store
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extrae el ID de la app desde una URL de Google Play
 */
function extractAppIdFromUrl(url) {
  try {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
    return null;
  } catch (error) {
    console.error('Error al extraer el ID desde la URL:', error);
    return null;
  }
}

/**
 * Crea un ID amigable a partir del nombre de la app
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formatea el número de descargas
 */
function formatDownloads(installs) {
  if (!installs) return "1M+";
  
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
 */
function formatDate(date) {
  if (!date) return "May 16, 2025";
  
  try {
    // Comprobar si date es una cadena o un objeto Date
    if (typeof date === 'string') {
      // Si es una cadena, devolver tal cual o formatear si es necesario
      return date;
    } else if (date instanceof Date) {
      // Si es un objeto Date, formatear
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    
    // Si no es ni string ni Date, devolver fecha actual formateada
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return "May 16, 2025"; // Fecha por defecto en caso de error
  }
}

/**
 * Convierte un nombre de categoría a un ID amigable
 */
function convertCategoryToId(category) {
  if (!category) return "apps";
  
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Obtiene información detallada de una app desde Google Play Store
 */
async function getAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información para: ${googlePlayId}`);
    
    // Usar la librería google-play-scraper para obtener los datos
    const appInfo = await gplay.app({ appId: googlePlayId });
    
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
      isAffiliate: true
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información para ${googlePlayId}:`, error);
    return null;
  }
}

/**
 * Procesa todas las URLs de Google Play
 */
async function processAllGooglePlayUrls() {
  try {
    // Cargar las URLs desde pending-apps.json
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    // Combinar las URLs pendientes y procesadas
    const allUrls = [...pendingAppsData.pendingUrls, ...pendingAppsData.processedUrls];
    
    // Cargar apps.json actual
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`Actualmente hay ${appsData.apps.length} apps en el catálogo.`);
    console.log(`Procesando ${allUrls.length} URLs...`);
    
    // Limpiar el catálogo actual y empezar desde cero
    appsData.apps = [];
    
    // Procesar cada URL
    const newApps = [];
    const successfulUrls = [];
    const failedUrls = [];
    
    for (const url of allUrls) {
      try {
        // Extraer ID de la app
        const appId = extractAppIdFromUrl(url);
        if (!appId) {
          console.log(`No se pudo extraer el ID de la app desde la URL: ${url}`);
          failedUrls.push(url);
          continue;
        }
        
        // Obtener datos de la app
        const appData = await getAppInfo(appId);
        
        if (appData) {
          newApps.push(appData);
          successfulUrls.push(url);
          console.log(`✓ Procesada app: ${appData.name}`);
        } else {
          failedUrls.push(url);
          console.log(`✗ Error procesando app con ID: ${appId}`);
        }
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
        failedUrls.push(url);
      }
    }
    
    // Actualizar el archivo apps.json con las nuevas apps
    if (newApps.length > 0) {
      appsData.apps = newApps;
      
      fs.writeFileSync(
        appsJsonPath,
        JSON.stringify(appsData, null, 2),
        'utf8'
      );
      
      console.log(`Se procesaron ${newApps.length} apps correctamente.`);
    } else {
      console.log('No se pudieron procesar apps correctamente.');
    }
    
    // Actualizar pending-apps.json
    const updatedPendingApps = {
      pendingUrls: failedUrls,
      processedUrls: successfulUrls
    };
    
    fs.writeFileSync(
      pendingAppsPath,
      JSON.stringify(updatedPendingApps, null, 2),
      'utf8'
    );
    
    console.log(`URLs procesadas: ${successfulUrls.length}`);
    console.log(`URLs fallidas: ${failedUrls.length}`);
    
  } catch (error) {
    console.error('Error al procesar las URLs de Google Play:', error);
  }
}

// Ejecutar el proceso
processAllGooglePlayUrls().catch(error => {
  console.error('Error al ejecutar el script:', error);
});