// Script para procesar todas las apps de Google Play
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processAllApps() {
  try {
    // Cargar las URLs desde pending-apps.json
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    // Combinar URLs pendientes y procesadas
    const allUrls = [...pendingAppsData.pendingUrls, ...pendingAppsData.processedUrls];
    
    // Cargar apps.json actual
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`Procesando ${allUrls.length} URLs de Google Play...`);
    
    // Crear un catálogo nuevo
    const newApps = [];
    const successfulUrls = [];
    const failedUrls = [];
    
    // Procesar cada URL
    for (const url of allUrls) {
      try {
        // Extraer el ID de la app
        const appId = extractAppIdFromUrl(url);
        if (!appId) {
          console.log(`No se pudo extraer el ID de la app desde la URL: ${url}`);
          failedUrls.push(url);
          continue;
        }
        
        console.log(`Procesando app con ID: ${appId}`);
        
        // Obtener datos de la app
        const appInfo = await gplay.app({ appId });
        
        // Crear objeto de app
        const appData = {
          id: createAppId(appInfo.title),
          name: appInfo.title,
          category: appInfo.genre,
          categoryId: convertCategoryToId(appInfo.genre),
          description: appInfo.description,
          iconUrl: appInfo.icon,
          rating: appInfo.score,
          downloads: formatDownloads(appInfo.installs),
          version: appInfo.version || "1.0.0",
          updated: "May 16, 2025", // Fecha fija para simplificar
          requires: `Android ${appInfo.androidVersion || "6.0"}+`,
          developer: appInfo.developer,
          installs: appInfo.installs || "1,000,000+",
          downloadUrl: appInfo.url,
          googlePlayUrl: appInfo.url,
          screenshots: appInfo.screenshots || [],
          isAffiliate: true
        };
        
        newApps.push(appData);
        successfulUrls.push(url);
        console.log(`✓ Procesada app: ${appData.name}`);
        
        // Simular un pequeño retraso para evitar bloqueos por demasiadas solicitudes
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
        failedUrls.push(url);
      }
    }
    
    // Actualizar el archivo apps.json con las nuevas apps
    if (newApps.length > 0) {
      // Limpiamos el catálogo y agregamos las nuevas apps
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
    
    console.log(`URLs procesadas correctamente: ${successfulUrls.length}`);
    console.log(`URLs con errores: ${failedUrls.length}`);
  } catch (error) {
    console.error('Error general al procesar las apps:', error);
  }
}

// Funciones auxiliares

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

function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

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

function convertCategoryToId(category) {
  if (!category) return "apps";
  
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

// Ejecutar la función principal
processAllApps().then(() => {
  console.log('Proceso completado.');
}).catch(error => {
  console.error('Error al ejecutar el script:', error);
});