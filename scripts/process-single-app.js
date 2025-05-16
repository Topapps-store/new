// Script para procesar una sola app de Google Play
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL de la app de PDF Reader
const pdfReaderUrl = "https://play.google.com/store/apps/details?id=com.pdf.editor.viewer.pdfreader.pdfviewer&hl=en&gl=us";

/**
 * Extrae el ID de la app desde una URL de Google Play
 */
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

/**
 * Crea un ID amigable a partir del nombre de la app
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formatea el número de descargas
 */
function formatDownloads(installs) {
  if (!installs) return "1M+";
  
  const numStr = installs.replace(/[^0-9]/g, '');
  const num = parseInt(numStr, 10);
  
  if (num >= 1000000000) {
    return `${Math.floor(num / 1000000000)}B+`;
  } else if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  
  return `${num}+`;
}

/**
 * Formatea una fecha al formato deseado
 */
function formatDate(date) {
  return "May 16, 2025"; // Fecha fija para simplificar
}

/**
 * Convierte un nombre de categoría a un ID amigable
 */
function convertCategoryToId(category) {
  if (!category) return "apps";
  
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

/**
 * Obtiene información detallada de la app de PDF Reader
 */
async function getPdfReaderInfo() {
  try {
    const appId = extractAppIdFromUrl(pdfReaderUrl);
    if (!appId) {
      console.error('No se pudo extraer el ID de la app');
      return null;
    }
    
    console.log(`Obteniendo información para: ${appId}`);
    
    // Obtener datos de la app
    console.log('Intentando obtener datos de la app...');
    const appInfo = await gplay.app({ appId });
    
    console.log('Datos obtenidos, procesando...');
    console.log('Título:', appInfo.title);
    console.log('Categoría:', appInfo.genre);
    console.log('Desarrollador:', appInfo.developer);
    
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
      version: appInfo.version || "1.0.0",
      updated: formatDate(appInfo.updated),
      requires: `Android ${appInfo.androidVersion || "6.0"}+`,
      developer: appInfo.developer,
      installs: appInfo.installs || "1,000,000+",
      downloadUrl: appInfo.url,
      googlePlayUrl: appInfo.url,
      screenshots: appInfo.screenshots || [],
      isAffiliate: true
    };
    
    // Guardar los datos en un archivo JSON para verlos
    const outputPath = path.join(__dirname, '../pdf-reader-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(appData, null, 2), 'utf8');
    
    console.log(`Datos de la app guardados en ${outputPath}`);
    return appData;
  } catch (error) {
    console.error('Error al obtener información para PDF Reader:', error);
    return null;
  }
}

// Ejecutar la función
getPdfReaderInfo().catch(error => {
  console.error('Error al ejecutar el script:', error);
});