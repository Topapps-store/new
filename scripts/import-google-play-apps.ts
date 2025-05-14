/**
 * Script para importar aplicaciones desde Google Play Store
 */

import { db } from '../server/db-sqlite';
import { apps, categories } from '../shared/schema-sqlite';
import { eq } from 'drizzle-orm';
import * as gplay from 'google-play-scraper';

// Lista de aplicaciones de Google Play que queremos importar
const googlePlayApps = [
  { url: 'https://play.google.com/store/apps/details?id=com.facebook.katana', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.whatsapp', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.instagram.android', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.twitter.android', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.linkedin.android', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.snapchat.android', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.spotify.music', categoryId: 'entertainment' },
  { url: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient', categoryId: 'entertainment' },
  { url: 'https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient', categoryId: 'entertainment' },
  { url: 'https://play.google.com/store/apps/details?id=com.disney.disneyplus', categoryId: 'entertainment' },
  { url: 'https://play.google.com/store/apps/details?id=com.ubercab', categoryId: 'transportation' },
  { url: 'https://play.google.com/store/apps/details?id=com.lyft.android', categoryId: 'transportation' },
  { url: 'https://play.google.com/store/apps/details?id=org.mozilla.firefox', categoryId: 'utilities' },
  { url: 'https://play.google.com/store/apps/details?id=com.brave.browser', categoryId: 'utilities' },
  { url: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping', categoryId: 'shopping' },
  { url: 'https://play.google.com/store/apps/details?id=com.ebay.mobile', categoryId: 'shopping' },
  { url: 'https://play.google.com/store/apps/details?id=com.contextlogic.wish', categoryId: 'shopping' },
  { url: 'https://play.google.com/store/apps/details?id=com.airbnb.android', categoryId: 'travel' },
  { url: 'https://play.google.com/store/apps/details?id=com.booking', categoryId: 'travel' },
  { url: 'https://play.google.com/store/apps/details?id=com.expedia.bookings', categoryId: 'travel' },
  { url: 'https://play.google.com/store/apps/details?id=com.grubhub.android', categoryId: 'food' },
  { url: 'https://play.google.com/store/apps/details?id=com.doordash.driverapp', categoryId: 'food' },
  { url: 'https://play.google.com/store/apps/details?id=com.mcdonalds.app', categoryId: 'food' },
  { url: 'https://play.google.com/store/apps/details?id=com.nordvpn.android', categoryId: 'utilities' },
  { url: 'https://play.google.com/store/apps/details?id=com.duolingo', categoryId: 'education' },
  { url: 'https://play.google.com/store/apps/details?id=com.trello', categoryId: 'productivity' },
  { url: 'https://play.google.com/store/apps/details?id=com.tinder', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.bumble.app', categoryId: 'social' },
  { url: 'https://play.google.com/store/apps/details?id=com.shazam.android', categoryId: 'entertainment' },
  { url: 'https://play.google.com/store/apps/details?id=com.paypal.android.p2pmobile', categoryId: 'finance' },
  { url: 'https://play.google.com/store/apps/details?id=com.venmo', categoryId: 'finance' }
];

/**
 * Extraer el ID de la aplicación de la URL de Google Play
 */
function getAppIdFromUrl(url: string): string {
  const urlPattern = /https:\/\/play\.google\.com\/store\/apps\/details\?id=([^&]+)/;
  const packageMatch = url.match(urlPattern);
  return packageMatch && packageMatch[1] ? packageMatch[1] : '';
}

/**
 * Generar un ID para la aplicación
 */
function generateAppId(storeId: string): string {
  // Extract the app name part to create a friendly ID
  const parts = storeId.split('.');
  let appId = '';
  
  if (parts.length > 1) {
    // Google Play IDs like com.company.appname
    appId = parts[parts.length - 1].toLowerCase();
  } else {
    // Fallback
    appId = storeId.toLowerCase();
  }
  
  // Clean up app ID (only lowercase letters, numbers, and dashes)
  appId = appId.replace(/[^a-z0-9-]/g, '-');
  
  return appId;
}

/**
 * Verificar si todas las categorías necesarias existen
 */
async function ensureCategories() {
  const requiredCategories = [
    { id: 'social', name: 'Social Media', color: '#1DA1F2' }, 
    { id: 'entertainment', name: 'Entertainment', color: '#FF0000' },
    { id: 'productivity', name: 'Productivity', color: '#0066CC' },
    { id: 'utilities', name: 'Utilities', color: '#5C5C5C' },
    { id: 'shopping', name: 'Shopping', color: '#FF9900' },
    { id: 'food', name: 'Food & Drink', color: '#FF6347' },
    { id: 'transportation', name: 'Transportation', color: '#00BA37' },
    { id: 'travel', name: 'Travel', color: '#4285F4' },
    { id: 'finance', name: 'Finance', color: '#00C244' },
    { id: 'education', name: 'Education', color: '#1877F2' }
  ];
  
  console.log('Verificando categorías existentes...');
  
  for (const category of requiredCategories) {
    // Verificar si la categoría ya existe
    const [existingCategory] = await db.select()
      .from(categories)
      .where(eq(categories.id, category.id));
    
    if (!existingCategory) {
      console.log(`Creando categoría: ${category.name}`);
      await db.insert(categories).values(category);
    } else {
      console.log(`Categoría ${category.name} ya existe.`);
    }
  }
  
  console.log('Todas las categorías verificadas y creadas si fue necesario.');
}

/**
 * Importar una aplicación de Google Play
 */
async function importGooglePlayApp(appUrl: string, categoryId: string) {
  const packageName = getAppIdFromUrl(appUrl);
  if (!packageName) {
    console.error(`URL de Google Play inválida: ${appUrl}`);
    return null;
  }
  
  const appId = generateAppId(packageName);
  
  // Verificar si la aplicación ya existe
  const [existingApp] = await db.select().from(apps).where(eq(apps.id, appId));
  if (existingApp) {
    console.log(`La aplicación ${appId} ya existe. Omitiendo...`);
    return existingApp;
  }
  
  console.log(`Importando aplicación ${packageName} desde Google Play...`);
  
  try {
    // Obtener datos de la aplicación de Google Play
    const appData = await new Promise((resolve, reject) => {
      gplay.app({
        appId: packageName,
        lang: 'en',
        country: 'us'
      }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
    
    // Formatear descargas
    const downloads = appData.reviews > 1000000 
      ? `${Math.floor(appData.reviews / 1000000)}M+` 
      : appData.reviews > 1000 
        ? `${Math.floor(appData.reviews / 1000)}K+` 
        : `${appData.reviews}+`;
    
    // Insertar datos en la base de datos
    const newApp = {
      id: appId,
      name: appData.title,
      categoryId: categoryId,
      description: appData.description || '',
      iconUrl: appData.icon || '',
      screenshots: appData.screenshots || [],
      rating: typeof appData.score === 'number' ? appData.score : 0,
      downloads: downloads,
      version: appData.version || '',
      size: appData.size || '',
      updated: appData.updated || new Date().toDateString(),
      requires: 'Android 5.0+',
      developer: appData.developer || '',
      installs: downloads,
      downloadUrl: appData.url || appUrl,
      googlePlayUrl: appData.url || appUrl,
      originalAppId: packageName,
      lastSyncedAt: new Date()
    };
    
    // Insertar la aplicación
    const [insertedApp] = await db.insert(apps).values([newApp]).returning();
    
    console.log(`Aplicación ${appData.title} (${appId}) importada con éxito.`);
    return insertedApp;
  } catch (error) {
    console.error(`Error al importar la aplicación ${packageName}:`, error);
    return null;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('Iniciando importación de aplicaciones desde Google Play...');
    
    // Asegurarnos de que todas las categorías existan
    await ensureCategories();
    
    // Importar cada aplicación
    let importedCount = 0;
    
    for (const app of googlePlayApps) {
      const result = await importGooglePlayApp(app.url, app.categoryId);
      if (result) {
        importedCount++;
      }
    }
    
    console.log(`Importación completada. ${importedCount} de ${googlePlayApps.length} aplicaciones importadas con éxito.`);
  } catch (error) {
    console.error('Error durante la importación:', error);
  }
}

// Ejecutar la función principal
main().catch(console.error);