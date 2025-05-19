/**
 * Script para recuperar todas las apps a partir de las URLs procesadas
 * Este script lee las URLs procesadas de pending-apps.json y las vuelve a añadir
 * al catálogo de aplicaciones en apps.json
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
      size: appInfo.size,
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
    'Estilo de vida': 'lifestyle',
    'Books & Reference': 'books',
    'Libros y obras de consulta': 'books',
    'News & Magazines': 'news',
    'Noticias y revistas': 'news',
    'Weather': 'weather',
    'El tiempo': 'weather',
    'Sports': 'sports',
    'Deportes': 'sports',
    'Dating': 'dating',
    'Citas': 'dating',
    'Games': 'games',
    'Juegos': 'games',
    'Casino': 'casino',
    'Action': 'action',
    'Acción': 'action',
    'Adventure': 'adventure',
    'Aventura': 'adventure',
    'Arcade': 'arcade',
    'Board': 'board',
    'Mesa': 'board',
    'Card': 'card',
    'Cartas': 'card',
    'Casual': 'casual',
    'Educational': 'educational',
    'Educativos': 'educational',
    'Music': 'music-games',
    'Música': 'music-games',
    'Puzzle': 'puzzle',
    'Puzles': 'puzzle',
    'Racing': 'racing',
    'Carreras': 'racing',
    'Role Playing': 'rpg',
    'Rol': 'rpg',
    'Simulation': 'simulation',
    'Simulación': 'simulation',
    'Sports Games': 'sports-games',
    'Juegos deportivos': 'sports-games',
    'Strategy': 'strategy',
    'Estrategia': 'strategy',
    'Trivia': 'trivia',
    'Preguntas': 'trivia',
    'Word': 'word',
    'Palabras': 'word'
  };
  
  // Si existe en el mapa, devolvemos el ID correspondiente
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Si no existe en el mapa, lo convertimos a minúsculas y quitamos caracteres especiales
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
 * @param {string} appName - Nombre de la aplicación
 * @returns {string} - ID amigable para URLs
 */
function createAppId(appName) {
  if (!appName) return 'app-' + Date.now();
  
  // Convertimos a minúsculas y quitamos caracteres especiales
  return appName.toLowerCase()
    .replace(/[áäàâã]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòôõ]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50); // Limitamos a 50 caracteres
}

/**
 * Formatea el conteo de instalaciones
 * @param {string} installs - Conteo de instalaciones (ej. "1,000,000,000+")
 * @returns {string} - Formato abreviado (ej. "1B+")
 */
function formatDownloads(installs) {
  if (!installs) return 'N/A';
  
  // Quitamos el + y los separadores de miles
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
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej. "May 10, 2023")
 */
function formatDate(date) {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 * @param {string} url - URL de Google Play
 * @returns {string|null} - ID de la app
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
 * @param {Array} newApps - Array de apps a añadir
 * @returns {Promise<Array>} - Array de apps añadidas
 */
async function updateAppsJson(newApps) {
  try {
    if (newApps.length === 0) {
      return [];
    }
    
    // Ruta al archivo de apps
    const appsDataPath = path.join(__dirname, '../apps_data.json');
    
    // Leer el archivo actual si existe
    let currentApps = [];
    if (fs.existsSync(appsDataPath)) {
      const appsContent = fs.readFileSync(appsDataPath, 'utf8');
      currentApps = JSON.parse(appsContent);
    }
    
    // Verificar si alguna app ya existe (por ID)
    const addedApps = [];
    
    for (const newApp of newApps) {
      if (!newApp) continue;
      
      // Verificar si la app ya existe
      const existingIndex = currentApps.findIndex(app => 
        app.id === newApp.id || 
        (app.googlePlayUrl && app.googlePlayUrl.includes(newApp.googlePlayUrl))
      );
      
      if (existingIndex >= 0) {
        // Si la app ya existe, actualizamos sus datos
        currentApps[existingIndex] = {
          ...currentApps[existingIndex],
          ...newApp,
          updated: newApp.updated || currentApps[existingIndex].updated
        };
        console.log(`App actualizada: ${newApp.name}`);
      } else {
        // Si la app no existe, la añadimos
        currentApps.push({
          ...newApp,
          created_at: new Date().toISOString(),
          ios_app_store_url: null,
          original_app_id: null,
          last_synced_at: null
        });
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
    console.error('Error actualizando apps.json:', error);
    return [];
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
    
    if (!processedUrls || processedUrls.length === 0) {
      console.log('No hay URLs procesadas para recuperar.');
      return;
    }
    
    console.log(`Recuperando ${processedUrls.length} apps desde URLs procesadas...`);
    
    const newApps = [];
    const failedUrls = [];
    
    // Procesar cada URL que ya fue procesada previamente
    for (const url of processedUrls) {
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
      // Actualizar apps.json con las apps recuperadas
      const addedApps = await updateAppsJson(newApps);
      console.log(`Recuperación completada. Se procesaron ${newApps.length} apps y se añadieron/actualizaron ${addedApps.length}.`);
    } else {
      console.log('No se pudo recuperar ninguna app correctamente.');
    }
  } catch (error) {
    console.error('Error en el proceso de recuperación:', error);
  }
}

// Ejecutar la función principal
recoverAllApps();