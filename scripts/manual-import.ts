/**
 * Este script importa manualmente algunas aplicaciones de Google Play a la base de datos
 */

import { db } from '../server/db-sqlite';
import { apps, categories } from '../shared/schema-sqlite';
import { eq, sql } from 'drizzle-orm';

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
    description: 'WhatsApp from Meta is a FREE messaging and video calling app. It's used by over 2B people in more than 180 countries.',
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
  },
  {
    id: 'amazon',
    name: 'Amazon Shopping',
    categoryId: 'shopping',
    description: 'Shop millions of products, including fashion, electronics, home, and more.',
    iconUrl: 'https://play-lh.googleusercontent.com/tT_5iKTUNTIKxl4ycUc6yiyZIBPKkhhJecPpVq_Xbc-v-2Bik2D2wINmIVgxxpnPig=s180-rw',
    rating: 4.2,
    downloads: '500M+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-04',
    requires: 'Android 5.0+',
    developer: 'Amazon Mobile LLC',
    installs: '500,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
    originalAppId: 'com.amazon.mShop.android.shopping',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/zfFDTaMQxzqKx1k8LJ5nPWH1UrQwNWZFpaTlI5h7QYNQLDRiQmYNG1q74QbKQEZvKQ=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/JOKXXF5FwJ3DLbQlv-f4wYkYHHK-Mu8yyDCVS-vKhyk3MiTHy23TWWD2HkZqzPeRew=w2560-h1440-rw'
    ])
  },
  {
    id: 'netflix',
    name: 'Netflix',
    categoryId: 'entertainment',
    description: 'Looking for the most talked about TV shows and movies from around the world? They're all on Netflix.',
    iconUrl: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s180-rw',
    rating: 4.2,
    downloads: '1B+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-12',
    requires: 'Android 5.0+',
    developer: 'Netflix, Inc.',
    installs: '1,000,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
    originalAppId: 'com.netflix.mediaclient',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/8Wo6U9bcYlU0oDk4UHxYVeTSXWGUMGO5U9RJ-Fh4SLnfca3EqF56ZCkZfXFC0iVnuA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/w9PHJk-CxjxSsJKlrn3Gz9foS0nNZGKcCXuPmWD8OYXTlPdJH3XYDxgbgF_S6tFTSEo=w2560-h1440-rw'
    ])
  },
  {
    id: 'tinder',
    name: 'Tinder',
    categoryId: 'social',
    description: 'With 55 billion matches to date, Tinder® is the world's most popular dating app, making it the place to meet new people.',
    iconUrl: 'https://play-lh.googleusercontent.com/rZHzXj7NPFu1T92KGh8XNYIbZfBdqxJmvUSTjnBJbdZq85UJpPyuQQsLGFp6Q5YKhFE=s180-rw',
    rating: 3.9,
    downloads: '100M+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-03',
    requires: 'Android 5.0+',
    developer: 'Tinder Inc.',
    installs: '100,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.tinder',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.tinder',
    originalAppId: 'com.tinder',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/CzgGJDpLz2NmbAkJMRxqQ2CEH8LVs80_j9-8cAsVss3NV4RL0vFPPMEr9G8wVsO7JEg=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/Y4VLxsLHF5K04Gm-gFKAHEE62IrYWJyisZuQTVBX5mHiGizVrxm5xzTZKP2wWCeJylVM=w2560-h1440-rw'
    ])
  },
  {
    id: 'nordvpn',
    name: 'NordVPN',
    categoryId: 'utilities',
    description: 'Secure and private browsing. Hide your IP address and encrypt your connection for privacy.',
    iconUrl: 'https://play-lh.googleusercontent.com/AbVp3wP6N9Ok0bHDxlWlDT3JL29uDFf6Z7k9icB0M-lFMEyKCqkBRpRM6jdYHJUh5Q=s180-rw',
    rating: 4.4,
    downloads: '10M+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-05',
    requires: 'Android 6.0+',
    developer: 'Nord Security',
    installs: '10,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.nordvpn.android',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.nordvpn.android',
    originalAppId: 'com.nordvpn.android',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/wLIc1yjqbnaB0wl6FNckjbLdgf9J1l3HHL-xh4UhwIjKXVQxVqO1yJJCJdLz_v9rR5I=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/UDsMDlCHMJNxBLPFJHJxFhr8DKG_AYxWGN1t9kq1IqUpaO3FdfNZzI42zAikLdnzDm0=w2560-h1440-rw'
    ])
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    categoryId: 'education',
    description: 'Learn languages with fun lessons on the world\'s most popular language learning platform.',
    iconUrl: 'https://play-lh.googleusercontent.com/hSyebBlYwtE2aMjzSIg65a-Xy8KFMS5M-JF2VDmTLdVmdNuZEVwHztwrjMuYb7-uc1Y=s180-rw',
    rating: 4.7,
    downloads: '100M+',
    version: 'Varies with device',
    size: 'Varies with device',
    updated: '2023-05-10',
    requires: 'Android 5.0+',
    developer: 'Duolingo',
    installs: '100,000,000+',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.duolingo',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.duolingo',
    originalAppId: 'com.duolingo',
    screenshots: JSON.stringify([
      'https://play-lh.googleusercontent.com/v8M0-Ugf45fu-JvggZHylLbKr9Wqvk4RW_-y_Pf7d-UwbAUU6iOyrUxGQZHk_-Z2BA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/3GXX5pTKNeMDrOZ15wtjcxjKUzQlibDP0TdDzpJ9AzWQS4LM4mdFYO0krF8UQPcHAn4=w2560-h1440-rw'
    ])
  }
];

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
    console.log('Iniciando importación manual de aplicaciones...');
    
    // Asegurarnos de que todas las categorías existan
    await ensureCategories();
    
    // Importar aplicaciones
    await importApps();
    
    console.log('Importación manual completada con éxito.');
  } catch (error) {
    console.error('Error durante la importación manual:', error);
  }
}

// Ejecutar la función principal
main().catch(console.error);