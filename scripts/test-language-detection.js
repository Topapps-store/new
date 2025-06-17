/**
 * Test script to verify language detection is working correctly
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

function detectLanguageFromUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Para App Store URLs: apps.apple.com/[locale]/app/...
    if (urlObj.hostname === 'apps.apple.com') {
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 2 && pathParts[1] !== 'app') {
        return pathParts[1]; // Retorna el código de idioma (fr, es, de, etc.)
      }
    }
    
    // Para Google Play URLs: play.google.com/store/apps/details?hl=[locale]
    if (urlObj.hostname === 'play.google.com') {
      const hlParam = urlObj.searchParams.get('hl');
      if (hlParam) {
        // Extract just the language code, ignore country codes like 'en_US'
        const languageCode = hlParam.split('_')[0];
        return languageCode;
      }
    }
    
    return 'en'; // Por defecto inglés
  } catch (error) {
    console.warn('Error detectando idioma desde URL:', error);
    return 'en';
  }
}

// Test URLs
const testUrls = [
  "https://play.google.com/store/apps/details?id=com.deliveroo.orderapp&hl=fr",
  "https://apps.apple.com/fr/app/taptap-send-transfert-dargent/id1413346006?mt=8",
  "https://play.google.com/store/apps/details?id=com.heetch&hl=fr",
  "https://play.google.com/store/apps/details?id=com.ubercab&hl=es",
  "https://apps.apple.com/es/app/uber/id368677368",
  "https://play.google.com/store/apps/details?id=com.waze&hl=en_US"
];

console.log('Testing language detection:');
testUrls.forEach(url => {
  const detectedLang = detectLanguageFromUrl(url);
  console.log(`${url} → ${detectedLang}`);
});