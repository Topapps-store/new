/**
 * Script para reconstruir el catálogo de apps desde las URLs en pending-apps.json
 * a apps_data.json en la raíz del proyecto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtiene información de una aplicación en Google Play Store
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

// Convierte un nombre de categoría a un ID amigable para URLs
function convertCategoryToId(category) {
  if (!category) return 'uncategorized';
  
  // Mapeo de categorías comunes
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

// Crea un ID amigable basado en el nombre de la app
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

// Formatea el conteo de instalaciones
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

// Formatea fecha
function formatDate(date) {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

// Extrae el ID de app de una URL de Google Play
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
    
    console.error(`No se pudo extraer el ID de la app desde la URL: ${url}`);
    return null;
  } catch (error) {
    console.error(`Error al extraer el ID desde la URL ${url}:`, error);
    return null;
  }
}

// Actualiza el archivo apps_data.json con los datos de nuevas apps
async function updateAppsDataJson(newApps) {
  try {
    if (newApps.length === 0) {
      console.log('No hay nuevas apps para añadir.');
      return [];
    }
    
    // Ruta al archivo apps_data.json en la raíz del proyecto
    const appsDataPath = path.join(__dirname, '../apps_data.json');
    
    // Leer archivo existente o crear array vacío
    let currentApps = [];
    if (fs.existsSync(appsDataPath)) {
      try {
        const appsContent = fs.readFileSync(appsDataPath, 'utf8');
        currentApps = JSON.parse(appsContent);
        
        if (!Array.isArray(currentApps)) {
          console.warn('apps_data.json no contiene un array, inicializando...');
          currentApps = [];
        }
      } catch (err) {
        console.error('Error al leer apps_data.json, creando nuevo archivo:', err);
        currentApps = [];
      }
    } else {
      console.log('Archivo apps_data.json no existe, se creará uno nuevo.');
    }
    
    const addedApps = [];
    const updatedApps = [];
    
    for (const newApp of newApps) {
      if (!newApp) continue;
      
      // Buscar si la app ya existe por ID o URL de Google Play
      const existingIndex = currentApps.findIndex(app => 
        app.id === newApp.id || 
        (app.google_play_url && newApp.google_play_url && 
         app.google_play_url === newApp.google_play_url)
      );
      
      if (existingIndex >= 0) {
        // App ya existe, actualizamos sus datos
        currentApps[existingIndex] = {
          ...currentApps[existingIndex],
          ...newApp,
          updated: newApp.updated || currentApps[existingIndex].updated
        };
        updatedApps.push(newApp);
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
    
    return { addedApps, updatedApps };
  } catch (error) {
    console.error('Error actualizando apps_data.json:', error);
    return { addedApps: [], updatedApps: [] };
  }
}

// Procesa las URLs pendientes del archivo pending-apps.json
async function rebuildAppCatalog() {
  try {
    // Ruta al archivo de URLs pendientes
    const pendingAppsPath = path.join(__dirname, '../client/src/data/pending-apps.json');
    
    // Leer el archivo
    const pendingAppsContent = fs.readFileSync(pendingAppsPath, 'utf8');
    const pendingAppsData = JSON.parse(pendingAppsContent);
    
    const { pendingUrls, processedUrls } = pendingAppsData;
    
    if (pendingUrls.length === 0) {
      console.log('No hay URLs pendientes para procesar.');
      return;
    }
    
    console.log(`Procesando ${pendingUrls.length} URLs...`);
    
    // Procesar las URLs en lotes más pequeños para evitar saturar la API
    const batchSize = 10;
    const totalBatches = Math.ceil(pendingUrls.length / batchSize);
    
    const newApps = [];
    const successfulUrls = [];
    const failedUrls = [];
    
    for (let i = 0; i < totalBatches; i++) {
      const batchStart = i * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, pendingUrls.length);
      const batchUrls = pendingUrls.slice(batchStart, batchEnd);
      
      console.log(`Procesando lote ${i + 1} de ${totalBatches}...`);
      
      for (const url of batchUrls) {
        try {
          const appId = extractAppIdFromUrl(url);
          if (!appId) {
            console.error(`No se pudo extraer el ID de app desde la URL: ${url}`);
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
        
        // Pequeña pausa entre solicitudes para evitar bloqueos de la API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Guardar los resultados parciales en cada lote para evitar pérdida de datos
      if (newApps.length > 0) {
        console.log(`Guardando resultados parciales del lote ${i + 1}...`);
        await updateAppsDataJson(newApps);
      }
      
      console.log(`Lote ${i + 1} completado. Procesadas ${batchUrls.length} URLs.`);
      
      // Actualizar pending-apps.json después de cada lote
      if (successfulUrls.length > 0) {
        const updatedPendingApps = {
          pendingUrls: pendingUrls.filter(url => !successfulUrls.includes(url)),
          processedUrls: [...processedUrls, ...successfulUrls]
        };
        
        fs.writeFileSync(
          pendingAppsPath,
          JSON.stringify(updatedPendingApps, null, 2),
          'utf8'
        );
        
        console.log(`Archivo pending-apps.json actualizado. Quedan ${updatedPendingApps.pendingUrls.length} URLs pendientes.`);
      }
      
      // Pausa entre lotes
      if (i < totalBatches - 1) {
        console.log('Esperando antes del siguiente lote...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Actualizar el catálogo con las apps procesadas
    const { addedApps, updatedApps } = await updateAppsDataJson(newApps);
    
    console.log(`Proceso completado. Se añadieron ${addedApps.length} nuevas apps y se actualizaron ${updatedApps.length}.`);
    
    if (failedUrls.length > 0) {
      console.log(`ATENCIÓN: ${failedUrls.length} URLs no pudieron ser procesadas y permanecen pendientes.`);
      
      // Actualizar pending-apps.json con los resultados finales
      const finalPendingApps = {
        pendingUrls: failedUrls,
        processedUrls: [...processedUrls, ...successfulUrls]
      };
      
      fs.writeFileSync(
        pendingAppsPath,
        JSON.stringify(finalPendingApps, null, 2),
        'utf8'
      );
    }
  } catch (error) {
    console.error('Error reconstruyendo el catálogo:', error);
  }
}

// Ejecutar el script
rebuildAppCatalog()
  .then(() => {
    console.log('Proceso de reconstrucción finalizado.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el proceso de reconstrucción:', error);
    process.exit(1);
  });