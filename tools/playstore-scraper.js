const fs = require('fs');
const path = require('path');
const gplay = require('google-play-scraper');

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
      downloadUrl: appInfo.url,
      googlePlayUrl: appInfo.url,
      screenshots: appInfo.screenshots,
      isAffiliate: false
    };
    
    return appData;
  } catch (error) {
    console.error(`Error al obtener información para ${googlePlayId}:`, error);
    throw error;
  }
}

/**
 * Convierte un nombre de categoría a un ID amigable para URLs
 * @param {string} category - Nombre de la categoría
 * @returns {string} - ID de la categoría
 */
function convertCategoryToId(category) {
  if (!category) return 'uncategorized';
  
  // Mapeo de categorías comunes
  const categoryMap = {
    'Entertainment': 'entertainment',
    'Communication': 'communication',
    'Shopping': 'shopping',
    'Social': 'social',
    'Finance': 'finance',
    'Food & Drink': 'food',
    'Music & Audio': 'music-and-audio',
    'Maps & Navigation': 'maps-and-navigation',
    'Travel & Local': 'travel',
    'Productivity': 'productivity',
    'Tools': 'utilities',
    'Utilities': 'utilities'
  };
  
  // Si existe en el mapeo, usar ese ID
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Sino, convertir el nombre de la categoría a un ID URL-friendly
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Crea un ID amigable basado en el nombre de la app
 * @param {string} appName - Nombre de la aplicación
 * @returns {string} - ID amigable para URLs
 */
function createAppId(appName) {
  if (!appName) return 'unknown-app';
  
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Formatea el conteo de instalaciones
 * @param {string} installs - Conteo de instalaciones (ej. "1,000,000,000+")
 * @returns {string} - Formato abreviado (ej. "1B+")
 */
function formatDownloads(installs) {
  if (!installs) return '0+';
  
  const num = parseInt(installs.replace(/[^0-9]/g, ''));
  
  if (num >= 1000000000) {
    return `${Math.floor(num / 1000000000)}B+`;
  } else if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  } else {
    return `${num}+`;
  }
}

/**
 * Formatea una fecha al formato deseado
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej. "May 10, 2023")
 */
function formatDate(date) {
  if (!date) return '';
  
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Actualiza el archivo apps.json con los datos de nuevas apps
 * @param {Array} newApps - Array de apps a añadir
 * @returns {Promise<void>}
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
    const uniqueNewApps = newApps.filter(app => !existingAppsMap[app.id]);
    
    if (uniqueNewApps.length === 0) {
      console.log('No hay nuevas apps para añadir.');
      return;
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
  } catch (error) {
    console.error('Error al actualizar el archivo apps.json:', error);
    throw error;
  }
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 * @param {string} url - URL de Google Play
 * @returns {string} - ID de la app
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
    throw error;
  }
}

/**
 * Función principal para procesar URLs de Google Play y añadirlas a apps.json
 * @param {Array<string>} urls - Array de URLs de Google Play
 * @returns {Promise<void>}
 */
async function processPlayStoreUrls(urls) {
  try {
    console.log(`Procesando ${urls.length} URLs de Google Play...`);
    
    const newApps = [];
    
    for (const url of urls) {
      try {
        const appId = extractAppIdFromUrl(url);
        const appData = await getAppInfo(appId);
        newApps.push(appData);
        console.log(`✓ Procesada app: ${appData.name}`);
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
      }
    }
    
    if (newApps.length > 0) {
      await updateAppsJson(newApps);
      console.log('Proceso completado exitosamente.');
    } else {
      console.log('No se pudo procesar ninguna app correctamente.');
    }
  } catch (error) {
    console.error('Error en el proceso:', error);
  }
}

// Si este script se ejecuta directamente (no importado)
if (require.main === module) {
  // Tomar las URLs desde los argumentos de línea de comandos
  const urls = process.argv.slice(2);
  
  if (urls.length === 0) {
    console.log('Uso: node playstore-scraper.js URL1 URL2 ...');
    console.log('Ejemplo: node playstore-scraper.js https://play.google.com/store/apps/details?id=com.spotify.music');
    process.exit(1);
  }
  
  processPlayStoreUrls(urls)
    .then(() => {
      console.log('Proceso finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = {
  getAppInfo,
  processPlayStoreUrls,
  extractAppIdFromUrl
};