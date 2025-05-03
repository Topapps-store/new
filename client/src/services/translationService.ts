// Define the supported languages type
type SupportedLanguage = 'en' | 'es' | 'fr';

// Define the translation dictionary type with proper indexing
type TranslationDictionary = {
  [key in SupportedLanguage]: {
    [key: string]: string;
  };
};

// Translation dictionary for frequently used terms
const TRANSLATION_DICTIONARY: TranslationDictionary = {
  en: {
    // English is the source language
  },
  es: {
    // Spanish translations for common terms
    "Download": "Descargar",
    "Free": "Gratis",
    "Latest": "Más Reciente",
    "Updated": "Actualizado",
    "Version": "Versión",
    "Size": "Tamaño",
    "Rating": "Calificación",
    "Developer": "Desarrollador",
    "Requires": "Requiere",
    "Android": "Android",
    "iOS": "iOS",
    "Description": "Descripción",
    "Screenshots": "Capturas de Pantalla",
    "Information": "Información",
    "Reviews": "Reseñas",
    "No reviews available": "No hay reseñas disponibles",
    "Read More": "Leer Más",
    "See Less": "Ver Menos",
    "Download Now": "Descargar Ahora",
    "Get it on": "Conseguir en",
    "Google Play": "Google Play",
    "App Store": "App Store",
  },
  fr: {
    // French translations for common terms
    "Download": "Télécharger",
    "Free": "Gratuit",
    "Latest": "Plus Récent",
    "Updated": "Mis à jour",
    "Version": "Version",
    "Size": "Taille",
    "Rating": "Évaluation",
    "Developer": "Développeur",
    "Requires": "Nécessite",
    "Android": "Android",
    "iOS": "iOS",
    "Description": "Description",
    "Screenshots": "Captures d'écran",
    "Information": "Information",
    "Reviews": "Avis",
    "No reviews available": "Aucun avis disponible",
    "Read More": "Lire Plus",
    "See Less": "Voir Moins",
    "Download Now": "Télécharger Maintenant",
    "Get it on": "Obtenir sur",
    "Google Play": "Google Play",
    "App Store": "App Store",
  }
};

// Simple rule-based translation function
function translateWithRules(text: string, targetLanguage: SupportedLanguage): string {
  if (targetLanguage === 'en') return text; // No translation needed
  
  // Check if the text is in our dictionary for direct translation
  if (TRANSLATION_DICTIONARY[targetLanguage] && text in TRANSLATION_DICTIONARY[targetLanguage]) {
    return TRANSLATION_DICTIONARY[targetLanguage][text];
  }
  
  // For longer texts, apply simple rule-based translations
  if (targetLanguage === 'es') {
    // Basic Spanish transformations
    return text
      .replace(/(\w+)ing\b/g, '$1ando') // Converting -ing to -ando
      .replace(/\bthe\b/gi, 'el')
      .replace(/\bto\b/gi, 'para')
      .replace(/\band\b/gi, 'y')
      .replace(/\bwith\b/gi, 'con')
      .replace(/\bin\b/gi, 'en')
      .replace(/\bof\b/gi, 'de')
      .replace(/\bfor\b/gi, 'para')
      .replace(/\byou\b/gi, 'tu')
      .replace(/\bcan\b/gi, 'puedes')
      .replace(/\bhave\b/gi, 'tener')
      .replace(/\bget\b/gi, 'obtener')
      .replace(/\bapp\b/gi, 'aplicación')
      .replace(/\bapps\b/gi, 'aplicaciones')
      .replace(/\buser\b/gi, 'usuario')
      .replace(/\busers\b/gi, 'usuarios')
      .replace(/\bfeature\b/gi, 'característica')
      .replace(/\bfeatures\b/gi, 'características');
  } else if (targetLanguage === 'fr') {
    // Basic French transformations
    return text
      .replace(/(\w+)ing\b/g, '$1ant') // Converting -ing to -ant
      .replace(/\bthe\b/gi, 'le')
      .replace(/\bto\b/gi, 'pour')
      .replace(/\band\b/gi, 'et')
      .replace(/\bwith\b/gi, 'avec')
      .replace(/\bin\b/gi, 'dans')
      .replace(/\bof\b/gi, 'de')
      .replace(/\bfor\b/gi, 'pour')
      .replace(/\byou\b/gi, 'vous')
      .replace(/\bcan\b/gi, 'pouvez')
      .replace(/\bhave\b/gi, 'avoir')
      .replace(/\bget\b/gi, 'obtenir')
      .replace(/\bapp\b/gi, 'application')
      .replace(/\bapps\b/gi, 'applications')
      .replace(/\buser\b/gi, 'utilisateur')
      .replace(/\busers\b/gi, 'utilisateurs')
      .replace(/\bfeature\b/gi, 'fonctionnalité')
      .replace(/\bfeatures\b/gi, 'fonctionnalités');
  }
  
  // Return original if no transformations applied
  return text;
}

// Main function to translate any text
export function translateText(text: string, targetLanguage: SupportedLanguage | string): string {
  if (!text || targetLanguage === 'en') return text;
  
  // Cast to the supported language type
  return translateWithRules(text, targetLanguage as SupportedLanguage);
}

// Function to translate app description
export function translateAppDescription(description: string, targetLanguage: SupportedLanguage | string): string {
  if (!description || targetLanguage === 'en') return description;
  
  // Split description by sentences and translate each
  const sentences = description.split(/(?<=[.!?])\s+/);
  const translatedSentences = sentences.map(sentence => 
    translateWithRules(sentence, targetLanguage as SupportedLanguage)
  );
  
  return translatedSentences.join(' ');
}

// Function to translate app information
export function translateAppInfo(info: Record<string, any>, targetLanguage: SupportedLanguage | string): Record<string, any> {
  if (!info || targetLanguage === 'en') return info;
  
  const translatedInfo = { ...info };
  
  // Only translate text fields, not IDs, URLs, or numeric values
  if (translatedInfo.name) translatedInfo.name = translateText(translatedInfo.name, targetLanguage);
  if (translatedInfo.description) translatedInfo.description = translateAppDescription(translatedInfo.description, targetLanguage);
  if (translatedInfo.developer) translatedInfo.developer = translateText(translatedInfo.developer, targetLanguage);
  if (translatedInfo.category) translatedInfo.category = translateText(translatedInfo.category, targetLanguage);
  
  return translatedInfo;
}