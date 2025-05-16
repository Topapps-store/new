/**
 * Script para procesar URLs pendientes desde pending-apps.json
 * y añadirlas al archivo apps.json con información completa
 */
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
    // Obtener información detallada de la app
    const appInfo = await gplay.app({ appId: googlePlayId, lang: 'es' });
    
    // Retornar datos formateados
    return {
      name: appInfo.title,
      description: appInfo.summary || appInfo.description,
      icon: appInfo.icon,
      googlePlayUrl: appInfo.url,
      rating: appInfo.score,
      developer: appInfo.developer,
      downloads: formatDownloads(appInfo.installs),
      version: appInfo.version,
      size: appInfo.size,
      updated: formatDate(new Date(appInfo.updated)),
      screenshots: appInfo.screenshots.slice(0, 5), // Limitar a 5 screenshots
      contentRating: appInfo.contentRating,
      releaseNotes: appInfo.recentChanges,
    };
  } catch (error) {
    console.error(`Error obteniendo información de ${googlePlayId}:`, error.message);
    throw error;
  }
}

/**
 * Convierte un nombre de categoría a un ID amigable para URLs
 * @param {string} category - Nombre de la categoría
 * @returns {string} - ID de la categoría
 */
function convertCategoryToId(category) {
  // Normalizar el nombre (quitar acentos, convertir a minúsculas, etc.)
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Crea un ID amigable basado en el nombre de la app
 * @param {string} appName - Nombre de la aplicación
 * @returns {string} - ID amigable para URLs
 */
function createAppId(appName) {
  // Normalizar el nombre (quitar acentos, convertir a minúsculas, etc.)
  return appName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Formatea el conteo de instalaciones
 * @param {string} installs - Conteo de instalaciones (ej. "1,000,000,000+")
 * @returns {string} - Formato abreviado (ej. "1B+")
 */
function formatDownloads(installs) {
  if (!installs) return "Desconocido";
  
  const num = parseInt(installs.replace(/[^0-9]/g, ""));
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B+";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  
  return num.toString() + "+";
}

/**
 * Formatea una fecha al formato deseado
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej. "May 10, 2023")
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Actualiza el archivo apps.json con los datos de nuevas apps
 * @param {Array} newApps - Array de apps a añadir
 * @returns {Promise<void>}
 */
async function updateAppsJson(newApps) {
  try {
    // Leer el archivo de apps existente
    const appsFilePath = path.join(__dirname, '../client/src/data/apps.json');
    let existingApps = [];
    
    try {
      const appsData = fs.readFileSync(appsFilePath, 'utf8');
      existingApps = JSON.parse(appsData);
    } catch (error) {
      console.log('No se encontró archivo de apps existente o está vacío. Creando nuevo archivo.');
    }
    
    // Combinar apps existentes con nuevas apps
    for (const app of newApps) {
      // Verificar si la app ya existe (por ID o por URL de Google Play)
      const existingIndex = existingApps.findIndex(
        a => a.id === app.id || 
             (a.googlePlayUrl && app.googlePlayUrl && a.googlePlayUrl === app.googlePlayUrl)
      );
      
      if (existingIndex >= 0) {
        // Actualizar app existente
        existingApps[existingIndex] = {
          ...existingApps[existingIndex],
          ...app,
          updatedAt: new Date().toISOString()
        };
        console.log(`Actualizada app existente: ${app.name}`);
      } else {
        // Añadir nueva app
        existingApps.push({
          ...app,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`Añadida nueva app: ${app.name}`);
      }
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync(appsFilePath, JSON.stringify(existingApps, null, 2), 'utf8');
    console.log(`Archivo de apps actualizado con ${newApps.length} nuevas apps`);
  } catch (error) {
    console.error('Error actualizando archivo de apps:', error);
  }
}

/**
 * Procesa una URL de Google Play para extraer el ID de la app
 * @param {string} url - URL de Google Play
 * @returns {string} - ID de la app
 */
function extractAppIdFromUrl(url) {
  // Ejemplos de URLs de Google Play:
  // https://play.google.com/store/apps/details?id=com.whatsapp
  // https://play.google.com/store/apps/details?id=com.facebook.katana&hl=es
  
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const appId = params.get('id');
    
    if (!appId) {
      throw new Error('No se pudo extraer el ID de la app de la URL');
    }
    
    return appId;
  } catch (error) {
    console.error(`Error procesando URL ${url}:`, error.message);
    return null;
  }
}

/**
 * Lee y procesa las URLs pendientes del archivo pending-apps.json
 */
async function processPendingApps() {
  try {
    console.log('Iniciando procesamiento de apps pendientes...');
    
    // Leer el archivo de apps pendientes
    const pendingAppsFilePath = path.join(__dirname, '../client/src/data/pending-apps.json');
    let pendingUrls = [];
    
    try {
      const pendingData = fs.readFileSync(pendingAppsFilePath, 'utf8');
      pendingUrls = JSON.parse(pendingData);
    } catch (error) {
      console.log('No se encontró archivo de apps pendientes o está vacío.');
      return;
    }
    
    if (!pendingUrls.length) {
      console.log('No hay apps pendientes para procesar.');
      return;
    }
    
    console.log(`Procesando ${pendingUrls.length} app(s) pendiente(s)...`);
    
    // Verificar y leer categorías existentes
    const categoriesPath = path.join(__dirname, '../client/src/data/categories.json');
    let categories = [];
    
    try {
      const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
      categories = JSON.parse(categoriesData);
    } catch (error) {
      console.log('No se encontró archivo de categorías o está vacío. Creando nuevo archivo.');
      fs.writeFileSync(categoriesPath, JSON.stringify([], null, 2), 'utf8');
    }
    
    // Procesar cada URL
    const newApps = [];
    
    for (const url of pendingUrls) {
      try {
        // Extraer el ID de la app de la URL
        const appId = extractAppIdFromUrl(url);
        
        if (!appId) {
          console.error(`URL inválida, omitiendo: ${url}`);
          continue;
        }
        
        // Obtener información de la app
        console.log(`Procesando app: ${appId}`);
        const appInfo = await getAppInfo(appId);
        
        // Crear un ID amigable para la app
        const friendlyId = createAppId(appInfo.name);
        
        // Verificar si la categoría existe o crearla
        let categoryId = 'otras';
        
        // Si se obtiene una nueva app, agregarla a la lista
        newApps.push({
          id: friendlyId,
          ...appInfo,
          categoryId
        });
        
        console.log(`App procesada: ${appInfo.name}`);
      } catch (error) {
        console.error(`Error procesando URL: ${url}`, error.message);
      }
    }
    
    // Actualizar el archivo apps.json con las nuevas apps
    await updateAppsJson(newApps);
    
    // Limpiar el archivo de apps pendientes
    fs.writeFileSync(pendingAppsFilePath, JSON.stringify([], null, 2), 'utf8');
    console.log('Archivo de apps pendientes limpiado.');
    
    console.log('Procesamiento de apps pendientes completado.');
  } catch (error) {
    console.error('Error en procesamiento de apps pendientes:', error);
  }
}

// Ejecutar la función principal
processPendingApps();