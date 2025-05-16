import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtiene el ID de Google Play desde la propiedad googlePlayUrl
 * @param {string} url - URL de Google Play
 * @returns {string|null} - ID de la app o null si no se encuentra
 */
function extractGooglePlayId(url) {
  if (!url) return null;
  
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
    
    return null;
  } catch (error) {
    console.error(`Error extrayendo Google Play ID de ${url}:`, error);
    return null;
  }
}

/**
 * Obtiene información actualizada de una aplicación en Google Play Store
 * @param {string} googlePlayId - ID de la aplicación en Google Play
 * @returns {Promise<Object|null>} - Datos actualizados o null si hay error
 */
async function getUpdatedAppInfo(googlePlayId) {
  try {
    console.log(`Obteniendo información actualizada para: ${googlePlayId}`);
    
    // Obtener información básica de la app
    const appInfo = await gplay.app({ appId: googlePlayId });
    
    // Formatear los datos para actualizar
    return {
      name: appInfo.title,
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
      screenshots: appInfo.screenshots
    };
  } catch (error) {
    console.error(`Error al obtener información para ${googlePlayId}:`, error);
    return null;
  }
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
 * Actualiza las aplicaciones existentes con datos de Google Play Store
 */
async function syncExistingApps() {
  try {
    // Ruta al archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    
    // Leer el archivo actual
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    const totalApps = appsData.apps.length;
    console.log(`Sincronizando ${totalApps} aplicaciones existentes...`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Recorrer todas las apps y actualizar cada una
    for (let i = 0; i < appsData.apps.length; i++) {
      const app = appsData.apps[i];
      
      // Extraer el ID de Google Play
      const googlePlayId = extractGooglePlayId(app.googlePlayUrl);
      
      if (!googlePlayId) {
        console.log(`Omitiendo app ${app.name}: No se encontró ID de Google Play`);
        skippedCount++;
        continue;
      }
      
      try {
        // Obtener datos actualizados
        const updatedInfo = await getUpdatedAppInfo(googlePlayId);
        
        if (!updatedInfo) {
          console.log(`Error al obtener datos para ${app.name}, omitiendo...`);
          errorCount++;
          continue;
        }
        
        // Comprobar si hay cambios significativos
        const hasSignificantChanges = 
          updatedInfo.version !== app.version || 
          updatedInfo.rating !== app.rating || 
          updatedInfo.downloads !== app.downloads;
        
        // Actualizar la aplicación
        Object.assign(app, updatedInfo);
        
        if (hasSignificantChanges) {
          console.log(`✓ Actualizada app: ${app.name} (versión: ${app.version})`);
          updatedCount++;
        } else {
          console.log(`ℹ Sin cambios significativos para: ${app.name}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error procesando app ${app.name}:`, error);
        errorCount++;
      }
      
      // Pequeña pausa para no sobrecargar la API
      if (i < appsData.apps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Guardar los cambios en el archivo
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log(`
Sincronización completada:
- ${updatedCount} aplicaciones actualizadas
- ${skippedCount} aplicaciones sin cambios o omitidas
- ${errorCount} errores
    `);
  } catch (error) {
    console.error('Error al sincronizar aplicaciones existentes:', error);
  }
}

// Ejecutar la sincronización
syncExistingApps()
  .then(() => {
    console.log('Proceso de sincronización finalizado.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el proceso de sincronización:', error);
    process.exit(1);
  });