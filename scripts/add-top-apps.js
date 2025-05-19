/**
 * Script para añadir solo las apps más populares al catálogo
 * Este enfoque es más rápido que procesar todas las apps
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de IDs de apps populares que queremos añadir
const popularApps = [
  'com.ubercab',
  'com.ubercab.eats',
  'com.whatsapp',
  'com.facebook.katana',
  'com.instagram.android',
  'com.spotify.music',
  'com.netflix.mediaclient',
  'com.amazon.mShop.android.shopping',
  'com.google.android.youtube',
  'com.waze',
  'com.duolingo',
  'com.discord',
  'com.tinder',
  'com.twitter.android',
  'com.openai.chatgpt'
];

// Función para obtener información de una app
async function getAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información para: ${googlePlayId}`);
    
    // Obtener info básica de la app
    const appInfo = await gplay.app({ appId: googlePlayId });
    
    // Formatear los datos
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
  const categoryMap = {
    'Social': 'social',
    'Comunicación': 'communication',
    'Communication': 'communication',
    'Productivity': 'productivity',
    'Entertainment': 'entertainment',
    'Music & Audio': 'music',
    'Shopping': 'shopping',
    'Finance': 'finance',
    'Travel & Local': 'travel',
    'Maps & Navigation': 'maps',
    'Food & Drink': 'food',
    'Education': 'education'
  };
  
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  return category?.toLowerCase()
    .replace(/[áäàâã]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòôõ]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'uncategorized';
}

// Función para crear ID de app
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

// Función para formatear descargas
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

// Actualizar archivo de apps
async function updateAppsJson(newApps) {
  try {
    if (newApps.length === 0) {
      return [];
    }
    
    const appsDataPath = path.join(__dirname, '../apps_data.json');
    
    // Leer archivo o crear array vacío
    let currentApps = [];
    if (fs.existsSync(appsDataPath)) {
      try {
        const appsContent = fs.readFileSync(appsDataPath, 'utf8');
        currentApps = JSON.parse(appsContent);
      } catch (err) {
        console.error('Error al leer archivo, creando nuevo:', err);
        currentApps = [];
      }
    }
    
    if (!Array.isArray(currentApps)) {
      console.warn('El archivo no contiene un array, inicializando...');
      currentApps = [];
    }
    
    const addedApps = [];
    
    for (const newApp of newApps) {
      if (!newApp) continue;
      
      // Buscar si la app ya existe
      const existingIndex = currentApps.findIndex(app => 
        app.id === newApp.id || 
        (app.google_play_url && newApp.google_play_url && 
         app.google_play_url.includes(newApp.id))
      );
      
      if (existingIndex >= 0) {
        // App ya existe, actualizamos
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
    
    // Guardar archivo
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

// Función principal
async function addTopApps() {
  try {
    console.log(`Añadiendo ${popularApps.length} apps populares al catálogo...`);
    
    const appsData = [];
    
    // Procesar cada app
    for (const appId of popularApps) {
      try {
        const appData = await getAppInfo(appId);
        if (appData) {
          appsData.push(appData);
        }
      } catch (error) {
        console.error(`Error procesando ${appId}:`, error);
      }
      
      // Pequeña pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Actualizar catálogo
    const addedApps = await updateAppsJson(appsData);
    
    console.log(`Proceso completado. Se procesaron ${popularApps.length} apps y se añadieron/actualizaron ${addedApps.length}.`);
  } catch (error) {
    console.error('Error en el proceso:', error);
  }
}

// Ejecutar la función principal
addTopApps();