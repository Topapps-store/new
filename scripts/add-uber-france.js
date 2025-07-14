import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gplay from 'google-play-scraper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Add Uber France app optimized for Google Ads
 */
async function addUberFrance() {
  try {
    console.log('Getting info for Uber France app...');
    
    // Get app info from Google Play in French
    const appInfo = await gplay.app({ 
      appId: 'com.ubercab',
      lang: 'fr',
      country: 'fr'
    });
    
    console.log('App info retrieved:', appInfo.title);
    
    // Create optimized description for Google Ads with French keywords
    const optimizedDescription = `
<div class="space-y-4">
  <h2 class="text-xl font-bold text-blue-600">Télécharger Uber app France - Réservez votre course en quelques clics</h2>
  
  <p class="text-lg leading-relaxed">
    <strong>Télécharger Uber</strong> en France et découvrez l'application de transport la plus populaire au monde. 
    L'<strong>Uber app</strong> vous permet de réserver une course rapidement et facilement dans toute la France.
  </p>
  
  <div class="bg-blue-50 p-4 rounded-lg">
    <h3 class="font-bold text-lg mb-2">🚗 Fonctionnalités Uber app France :</h3>
    <ul class="list-disc list-inside space-y-1">
      <li><strong>Uber app</strong> disponible 24h/24 et 7j/7</li>
      <li><strong>Télécharger Uber</strong> gratuitement sur Android et iOS</li>
      <li><strong>Uber France</strong> - courses dans toutes les grandes villes</li>
      <li><strong>Application Uber</strong> avec paiement sécurisé intégré</li>
      <li><strong>Uber transport</strong> avec chauffeurs professionnels</li>
    </ul>
  </div>
  
  <div class="bg-green-50 p-4 rounded-lg">
    <h3 class="font-bold text-lg mb-2">⭐ Avantages de télécharger Uber app :</h3>
    <ul class="list-disc list-inside space-y-1">
      <li><strong>Uber course</strong> - réservation instantanée</li>
      <li><strong>Uber taxi</strong> - tarifs transparents et sans surprise</li>
      <li><strong>Uber chauffeur</strong> - conducteurs vérifiés et notés</li>
      <li><strong>Uber voiture</strong> - large choix de véhicules</li>
      <li><strong>Uber prix</strong> - estimation avant la course</li>
    </ul>
  </div>
  
  <p class="text-lg leading-relaxed">
    Avec plus de 5 milliards de téléchargements dans le monde, <strong>Uber app</strong> est la référence du transport urbain. 
    <strong>Télécharger Uber</strong> maintenant et profitez de courses fiables partout en France avec l'<strong>application Uber</strong>.
  </p>
  
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="font-bold text-lg mb-2">🇫🇷 Uber France - Villes disponibles :</h3>
    <ul class="list-disc list-inside space-y-1">
      <li><strong>Uber Paris</strong> - service premium dans la capitale</li>
      <li><strong>Uber Lyon</strong> - transport rapide et efficace</li>
      <li><strong>Uber Marseille</strong> - courses dans toute la métropole</li>
      <li><strong>Uber Toulouse</strong> - déplacements urbains simplifiés</li>
    </ul>
  </div>
  
  <div class="text-center my-6 p-4 bg-blue-50 rounded-lg">
    <p class="text-xl font-bold text-blue-700 mb-2">Télécharger Uber app France</p>
    <p class="text-gray-600">Réservez votre prochaine course avec l'application Uber !</p>
  </div>
  
  <div class="text-center my-6 p-4 bg-green-50 rounded-lg">
    <p class="text-xl font-bold text-green-700 mb-2">Uber France - Transport fiable</p>
    <p class="text-gray-600">Télécharger Uber et voyagez en toute sécurité !</p>
  </div>
</div>

<!-- SEO optimized hidden content for Uber France -->
<div class="sr-only">
  <h4>Uber France Keywords</h4>
  <p>télécharger Uber, Uber app, application Uber, Uber France, Uber course, Uber taxi, Uber transport, Uber chauffeur, Uber voiture, Uber prix</p>
  <p>Uber Paris, Uber Lyon, Uber Marseille, Uber Toulouse, Uber app France, télécharger Uber France</p>
  <img alt="télécharger Uber app" />
  <img alt="Uber France transport" />
  <img alt="application Uber course" />
  <img alt="Uber taxi France" />
</div>
`;

    // Format the app data
    const appData = {
      id: 'uber-france',
      name: 'Uber France',
      description: optimizedDescription,
      shortDescription: 'Télécharger Uber app France - Réservez votre course rapidement avec l\'application Uber. Transport fiable 24h/24 partout en France.',
      icon: appInfo.icon,
      category: 'transport',
      categoryName: 'Transport',
      downloads: appInfo.installs || '1B+',
      rating: parseFloat(appInfo.score) || 4.5,
      developer: appInfo.developer || 'Uber Technologies, Inc.',
      version: appInfo.version || '4.0',
      size: appInfo.size || '150MB',
      updated: new Date().toISOString().split('T')[0],
      screenshots: appInfo.screenshots || [],
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.ubercab&hl=fr&gl=fr',
      googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.ubercab&hl=fr&gl=fr',
      isFeatured: true,
      tags: ['transport', 'taxi', 'france', 'uber', 'course', 'voiture']
    };

    // Read existing apps
    const appsPath = path.join(__dirname, '../apps_data.json');
    let apps = [];
    
    if (fs.existsSync(appsPath)) {
      const appsData = fs.readFileSync(appsPath, 'utf-8');
      apps = JSON.parse(appsData);
    }

    // Check if app already exists
    const existingAppIndex = apps.findIndex(app => app.id === appData.id);
    
    if (existingAppIndex !== -1) {
      apps[existingAppIndex] = appData;
      console.log('Updated existing Uber France app');
    } else {
      apps.push(appData);
      console.log('Added new Uber France app');
    }

    // Save updated apps
    fs.writeFileSync(appsPath, JSON.stringify(apps, null, 2));
    
    console.log('✅ Uber France app added successfully!');
    console.log('App ID:', appData.id);
    console.log('Name:', appData.name);
    
    // Generate Google Ads keywords and copy
    generateGoogleAdsContent();
    
  } catch (error) {
    console.error('Error adding Uber France app:', error);
  }
}

/**
 * Generate Google Ads content for Uber France
 */
function generateGoogleAdsContent() {
  console.log('\n🎯 GOOGLE ADS CONTENT FOR UBER FRANCE');
  console.log('=====================================\n');

  // Exact Match Keywords
  console.log('📍 EXACT MATCH KEYWORDS (10):');
  console.log('1. [télécharger uber]');
  console.log('2. [uber app]');
  console.log('3. [application uber]');
  console.log('4. [uber france]');
  console.log('5. [uber course]');
  console.log('6. [uber taxi]');
  console.log('7. [uber transport]');
  console.log('8. [uber paris]');
  console.log('9. [uber lyon]');
  console.log('10. [uber marseille]');

  // Phrase Match Keywords
  console.log('\n📍 PHRASE MATCH KEYWORDS (10):');
  console.log('1. "télécharger uber app"');
  console.log('2. "uber app france"');
  console.log('3. "application uber course"');
  console.log('4. "uber taxi france"');
  console.log('5. "uber transport france"');
  console.log('6. "uber chauffeur france"');
  console.log('7. "uber voiture france"');
  console.log('8. "uber prix france"');
  console.log('9. "réserver uber france"');
  console.log('10. "uber course paris"');

  // Ad Headlines (30 characters max)
  console.log('\n📍 AD HEADLINES (15 titles - 30 chars max):');
  console.log('1. Télécharger Uber App');
  console.log('2. Uber France - Course');
  console.log('3. App Uber Officielle');
  console.log('4. Uber Taxi France');
  console.log('5. Transport Uber');
  console.log('6. Uber Course Rapide');
  console.log('7. Uber App Gratuite');
  console.log('8. Uber Paris Lyon');
  console.log('9. Réserver Uber');
  console.log('10. Uber Chauffeur Pro');
  console.log('11. Uber Voiture Privée');
  console.log('12. Uber Prix Fixe');
  console.log('13. Uber 24h/24');
  console.log('14. Uber Sécurisé');
  console.log('15. Uber Instantané');

  // Ad Descriptions (90 characters max)
  console.log('\n📍 AD DESCRIPTIONS (4 descriptions - 90 chars max):');
  console.log('1. Télécharger Uber app France. Réservez votre course en quelques clics. Transport fiable.');
  console.log('2. Uber France - Course instantanée. Chauffeurs professionnels. Paiement sécurisé intégré.');
  console.log('3. Application Uber officielle. Transport 24h/24 dans toute la France. Tarifs transparents.');
  console.log('4. Uber taxi France. Réservation rapide, prix fixe, chauffeurs vérifiés. Télécharger maintenant.');

  console.log('\n✅ Google Ads content generated for maximum Quality Score!');
}

// Run the function
addUberFrance();