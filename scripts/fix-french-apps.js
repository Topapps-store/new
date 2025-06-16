/**
 * Script para corregir las aplicaciones francesas que fueron procesadas 
 * en inglés en lugar de francés. Este script identifica las apps con URLs
 * francesas y las actualiza con contenido auténtico en francés.
 */

import fs from 'fs';
import path from 'path';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs francesas que necesitan ser corregidas
const frenchUrls = [
  "https://play.google.com/store/apps/details?id=eu.epicompany.wero.wallet&hl=fr",
  "https://play.google.com/store/apps/details?id=fr.paylib.paylib&hl=fr",
  "https://play.google.com/store/apps/details?id=com.heetch&hl=fr",
  "https://play.google.com/store/apps/details?id=fr.driveco&hl=fr",
  "https://play.google.com/store/apps/details?id=com.creamsoft.mygi&hl=fr",
  "https://play.google.com/store/apps/details?id=com.electra.app&hl=fr",
  "https://play.google.com/store/apps/details?id=com.app.tgtg&hl=fr",
  "https://play.google.com/store/apps/details?id=com.directenergie.maconso&hl=fr",
  "https://play.google.com/store/apps/details?id=ch.twint.payment&hl=fr",
  "https://play.google.com/store/apps/details?id=com.veryfit2hr.second&hl=fr",
  "https://play.google.com/store/apps/details?id=tw.mobileapp.qrcode.banner&hl=fr",
  "https://play.google.com/store/apps/details?id=com.teacapps.barcodescanner&hl=fr",
  "https://play.google.com/store/apps/details?id=taxi.android.client&hl=fr",
  "https://play.google.com/store/apps/details?id=fi.virta&hl=fr",
  "https://play.google.com/store/apps/details?id=com.cm_prod.bad&hl=fr",
  "https://play.google.com/store/apps/details?id=com.topstep.fitcloudpro&hl=fr",
  "https://play.google.com/store/apps/details?id=com.thenewmotion.thenewmotion&hl=fr",
  "https://play.google.com/store/apps/details?id=com.chargemap_beta.android&hl=fr"
];

/**
 * Extrae el ID de Google Play desde una URL
 */
function extractGooglePlayIdFromUrl(url) {
  try {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
    throw new Error('No se pudo extraer el ID de Google Play desde la URL');
  } catch (error) {
    console.error('Error al extraer el ID de Google Play desde la URL:', error);
    return null;
  }
}

/**
 * Obtiene información de una aplicación en Google Play Store en francés
 */
async function getGooglePlayInfoInFrench(googlePlayId) {
  try {
    console.log(`Obteniendo información en francés para: ${googlePlayId}`);
    
    const appInfo = await gplay.app({ 
      appId: googlePlayId,
      lang: 'fr',
      country: 'fr'
    });
    
    return {
      id: createAppId(appInfo.title),
      name: appInfo.title,
      category: appInfo.genre,
      categoryId: convertCategoryToId(appInfo.genre),
      description: appInfo.description,
      iconUrl: appInfo.icon,
      rating: appInfo.score,
      downloads: formatDownloads(appInfo.installs),
      version: appInfo.version,
      updated: formatDate(appInfo.updated),
      requires: `Android ${appInfo.androidVersion}+`,
      developer: appInfo.developer,
      installs: appInfo.installs,
      downloadUrl: appInfo.url,
      googlePlayUrl: appInfo.url,
      screenshots: appInfo.screenshots,
      isAffiliate: false,
      originalLanguage: 'fr'
    };
  } catch (error) {
    console.error(`Error al obtener información en francés para ${googlePlayId}:`, error);
    return null;
  }
}

/**
 * Convierte un nombre de categoría a un ID amigable para URLs
 */
function convertCategoryToId(category) {
  if (!category) return 'utilities';
  
  const categoryMap = {
    'Comunicación': 'communication',
    'Comunicaciones': 'communication',
    'Comunicazione': 'communication',
    'Communication': 'communication',
    'Social': 'social',
    'Redes sociales': 'social',
    'Social Networking': 'social',
    'Réseaux sociaux': 'social',
    'Entretenimiento': 'entertainment',
    'Entertainment': 'entertainment',
    'Divertissement': 'entertainment',
    'Compras': 'shopping',
    'Shopping': 'shopping',
    'Finanzas': 'finance',
    'Finance': 'finance',
    'Finances': 'finance',
    'Comida y bebida': 'food',
    'Food & Drink': 'food',
    'Cuisine et boissons': 'food',
    'Viajes': 'travel',
    'Travel': 'travel',
    'Voyages': 'travel',
    'Mapas y navegación': 'maps-and-navigation',
    'Maps & Navigation': 'maps-and-navigation',
    'Navigation': 'maps-and-navigation',
    'Cartes et navigation': 'maps-and-navigation',
    'Herramientas': 'utilities',
    'Tools': 'utilities',
    'Utilities': 'utilities',
    'Utilitaires': 'utilities',
    'Productividad': 'productivity',
    'Productivity': 'productivity',
    'Productivité': 'productivity',
    'Transporte': 'transportation',
    'Transportation': 'transportation',
    'Transports': 'transportation'
  };
  
  return categoryMap[category] || category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'utilities';
}

/**
 * Crea un ID amigable basado en el nombre de la app
 */
function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Formatea el conteo de instalaciones
 */
function formatDownloads(installs) {
  if (!installs) return '1M+';
  
  if (typeof installs === 'string') {
    const match = installs.match(/[\d,]+/);
    if (match) {
      const number = parseInt(match[0].replace(/,/g, ''));
      if (number >= 1000000000) return `${Math.floor(number / 1000000000)}B+`;
      if (number >= 1000000) return `${Math.floor(number / 1000000)}M+`;
      if (number >= 1000) return `${Math.floor(number / 1000)}K+`;
      return `${number}+`;
    }
  }
  
  return installs || '1M+';
}

/**
 * Formatea una fecha al formato deseado
 */
function formatDate(date) {
  if (!date) {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  }
  
  const dateObj = new Date(date);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Encuentra una app existente en el catálogo por ID de Google Play
 */
function findExistingAppByGooglePlayId(apps, googlePlayId) {
  return apps.find(app => {
    if (app.googlePlayUrl && app.googlePlayUrl.includes(googlePlayId)) {
      return true;
    }
    if (app.downloadUrl && app.downloadUrl.includes(googlePlayId)) {
      return true;
    }
    return false;
  });
}

/**
 * Actualiza una app existente con contenido en francés
 */
async function updateAppWithFrenchContent(app, frenchAppData) {
  console.log(`Actualizando ${app.name} con contenido francés: ${frenchAppData.name}`);
  
  // Actualizar con contenido francés
  app.name = frenchAppData.name;
  app.description = frenchAppData.description;
  app.originalLanguage = 'fr';
  
  // Mantener otros datos actualizados
  app.rating = frenchAppData.rating;
  app.version = frenchAppData.version;
  app.updated = frenchAppData.updated;
  app.iconUrl = frenchAppData.iconUrl;
  app.screenshots = frenchAppData.screenshots;
  
  return app;
}

/**
 * Función principal para corregir las apps francesas
 */
async function fixFrenchApps() {
  try {
    console.log('Iniciando corrección de aplicaciones francesas...');
    
    // Leer el archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    let updatedCount = 0;
    
    // Procesar cada URL francesa
    for (const url of frenchUrls) {
      try {
        const googlePlayId = extractGooglePlayIdFromUrl(url);
        if (!googlePlayId) {
          console.error(`No se pudo extraer ID de: ${url}`);
          continue;
        }
        
        // Encontrar la app existente
        const existingApp = findExistingAppByGooglePlayId(appsData.apps, googlePlayId);
        if (!existingApp) {
          console.log(`App no encontrada para ID: ${googlePlayId}`);
          continue;
        }
        
        // Obtener contenido en francés
        const frenchAppData = await getGooglePlayInfoInFrench(googlePlayId);
        if (!frenchAppData) {
          console.error(`No se pudo obtener contenido francés para: ${googlePlayId}`);
          continue;
        }
        
        // Actualizar la app con contenido francés
        await updateAppWithFrenchContent(existingApp, frenchAppData);
        updatedCount++;
        
        console.log(`✓ Actualizada: ${existingApp.name}`);
        
      } catch (error) {
        console.error(`Error procesando ${url}:`, error);
      }
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync(appsJsonPath, JSON.stringify(appsData, null, 2), 'utf8');
    
    console.log(`\n🎯 Corrección completada. Se actualizaron ${updatedCount} aplicaciones con contenido francés auténtico.`);
    
  } catch (error) {
    console.error('Error en la corrección de apps francesas:', error);
  }
}

// Ejecutar el script
fixFrenchApps().catch(console.error);