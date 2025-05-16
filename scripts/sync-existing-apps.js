/**
 * Script para sincronizar aplicaciones existentes con datos actualizados de Google Play Store
 * 
 * Este script lee el archivo apps.json, verifica si hay actualizaciones disponibles
 * para cada aplicación y actualiza los datos si es necesario
 */
const fs = require('fs');
const path = require('path');
const gplay = require('google-play-scraper');

/**
 * Obtiene el ID de Google Play desde la propiedad googlePlayUrl
 * @param {string} url - URL de Google Play
 * @returns {string|null} - ID de la app o null si no se encuentra
 */
function extractGooglePlayId(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get('id');
  } catch (error) {
    console.error(`Error extrayendo ID de Google Play desde URL: ${url}`, error.message);
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
    console.error(`Error obteniendo información actualizada de ${googlePlayId}:`, error.message);
    return null;
  }
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
 * Actualiza las aplicaciones existentes con datos de Google Play Store
 */
async function syncExistingApps() {
  try {
    console.log('Iniciando sincronización de apps existentes con Google Play Store...');
    
    // Leer el archivo de apps existente
    const appsFilePath = path.join(__dirname, '../client/src/data/apps.json');
    let existingApps = [];
    
    try {
      const appsData = fs.readFileSync(appsFilePath, 'utf8');
      existingApps = JSON.parse(appsData);
      console.log(`Leyendo ${existingApps.length} apps existentes`);
    } catch (error) {
      console.error('Error leyendo archivo de apps:', error.message);
      return;
    }
    
    if (!existingApps.length) {
      console.log('No hay apps existentes para sincronizar.');
      return;
    }
    
    // Contador de apps actualizadas
    let updatedCount = 0;
    let errorCount = 0;
    
    // Actualizar cada app
    for (let i = 0; i < existingApps.length; i++) {
      const app = existingApps[i];
      
      // Si la app tiene URL de Google Play, obtener información actualizada
      if (app.googlePlayUrl) {
        const googlePlayId = extractGooglePlayId(app.googlePlayUrl);
        
        if (googlePlayId) {
          console.log(`[${i+1}/${existingApps.length}] Sincronizando app: ${app.name} (${googlePlayId})`);
          
          try {
            // Esperar un momento para evitar problemas de rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Obtener información actualizada
            const updatedInfo = await getUpdatedAppInfo(googlePlayId);
            
            if (updatedInfo) {
              // Comprobar si hay cambios en versión o tamaño
              const versionChanged = app.version !== updatedInfo.version;
              const sizeChanged = app.size !== updatedInfo.size;
              const ratingChanged = app.rating !== updatedInfo.rating;
              const downloadsChanged = app.downloads !== updatedInfo.downloads;
              
              if (versionChanged || sizeChanged || ratingChanged || downloadsChanged) {
                // Actualizar app con nueva información
                existingApps[i] = {
                  ...app,
                  ...updatedInfo,
                  updatedAt: new Date().toISOString()
                };
                
                console.log(`  ✓ Actualizada: ${app.name} (versión ${updatedInfo.version})`);
                if (versionChanged) console.log(`    - Versión: ${app.version} → ${updatedInfo.version}`);
                if (sizeChanged) console.log(`    - Tamaño: ${app.size} → ${updatedInfo.size}`);
                if (ratingChanged) console.log(`    - Valoración: ${app.rating} → ${updatedInfo.rating}`);
                if (downloadsChanged) console.log(`    - Descargas: ${app.downloads} → ${updatedInfo.downloads}`);
                
                updatedCount++;
              } else {
                console.log(`  ✓ Sin cambios: ${app.name} (versión ${app.version})`);
              }
            } else {
              console.log(`  ✗ Error obteniendo datos: ${app.name}`);
              errorCount++;
            }
          } catch (error) {
            console.error(`  ✗ Error sincronizando: ${app.name}`, error.message);
            errorCount++;
          }
        } else {
          console.log(`[${i+1}/${existingApps.length}] URL inválida: ${app.name} (${app.googlePlayUrl})`);
          errorCount++;
        }
      } else {
        console.log(`[${i+1}/${existingApps.length}] Sin URL de Google Play: ${app.name}`);
      }
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync(appsFilePath, JSON.stringify(existingApps, null, 2), 'utf8');
    
    console.log('\nSincronización completada:');
    console.log(`- Apps totales: ${existingApps.length}`);
    console.log(`- Apps actualizadas: ${updatedCount}`);
    console.log(`- Errores: ${errorCount}`);
    
  } catch (error) {
    console.error('Error en sincronización de apps:', error);
  }
}

// Ejecutar la función principal
syncExistingApps();