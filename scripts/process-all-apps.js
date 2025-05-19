/**
 * Script para procesar todas las apps pendientes y procesadas
 * y añadirlas al catálogo de apps_data.json
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener información de una app de Google Play
async function getAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información para: ${googlePlayId}`);
    
    // Obtener información básica de la app
    const appInfo = await gplay.app({ appId: googlePlayId });
    
    // Formatear los datos para nuestro formato JSON
    const appData = {
      id: createAppId(appInfo.title),
      name: appInfo.title,
      category_id: convertCategoryToId(appInfo.genre),
      description: appInfo.description,
      icon_url: appInfo.icon,
      rating: appInfo.score,
      downloads: formatDownloads(appInfo.installs),
      version: appInfo.version || "Varies",
      size: appInfo.size || "Varies",
      updated: formatDate(appInfo.updated),
      requires: `Android ${appInfo.androidVersion}+`,
      developer: appInfo.developer,
      installs: appInfo.installs,
      download_url: `https://topapps.store/download/${createAppId(appInfo.title)}`,
      google_play_url: appInfo.url,
      screenshots: appInfo.screenshots || [],
      is_affiliate: true,
      created_at: new Date().toISOString(),
      ios_app_store_url: null,
      original_app_id: null,
      last_synced_at: null,
      category_name: appInfo.genre
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información para ${googlePlayId}:`, error);
    return null;
  }
}

// Función para convertir nombre de categoría a ID
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
    'Educación': 'education'
  };
  
  // Si existe en el mapa, usamos el ID predefinido
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Si no, creamos un ID a partir del nombre
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

// Función para crear un ID amigable para la app
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

// Función para formatear el conteo de descargas
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

// Función para formatear fecha
function formatDate(date) {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

// Función para extraer ID de Google Play de una URL
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

// Función para actualizar el archivo apps_data.json
async function updateAppsJson(newApps) {
  try {
    if (newApps.length === 0) {
      return [];
    }
    
    const appsDataPath = path.join(__dirname, '../apps_data.json');
    
    // Leer archivo existente o crear un array vacío
    let currentApps = [];
    if (fs.existsSync(appsDataPath)) {
      try {
        const appsContent = fs.readFileSync(appsDataPath, 'utf8');
        currentApps = JSON.parse(appsContent);
      } catch (err) {
        console.error('Error al leer apps_data.json, creando nuevo archivo:', err);
        currentApps = [];
      }
    }
    
    if (!Array.isArray(currentApps)) {
      console.warn('apps_data.json no contiene un array, inicializando...');
      currentApps = [];
    }
    
    const addedApps = [];
    
    for (const newApp of newApps) {
      if (!newApp) continue;
      
      // Buscar si la app ya existe
      const existingIndex = currentApps.findIndex(app => 
        app.id === newApp.id || 
        (app.google_play_url && newApp.google_play_url && 
         app.google_play_url.includes(extractAppIdFromUrl(newApp.google_play_url)))
      );
      
      if (existingIndex >= 0) {
        // App ya existe, actualizamos sus datos
        currentApps[existingIndex] = {
          ...currentApps[existingIndex],
          ...newApp,
          updated: newApp.updated || currentApps[existingIndex].updated
        };
        console.log(`App actualizada: ${newApp.name}`);
      } else {
        // App nueva, la añadimos
        currentApps.push(newApp);
        addedApps.push(newApp);
        console.log(`Nueva app añadida: ${newApp.name}`);
      }
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync(
      appsDataPath,
      JSON.stringify(currentApps, null, 2),
      'utf8'
    );
    
    return addedApps;
  } catch (error) {
    console.error('Error actualizando apps_data.json:', error);
    return [];
  }
}

// Función principal para procesar todas las apps
async function processAllApps() {
  try {
    // Ruta al archivo pending-apps.json
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    // Leer el archivo
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    // Obtener todas las URLs (pendientes y procesadas)
    const allUrls = [
      ...(pendingAppsData.pendingUrls || []),
      ...(pendingAppsData.processedUrls || [])
    ];
    
    if (allUrls.length === 0) {
      console.log('No hay URLs para procesar.');
      return;
    }
    
    console.log(`Procesando un total de ${allUrls.length} URLs...`);
    
    // Procesar URLs en lotes para evitar sobrecarga
    const batchSize = 10;
    const totalBatches = Math.ceil(allUrls.length / batchSize);
    
    let processedApps = 0;
    let successfulApps = 0;
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, allUrls.length);
      const batchUrls = allUrls.slice(start, end);
      
      console.log(`Procesando lote ${i + 1}/${totalBatches}...`);
      
      const batchPromises = batchUrls.map(async (url) => {
        try {
          const appId = extractAppIdFromUrl(url);
          if (!appId) {
            console.error(`No se pudo extraer el ID de app desde la URL: ${url}`);
            return null;
          }
          
          const appData = await getAppInfo(appId);
          if (appData) {
            return appData;
          }
          return null;
        } catch (error) {
          console.error(`Error procesando URL ${url}:`, error);
          return null;
        }
      });
      
      // Esperar a que se completen todas las promesas del lote
      const batchResults = await Promise.all(batchPromises);
      const validApps = batchResults.filter(app => app !== null);
      
      // Actualizar el catálogo con las apps del lote
      const addedApps = await updateAppsJson(validApps);
      
      processedApps += batchUrls.length;
      successfulApps += validApps.length;
      
      console.log(`Lote ${i + 1} completado. Procesadas ${batchUrls.length} URLs, obtenidas ${validApps.length} apps.`);
      console.log(`Progreso: ${processedApps}/${allUrls.length} (${Math.round(processedApps/allUrls.length*100)}%)`);
      
      // Esperar un poco entre lotes para evitar rate limiting
      if (i < totalBatches - 1) {
        console.log('Esperando antes del siguiente lote...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`Proceso completado. Se procesaron ${allUrls.length} URLs y se obtuvieron ${successfulApps} apps válidas.`);
    
    // Actualizar pending-apps.json para marcar todas las URLs como procesadas
    const updatedPendingApps = {
      pendingUrls: [],
      processedUrls: allUrls
    };
    
    fs.writeFileSync(
      pendingAppsPath,
      JSON.stringify(updatedPendingApps, null, 2),
      'utf8'
    );
    
    console.log('Archivo pending-apps.json actualizado.');
  } catch (error) {
    console.error('Error en el proceso:', error);
  }
}

// Ejecutar la función principal
processAllApps();