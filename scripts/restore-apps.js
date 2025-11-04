import gplay from 'google-play-scraper';
import fs from 'fs';

// Mapeo de IDs a package names conocidos
const appPackages = {
  'google-maps': { type: 'gplay', id: 'com.google.android.apps.maps' },
  'youtube': { type: 'gplay', id: 'com.google.android.youtube' },
  'instagram': { type: 'gplay', id: 'com.instagram.android' },
  'x': { type: 'gplay', id: 'com.twitter.android' },
  'bumble-dating-app-meet-date': { type: 'gplay', id: 'com.bumble.app' },
  'kik-messaging-chat-app': { type: 'gplay', id: 'kik.android' },
  'tinder-dating-app-chat-date': { type: 'gplay', id: 'com.tinder' },
  'taskrabbit-handyman-errands': { type: 'gplay', id: 'com.taskrabbit.droid.consumer' },
  'handy-book-home-services': { type: 'gplay', id: 'com.handy.handy.prod' },
  'shein-shopping-online': { type: 'gplay', id: 'com.zzkko' },
  'lawn-love': { type: 'gplay', id: 'com.lawnlove.customers' },
  'enel-x-way': { type: 'gplay', id: 'com.enel.mobile.recharge2' },
  'electromaps-charging-stations': { type: 'gplay', id: 'com.enredats.electromaps' },
  'acciona-recarga-ve': { type: 'gplay', id: 'com.charge.and.parking' },
  'shell-recharge': { type: 'gplay', id: 'com.thenewmotion.thenewmotion' },
  'zunder-charging-network': { type: 'gplay', id: 'com.smartmio' },
  'wenea': { type: 'gplay', id: 'es.wenea.app.client' },
  'bart-official': { type: 'gplay', id: 'com.app.bart' },
  'cabify': { type: 'gplay', id: 'com.cabify.rider' },
  'samsung-health': { type: 'gplay', id: 'com.sec.android.app.shealth' },
  'vinted-buy-and-sell-clothes': { type: 'gplay', id: 'fr.vinted' },
  'veryfitpro': { type: 'gplay', id: 'com.veryfit2hr.second' },
  'virta': { type: 'gplay', id: 'fi.virta' },
  'fitcloudpro': { type: 'gplay', id: 'com.topstep.fitcloudpro' },
  'lidl-plus-de': { type: 'gplay', id: 'com.lidl.eci.lidlplus', lang: 'de' },
  'prestopark-fr': { type: 'gplay', id: 'com.iemgroup.v2.prestopark', lang: 'fr' },
  'indigo-neo-fr': { type: 'gplay', id: 'group.flowbird.mpp', lang: 'fr' }
};

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function restoreApps() {
  const data = JSON.parse(fs.readFileSync('client/src/data/apps.json', 'utf8'));
  const restoredApps = [];

  console.log('Iniciando restauración de apps con rating 4.0...\n');

  for (const [appId, config] of Object.entries(appPackages)) {
    try {
      console.log(`Obteniendo: ${appId}...`);
      const appInfo = await gplay.app({ 
        appId: config.id,
        lang: config.lang || 'en'
      });

      const appData = {
        id: appId,
        name: appInfo.title,
        category: appInfo.genre,
        categoryId: appInfo.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'uncategorized',
        description: appInfo.description,
        iconUrl: appInfo.icon,
        rating: 4.0, // FORZAR A 4.0
        downloads: appInfo.installs || '1M+',
        version: appInfo.version,
        updated: formatDate(appInfo.updated),
        requires: `Android ${appInfo.androidVersion || '5.0'}+`,
        developer: appInfo.developer,
        installs: appInfo.installs,
        downloadUrl: `https://play.google.com/store/apps/details?id=${config.id}`,
        googlePlayUrl: `https://play.google.com/store/apps/details?id=${config.id}`,
        screenshots: appInfo.screenshots || [],
        isAffiliate: false
      };

      restoredApps.push(appData);
      console.log(`✓ Restaurada: ${appInfo.title} (Rating forzado a 4.0)`);
      
      // Pequeño delay para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Error con ${appId}:`, error.message);
    }
  }

  // Agregar las apps restauradas
  data.apps = [...data.apps, ...restoredApps];
  
  fs.writeFileSync('client/src/data/apps.json', JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Restauradas ${restoredApps.length} apps con rating 4.0`);
  console.log(`Total de apps en catálogo: ${data.apps.length}`);
}

restoreApps().catch(console.error);
