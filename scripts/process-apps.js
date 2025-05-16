// Script para procesar todas las URLs pendientes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene información de una aplicación en Google Play Store
 */
async function getAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información para: ${googlePlayId}`);
    
    // Obtener información básica de la app
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
 */
function convertCategoryToId(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Crea un ID amigable basado en el nombre de la app
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formatea el conteo de instalaciones
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
 */
function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 */
function extractAppIdFromUrl(url) {
  try {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
    
    const pathMatch = url.match(/details\/([^?]+)/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error al extraer el ID desde la URL:', error);
    return null;
  }
}

/**
 * Actualiza el archivo apps.json con los datos de nuevas apps
 */
async function updateAppsJson(newApps) {
  try {
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    const existingAppsMap = {};
    appsData.apps.forEach(app => {
      existingAppsMap[app.id] = true;
    });
    
    const uniqueNewApps = newApps.filter(app => !existingAppsMap[app.id]);
    
    if (uniqueNewApps.length === 0) {
      console.log('No hay nuevas apps para añadir.');
      return [];
    }
    
    appsData.apps = [...appsData.apps, ...uniqueNewApps];
    
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
 * Actualiza el archivo pending-apps.json para mover URLs de pendientes a procesadas
 */
function updatePendingAppsJson(processedUrls, failedUrls) {
  try {
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    // Añadir las URLs procesadas a processedUrls
    const allProcessedUrls = [...pendingAppsData.processedUrls, ...processedUrls];
    
    // Actualizar con las URLs que fallaron (si hay alguna)
    const updatedPendingApps = {
      pendingUrls: failedUrls,
      processedUrls: allProcessedUrls
    };
    
    fs.writeFileSync(
      pendingAppsPath,
      JSON.stringify(updatedPendingApps, null, 2),
      'utf8'
    );
    
    console.log(`Se actualizó pending-apps.json: ${processedUrls.length} URLs procesadas, ${failedUrls.length} URLs fallidas`);
  } catch (error) {
    console.error('Error al actualizar el archivo pending-apps.json:', error);
  }
}

/**
 * Procesa las URLs pendientes y actualiza los archivos
 */
async function processPendingApps() {
  try {
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    const { pendingUrls } = pendingAppsData;
    
    if (pendingUrls.length === 0) {
      console.log('No hay URLs pendientes para procesar.');
      return;
    }
    
    console.log(`Procesando ${pendingUrls.length} URLs pendientes...`);
    
    const newApps = [];
    const successfulUrls = [];
    const failedUrls = [];
    
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
          successfulUrls.push(url);
          console.log(`✓ Procesada app: ${appData.name}`);
        } else {
          failedUrls.push(url);
        }
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
        failedUrls.push(url);
      }
    }
    
    if (newApps.length > 0) {
      const addedApps = await updateAppsJson(newApps);
      updatePendingAppsJson(successfulUrls, failedUrls);
      
      if (addedApps.length > 0) {
        console.log(`Proceso completado. Se añadieron ${addedApps.length} nuevas apps al catálogo.`);
        console.log('Apps añadidas:');
        addedApps.forEach(app => console.log(` - ${app.name}`));
      } else {
        console.log('Las apps ya existían en el catálogo, no se añadieron nuevas.');
      }
    } else {
      console.log('No se pudo procesar ninguna app correctamente.');
    }
    
    if (failedUrls.length > 0) {
      console.log(`ATENCIÓN: ${failedUrls.length} URLs no pudieron ser procesadas y permanecen pendientes.`);
      console.log('URLs fallidas:');
      failedUrls.forEach(url => console.log(` - ${url}`));
    }
  } catch (error) {
    console.error('Error procesando apps pendientes:', error);
  }
}

// Ejecutar el proceso
processPendingApps().catch(error => {
  console.error('Error al ejecutar el procesamiento:', error);
});