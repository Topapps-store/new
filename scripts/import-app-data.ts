/**
 * Este script importa manualmente apps de Google Play a la base de datos
 */

import { db } from '../server/db-sqlite';
import { apps, categories } from '../shared/schema-sqlite';
import { eq } from 'drizzle-orm';

// Lista de categorías requeridas
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

// Lista de aplicaciones de Google Play que queremos importar
const googlePlayApps = [
  {
    id: 'facebook',
    name: 'Facebook',
    categoryId: 'social',
    description: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.',
    iconUrl: 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s180-rw',
    rating: 4.2,
    downloads: '5B+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-10',
    requires: 'Android 5.0+',
    developer: 'Meta Platforms, Inc.',
    installs: '5,000,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
    originalAppId: 'com.facebook.katana',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/5NZ7qA8MF4-XXz_fTcQYZlL7ymk5VLkZ5jd6GCu6l2P3cFbfYkw9Pp9vwXrGVKZBIQ=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/FTZJYQfDYuPDUatJBHHStCkb6d0_VBVaE_xzHZ5Fw8ODFYwqwAOLNnDtU3PNK-nA_es=w2560-h1440-rw'
    ])
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Messenger',
    categoryId: 'social',
    description: 'WhatsApp from Meta is a FREE messaging and video calling app. It is used by over 2B people in more than 180 countries.',
    iconUrl: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw',
    rating: 4.1,
    downloads: '5B+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-09',
    requires: 'Android 5.0+',
    developer: 'WhatsApp LLC',
    installs: '5,000,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
    originalAppId: 'com.whatsapp',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/k7f5OcVjz9Q4GUd6Hb8Enm-H-cHYH-eU9YGhP0R0Uyn-YlLBL6_LIsVLHcXYBjOPKpc=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/9N5NB0iiP0LLQ0AhC0yXJBFrO7jKGMxrHpfJDyPOl0VejYG1fbunzZqw-Em-ZbKnxqM=w2560-h1440-rw'
    ])
  },
  {
    id: 'instagram',
    name: 'Instagram',
    categoryId: 'social',
    description: 'Bringing you closer to the people and things you love.',
    iconUrl: 'https://play-lh.googleusercontent.com/c2DcVsBUhJb3UlAGABHwafpuhstHwORpVwWZ0RvMSiL49o5dTKHe63t0ySUzQtoqyQ=s180-rw',
    rating: 4.4,
    downloads: '1B+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-08',
    requires: 'Android 5.0+',
    developer: 'Instagram',
    installs: '1,000,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.instagram.android',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.instagram.android',
    originalAppId: 'com.instagram.android',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/P50qt41KgJXdl9nD8gMYpjeqHbB0Z_EJsgAMBpjV8j_ZJLRJ5bumfKcsvuCfyBZ7vQ=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/u0ivENshYFF13i7cyxaMfVgujhRKWlQrLRyQ4BmKzuLQKNVY1_M_cNGZ6HfmAzXhZYaO=w2560-h1440-rw'
    ])
  },
  {
    id: 'uber',
    name: 'Uber',
    categoryId: 'transportation',
    description: 'Request a ride with a tap of a button and get picked up by a nearby driver.',
    iconUrl: 'https://play-lh.googleusercontent.com/rp1_fPDI57XzQ-b7F-I2jdyHxqSMDXILnFRdPN_56BhbjkXgA5LYn5hJe_pS6_9ENw=s180-rw',
    rating: 4.3,
    downloads: '500M+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-05',
    requires: 'Android 5.0+',
    developer: 'Uber Technologies, Inc.',
    installs: '500,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
    originalAppId: 'com.ubercab',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/JVutVEFwFXvnDR9wgXMXFrPl2xU8M8XAJHXZGu-XSLXhOx_xjI8tgKEiEsIYfOcTJac=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/zIcb8n8u_76yg5InGxWiyfusQZTlw95styY0aNkkAGVifF2ffLXYd5o7tKJBV1TNlQ=w2560-h1440-rw'
    ])
  },
  {
    id: 'spotify',
    name: 'Spotify: Music and Podcasts',
    categoryId: 'entertainment',
    description: 'Listen to songs, play podcasts, create playlists and discover music you'll love.',
    iconUrl: 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5VEmKAXfzOqbiaeAsqqrEBCTdIEs=s180-rw',
    rating: 4.4,
    downloads: '1B+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-11',
    requires: 'Android 5.0+',
    developer: 'Spotify AB',
    installs: '1,000,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
    originalAppId: 'com.spotify.music',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/xhbPkVdJjvjYgCBNv6yNBMbW4YQ7xcyPLfZ6xV6GfBgzyGJKgVUZ_yZeTNEh8n7eUA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/n9I2z3FeG9QYlxIGZDpdud5yOV2-l-f2GCi0R2qWx9K5E-bTmLHAaIEwQST_1lTfWVU=w2560-h1440-rw'
    ])
  }
];

/**
 * Verificar si todas las categorías necesarias existen
 */
async function ensureCategories() {
  console.log('Verificando categorías existentes...');
  
  for (const category of requiredCategories) {
    // Verificar si la categoría ya existe
    const [existingCategory] = await db.select()
      .from(categories)
      .where(eq(categories.id, category.id));
    
    if (!existingCategory) {
      console.log(`Creando categoría: ${category.name}`);
      await db.insert(categories).values([category]);
    } else {
      console.log(`Categoría ${category.name} ya existe.`);
    }
  }
  
  console.log('Todas las categorías verificadas y creadas si fue necesario.');
}

/**
 * Importar aplicaciones a la base de datos
 */
async function importApps() {
  console.log('Importando aplicaciones a la base de datos...');
  
  let importedCount = 0;
  
  for (const app of googlePlayApps) {
    try {
      // Verificar si la aplicación ya existe
      const [existingApp] = await db.select().from(apps).where(eq(apps.id, app.id));
      
      if (existingApp) {
        console.log(`La aplicación ${app.name} (${app.id}) ya existe. Actualizando...`);
        await db.update(apps)
          .set(app)
          .where(eq(apps.id, app.id));
      } else {
        console.log(`Importando aplicación ${app.name} (${app.id})...`);
        await db.insert(apps).values([app]);
      }
      
      importedCount++;
      console.log(`Aplicación ${app.name} (${app.id}) importada con éxito.`);
    } catch (error) {
      console.error(`Error al importar la aplicación ${app.id}:`, error);
    }
  }
  
  console.log(`Importación completada. ${importedCount} de ${googlePlayApps.length} aplicaciones importadas con éxito.`);
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('Iniciando importación de datos...');
    
    // Asegurarnos de que todas las categorías existan
    await ensureCategories();
    
    // Importar aplicaciones
    await importApps();
    
    console.log('Importación completada con éxito.');
  } catch (error) {
    console.error('Error durante la importación:', error);
  }
}

// Ejecutar la función principal
main().catch(console.error);