/**
 * Script para recuperar las primeras 20 apps a partir de las URLs procesadas
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';

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
      size: appInfo.size,
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
 * Convierte un nombre de categoría a un ID amigable para URLs
 */
function convertCategoryToId(category) {
  if (!category) return 'uncategorized';
  
  // Mapa de categorías comunes
  const categoryMap = {
    'Social': 'social',
    'Comunicación': 'communication',
    'Communication': 'communication',
    'Productivity': 'productivity',
    'Productividad': 'productivity',
    'Tools': 'tools',
    'Herramientas': 'tools',
    'Entertainment': 'entertainment',
    'Entretenimiento': 'entertainment',
    'Video Players & Editors': 'video',
    'Photography': 'photography',
    'Fotografía': 'photography',
    'Music & Audio': 'music',
    'Música y audio': 'music',
    'Shopping': 'shopping',
    'Compras': 'shopping',
    'Finance': 'finance',
    'Finanzas': 'finance',
    'Travel & Local': 'travel',
    'Viajes y guías': 'travel',
    'Maps & Navigation': 'maps',
    'Mapas y navegación': 'maps',
    'Food & Drink': 'food',
    'Comida y bebida': 'food',
    'Health & Fitness': 'health',
    'Salud y bienestar': 'health',
    'Education': 'education',
    'Educación': 'education',
    'Business': 'business',
    'Negocios': 'business',
    'Lifestyle': 'lifestyle',
    'Estilo de vida': 'lifestyle'
  };
  
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  return category.toLowerCase()
    .replace(/[áäàâã]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòôõ]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Crea un ID amigable basado en el nombre de la app
 */
function createAppId(appName) {
  if (!appName) return 'app-' + Date.now();
  
  return appName.toLowerCase()
    .replace(/[áäàâã]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòôõ]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Formatea el conteo de instalaciones
 */
function formatDownloads(installs) {
  if (!installs) return 'N/A';
  
  const cleanNumber = installs.replace(/[+,]/g, '');
  const number = parseInt(cleanNumber, 10);
  
  if (isNaN(number)) return installs;
  
  if (number >= 1000000000) {
    return Math.floor(number / 1000000000) + 'B+';
  } else if (number >= 1000000) {
    return Math.floor(number / 1000000) + 'M+';
  } else if (number >= 1000) {
    return Math.floor(number / 1000) + 'K+';
  }
  
  return installs;
}

/**
 * Formatea una fecha al formato deseado
 */
function formatDate(date) {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 */
function extractAppIdFromUrl(url) {
  try {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error(`Error extrayendo ID de app desde URL ${url}:`, error);
    return null;
  }
}

/**
 * Actualiza el archivo apps.json con los datos de nuevas apps
 */
async function updateAppsJson(newApps) {
  try {
    if (newApps.length === 0) {
      return [];
    }
    
    const appsDataPath = path.join(__dirname, '../apps_data.json');
    
    let currentApps = [];
    if (fs.existsSync(appsDataPath)) {
      const appsContent = fs.readFileSync(appsDataPath, 'utf8');
      currentApps = JSON.parse(appsContent);
    }
    
    const addedApps = [];
    
    for (const newApp of newApps) {
      if (!newApp) continue;
      
      const existingIndex = currentApps.findIndex(app => 
        app.id === newApp.id || 
        (app.googlePlayUrl && app.googlePlayUrl.includes(newApp.googlePlayUrl))
      );
      
      if (existingIndex >= 0) {
        currentApps[existingIndex] = {
          ...currentApps[existingIndex],
          ...newApp,
          updated: newApp.updated || currentApps[existingIndex].updated
        };
        console.log(`App actualizada: ${newApp.name}`);
      } else {
        currentApps.push({
          ...newApp,
          created_at: new Date().toISOString(),
          ios_app_store_url: null,
          original_app_id: null,
          last_synced_at: null,
          category_name: newApp.category
        });
        addedApps.push(newApp);
        console.log(`Nueva app añadida: ${newApp.name}`);
      }
    }
    
    fs.writeFileSync(
      appsDataPath,
      JSON.stringify(currentApps, null, 2),
      'utf8'
    );
    
    return addedApps;
  } catch (error) {
    console.error('Error actualizando apps.json:', error);
    return [];
  }
}

/**
 * Recupera las primeras 20 apps
 */
async function recoverBatch1() {
  try {
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    const { processedUrls } = pendingAppsData;
    
    if (!processedUrls || processedUrls.length === 0) {
      console.log('No hay URLs procesadas para recuperar.');
      return;
    }
    
    // Tomar sólo las primeras 20 URLs
    const batchUrls = processedUrls.slice(0, 20);
    console.log(`Recuperando el primer lote de ${batchUrls.length} apps...`);
    
    const newApps = [];
    const failedUrls = [];
    
    for (const url of batchUrls) {
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
          console.log(`✓ Recuperada app: ${appData.name}`);
        } else {
          failedUrls.push(url);
        }
      } catch (error) {
        console.error(`Error recuperando la app desde URL ${url}:`, error);
        failedUrls.push(url);
      }
    }
    
    if (newApps.length > 0) {
      const addedApps = await updateAppsJson(newApps);
      console.log(`Lote 1 completado. Se procesaron ${newApps.length} apps y se añadieron/actualizaron ${addedApps.length}.`);
    } else {
      console.log('No se pudo recuperar ninguna app del primer lote correctamente.');
    }
  } catch (error) {
    console.error('Error en el proceso de recuperación del lote 1:', error);
  }
}

// Ejecutar la función principal
recoverBatch1();