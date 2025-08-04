import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Todas las claves UI que se usan en el código
const requiredUiKeys = [
  'continue',
  'downloads', 
  'developer',
  'description',
  'screenshots',
  'information',
  'version',
  'size',
  'updated',
  'requires',
  'category',
  'rating',
  'reviews',
  'install',
  'download',
  'downloadFor',
  'android',
  'ios',
  'googlePlay',
  'appStore',
  'downloadForAndroid',
  'downloadForIOS',
  'moreApps',
  'relatedApps',
  'backToApps',
  'searchApps',
  'allCategories',
  'topApps',
  'newApps',
  'popularApps',
  'advertisement',
  'expertAnswer',
  'verifiedExpertsOnly',
  'createAccount',
  'startTrial',
  'getAnswers',
  'joinExpertAnswer',
  'accessExperts'
];

// Idiomas a verificar
const languages = ['no', 'sv', 'fi', 'da', 'de', 'fr', 'es', 'ar'];

async function checkAllTranslations() {
  console.log('🔍 VERIFICACIÓN EXHAUSTIVA DE TRADUCCIONES UI.*');
  console.log(`📋 Verificando ${requiredUiKeys.length} claves en ${languages.length} idiomas\n`);
  
  const missingTranslations = {};
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, `../client/src/translations/${lang}.json`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const translations = JSON.parse(content);
      
      console.log(`🌐 Verificando ${lang.toUpperCase()}:`);
      
      const missing = [];
      const uiSection = translations.ui || {};
      
      for (const key of requiredUiKeys) {
        if (!uiSection[key]) {
          missing.push(key);
        }
      }
      
      if (missing.length > 0) {
        console.log(`  ❌ FALTAN ${missing.length} traducciones:`);
        missing.forEach(key => console.log(`     - ui.${key}`));
        missingTranslations[lang] = missing;
      } else {
        console.log(`  ✅ COMPLETO - todas las traducciones presentes`);
      }
      
    } catch (error) {
      console.log(`  ❌ ERROR leyendo ${lang}: ${error.message}`);
      missingTranslations[lang] = requiredUiKeys; // Mark all as missing if file is unreadable
    }
    
    console.log('');
  }
  
  if (Object.keys(missingTranslations).length > 0) {
    console.log('🚨 RESUMEN DE TRADUCCIONES FALTANTES:');
    for (const [lang, keys] of Object.entries(missingTranslations)) {
      console.log(`${lang}: ${keys.length} faltantes`);
    }
    return missingTranslations;
  } else {
    console.log('✅ TODAS LAS TRADUCCIONES ESTÁN COMPLETAS');
    return null;
  }
}

checkAllTranslations();