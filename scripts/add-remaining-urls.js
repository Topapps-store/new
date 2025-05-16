// Script para añadir todas las apps restantes desde las URLs en pending-apps.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer el ID de la app desde la URL de Google Play
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

// Función para crear un ID amigable basado en el ID de la app
function createAppId(packageId) {
  // Eliminar "com." al principio si existe
  let id = packageId.replace(/^com\./, '');
  
  // Reemplazar puntos con guiones
  id = id.replace(/\./g, '-');
  
  return id;
}

// Datos básicos para todas las apps pendientes
async function addRemainingApps() {
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
    
    console.log(`Actualmente hay ${appsData.apps.length} apps en el catálogo.`);
    console.log(`Procesando ${allUrls.length} URLs...`);
    
    // Crear un mapa de las apps existentes por URL
    const existingAppUrls = {};
    appsData.apps.forEach(app => {
      if (app.googlePlayUrl) {
        // Normalizar URL eliminando parámetros hl, gl, etc.
        const normalizedUrl = app.googlePlayUrl.split('&')[0];
        existingAppUrls[normalizedUrl] = true;
      }
    });
    
    // Procesar cada URL
    const newApps = [];
    
    for (const url of allUrls) {
      // Normalizar URL
      const normalizedUrl = url.split('&')[0];
      
      // Verificar si esta URL ya existe en el catálogo
      if (existingAppUrls[normalizedUrl]) {
        console.log(`La URL ${normalizedUrl} ya existe en el catálogo, omitiendo...`);
        continue;
      }
      
      // Extraer ID de la app
      const appId = extractAppIdFromUrl(url);
      if (!appId) {
        console.log(`No se pudo extraer el ID de la app desde la URL: ${url}`);
        continue;
      }
      
      // Crear un ID amigable para la app
      const friendlyId = createAppId(appId);
      
      // Datos básicos para la app
      const appData = {
        id: friendlyId,
        name: friendlyId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), // Formato título
        category: "Apps",
        categoryId: "apps",
        description: `Aplicación móvil disponible en Google Play Store. ID: ${appId}`,
        iconUrl: "https://play-lh.googleusercontent.com/lUN4EkdEcLagQa5QZIni7CVhPqZn2u_5nRyGkx1VeVHDhNr-lDFsoU1a2zjS-xp0-As", // Icono genérico
        rating: 4.0,
        downloads: "1M+",
        version: "1.0",
        updated: "May 16, 2025",
        requires: "Android 6.0+",
        developer: "App Developer",
        installs: "1,000,000+",
        downloadUrl: url,
        googlePlayUrl: url,
        screenshots: [
          "https://play-lh.googleusercontent.com/Zw0W83Afm1dzBweFPIr6srTXGMHD7VrSt3NBc5LJFWsByWr-MZ-XDU3y4mvNwaAFv1s",
        ],
        isAffiliate: true
      };
      
      newApps.push(appData);
      console.log(`Añadida app con ID: ${friendlyId} desde URL: ${url}`);
    }
    
    // Añadir las nuevas apps al catálogo
    if (newApps.length > 0) {
      const updatedApps = [...appsData.apps, ...newApps];
      
      // Actualizar el archivo
      appsData.apps = updatedApps;
      fs.writeFileSync(
        appsJsonPath,
        JSON.stringify(appsData, null, 2),
        'utf8'
      );
      
      console.log(`Se añadieron ${newApps.length} nuevas apps al catálogo.`);
      console.log(`Total de apps en el catálogo: ${updatedApps.length}`);
    } else {
      console.log('No se añadieron nuevas apps al catálogo.');
    }
    
  } catch (error) {
    console.error('Error al procesar las URLs restantes:', error);
  }
}

// Ejecutar la función
addRemainingApps().catch(error => {
  console.error('Error al ejecutar el script:', error);
});