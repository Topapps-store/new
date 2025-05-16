// Script para combinar apps existentes con apps extraídas de Google Play
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de IDs de apps populares y verificadas
const verifiedAppIds = [
  'com.pdf.editor.viewer.pdfreader.pdfviewer',
  'com.amazon.mShop.android.shopping',
  'com.ebay.mobile',
  'com.duolingo',
  'com.grubhub.android',
  'com.citymapper.app.release',
  'com.reddit.frontpage',
  'com.spotify.music',
  'deezer.android.app',
  'com.instagram.android',
  'com.google.android.apps.translate',
  'com.ubercab',
  'com.ubercab.eats',
  'com.instacart.client',
  'com.squareup.cash',
  'com.venmo',
  'com.zellepay.zelle',
  'com.dd.doordash',
  'me.lyft.android',
  'com.alibaba.aliexpresshd',
  'com.whatsapp',
  'com.whatsapp.w4b',
  'com.revolut.revolut',
  'com.waze',
  'com.tinder',
  'com.canva.editor',
  'com.openai.chatgpt'
];

async function combineApps() {
  try {
    // Cargar apps.json actual
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`Actualmente hay ${appsData.apps.length} apps en el catálogo.`);
    
    // Lista para almacenar todas las apps procesadas
    const processedApps = [];
    const failedApps = [];
    
    // Procesar cada ID de app verificada
    for (const appId of verifiedAppIds) {
      try {
        console.log(`Procesando app con ID: ${appId}`);
        
        // Obtener datos de la app
        const appInfo = await gplay.app({ appId });
        
        // Crear objeto de app
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
          updated: "May 16, 2025", // Fecha fija para simplificar
          requires: `Android ${appInfo.androidVersion || "6.0"}+`,
          developer: appInfo.developer,
          installs: appInfo.installs || "1,000,000+",
          downloadUrl: appInfo.url,
          googlePlayUrl: appInfo.url,
          screenshots: appInfo.screenshots || [],
          isAffiliate: true
        };
        
        processedApps.push(appData);
        console.log(`✓ Procesada app: ${appData.name}`);
        
        // Añadir un retraso para evitar bloqueos
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error procesando app ${appId}:`, error);
        failedApps.push(appId);
      }
    }
    
    // Si tenemos apps procesadas, actualizar el archivo JSON
    if (processedApps.length > 0) {
      appsData.apps = processedApps;
      
      fs.writeFileSync(
        appsJsonPath,
        JSON.stringify(appsData, null, 2),
        'utf8'
      );
      
      console.log(`Se procesaron ${processedApps.length} apps correctamente.`);
      console.log(`No se pudieron procesar ${failedApps.length} apps.`);
    } else {
      console.log('No se pudo procesar ninguna app correctamente.');
    }
  } catch (error) {
    console.error('Error general al combinar apps:', error);
  }
}

// Funciones auxiliares

function createAppId(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

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

function convertCategoryToId(category) {
  if (!category) return "apps";
  
  return category
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ +/g, '-');
}

// Ejecutar la función principal
combineApps().then(() => {
  console.log('Proceso completado.');
}).catch(error => {
  console.error('Error al ejecutar el script:', error);
});