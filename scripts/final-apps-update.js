// Script final para actualizar el catálogo de apps
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de apps populares con sus detalles verificados
const popularApps = [
  {
    id: "uber",
    name: "Uber - Request a ride",
    category: "Maps & Navigation",
    categoryId: "maps-navigation",
    description: "Request a ride with Uber, the ridesharing platform that connects you with a reliable ride in minutes. Just open the app and enter your destination to find a ride nearby.",
    iconUrl: "https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrWiRf8-nQ8fcJ3rXdCv_4mGYJTXB0f-AwbgTpqbrF3R4XA=s180-rw",
    rating: 4.3,
    downloads: "500M+",
    version: "4.503.10001",
    updated: "May 14, 2025",
    requires: "Android 7.0+",
    developer: "Uber Technologies, Inc.",
    installs: "500,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
    screenshots: [
      "https://play-lh.googleusercontent.com/IxK3GaLv-DCx5Z3MYwZVQ0OM3GnYmJtgPHwGJS0jw1xjcO4DpGPvWfXwYs3NTu6B_w=w1052-h592-rw"
    ],
    isAffiliate: true
  },
  {
    id: "uber-eats",
    name: "Uber Eats: Food Delivery",
    category: "Food & Drink",
    categoryId: "food-drink",
    description: "Uber Eats is the easy way to get the food you love delivered. Order food from restaurants you love, prepared and delivered by local favorites and national brands.",
    iconUrl: "https://play-lh.googleusercontent.com/kDzXRKn4I3rpU_QrvBWq2V2OSXJ7qXHVir_-NKi9wl6mU4-h55mVnHj-HUAYQvIU9Tc=s180-rw",
    rating: 4.6,
    downloads: "500M+",
    version: "4.396.10000",
    updated: "May 12, 2025",
    requires: "Android 8.0+",
    developer: "Uber Technologies, Inc.",
    installs: "500,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.ubercab.eats",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ubercab.eats",
    screenshots: [
      "https://play-lh.googleusercontent.com/eMurmO6JoGOLvAhsvP-Gbqh9DFx9p-qcJz6dlYrmgD17AZgbtCi2Qk_X-w2JA95YCw=w1052-h592-rw"
    ],
    isAffiliate: true
  },
  {
    id: "amazon-shopping",
    name: "Amazon Shopping",
    category: "Shopping",
    categoryId: "shopping",
    description: "The Amazon Shopping app lets you shop millions of products and manage your Amazon orders from anywhere. Browse, shop by department, compare prices, read reviews, share products with friends, and check the status of your orders.",
    iconUrl: "https://play-lh.googleusercontent.com/lAFgx9P9v6g9CGiJ4yXEghRTGikQg88xuxOUZNVN4CPf1GbMRS6jAv7yzO0jGGwzLQ=s180-rw",
    rating: 4.2,
    downloads: "500M+",
    version: "27.8.0.100",
    updated: "May 11, 2025",
    requires: "Android 8.0+",
    developer: "Amazon Mobile LLC",
    installs: "500,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
    screenshots: [
      "https://play-lh.googleusercontent.com/S3kG-aBMXRpS5V4wt7Jm3VzCPmhHr4WfKN_0AZM6ssZjGCQ0bZfYEo_4WVHZOjQEsDE=w1052-h592-rw"
    ],
    isAffiliate: true
  },
  {
    id: "doordash",
    name: "DoorDash - Food Delivery",
    category: "Food & Drink",
    categoryId: "food-drink",
    description: "DoorDash is the fastest and easiest way to get food delivery, grocery delivery, and more on-demand. Just open the app, find what you're craving, and we'll have your food delivered right to your door.",
    iconUrl: "https://play-lh.googleusercontent.com/K46LG_-x_CvGYXvQTPvZvpcHDQAqpBqNjJYSR9Q1i3VPP1vX7lgJA8Xywi-Rz5TzrxM=s180-rw",
    rating: 4.8,
    downloads: "50M+",
    version: "25.15.3",
    updated: "May 9, 2025",
    requires: "Android 7.0+",
    developer: "DoorDash Inc.",
    installs: "50,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.dd.doordash",
    screenshots: [
      "https://play-lh.googleusercontent.com/9iQbGV7PGU6BKlR-XE7zZ3qdl-JMWEz8fqO7mWQVDpEzk1NaNxg18rHWCl8owMc3Pw=w1052-h592-rw"
    ],
    isAffiliate: true
  },
  {
    id: "spotify",
    name: "Spotify: Music and Podcasts",
    category: "Music & Audio",
    categoryId: "music-audio",
    description: "With Spotify, you have access to a world of music and podcasts. You can listen to artists and albums, or create your own playlist of your favorite songs. Want to discover new music? Choose a ready-made playlist that suits your mood or get personalized recommendations.",
    iconUrl: "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qRRsYUt_478yA7EtK2L9CH_1reMeVNrJxD8Pu0=s180-rw",
    rating: 4.3,
    downloads: "1B+",
    version: "8.8.92.251",
    updated: "May 14, 2025",
    requires: "Android 7.0+",
    developer: "Spotify AB",
    installs: "1,000,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    screenshots: [
      "https://play-lh.googleusercontent.com/lXA4Ovc0CHM-HnmXWZQCicn4Bf4O-MkK7SZfKwzMBB-LHvUUUVCx_WCOB2EOOojbhwQ=w1052-h592-rw"
    ],
    isAffiliate: true
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    category: "Business",
    categoryId: "business",
    description: "WhatsApp Business enables you to have a business presence on WhatsApp, communicate more efficiently with your customers, and help you grow your business.",
    iconUrl: "https://play-lh.googleusercontent.com/_XCSOChLRUCf2OZFcKTfhvjwCvj8z_omXOsRa3Az03VfFT9CKQ8ON14jwUoIxlbvHow=s180-rw",
    rating: 4.2,
    downloads: "500M+",
    version: "2.25.12.80",
    updated: "May 15, 2025",
    requires: "Android 5.0+",
    developer: "WhatsApp LLC",
    installs: "500,000,000+",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.whatsapp.w4b",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.whatsapp.w4b",
    screenshots: [
      "https://play-lh.googleusercontent.com/qg3MX2GrznxRdQhBPZTmXJzeeKVb5Hl6wGNQgM5LFijNNT9U-rXfUBkYA_dy4HJy7A=w1052-h592-rw"
    ],
    isAffiliate: true
  }
];

// Lista de apps a extraer directamente de Google Play
const appsToExtract = [
  "com.pdf.editor.viewer.pdfreader.pdfviewer",
  "com.alibaba.aliexpresshd",
  "com.revolut.revolut",
  "com.canva.editor",
  "com.nordvpn.android",
  "com.openai.chatgpt",
  "com.duolingo",
  "com.reddit.frontpage",
  "com.waze",
  "com.instagram.android"
];

async function updateCatalog() {
  try {
    // Cargar apps.json actual
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    console.log(`Actualizando catálogo con apps verificadas...`);
    
    // Lista para almacenar todas las apps procesadas
    const allApps = [...popularApps]; // Comenzamos con las apps verificadas
    const extractedApps = [];
    
    // Extraer apps de Google Play
    for (const appId of appsToExtract) {
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
        
        extractedApps.push(appData);
        console.log(`✓ Procesada app: ${appData.name}`);
        
        // Añadir un retraso para evitar bloqueos
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error procesando app ${appId}:`, error);
      }
    }
    
    // Combinar todas las apps
    allApps.push(...extractedApps);
    
    console.log(`Total de apps extraídas de Google Play: ${extractedApps.length}`);
    console.log(`Total de apps verificadas: ${popularApps.length}`);
    console.log(`Total de apps en el catálogo actualizado: ${allApps.length}`);
    
    // Actualizar el archivo apps.json
    appsData.apps = allApps;
    
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log('Catálogo actualizado correctamente.');
  } catch (error) {
    console.error('Error general al actualizar el catálogo:', error);
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
updateCatalog().then(() => {
  console.log('Proceso completado.');
}).catch(error => {
  console.error('Error al ejecutar el script:', error);
});