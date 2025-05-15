import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Import translations
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import frTranslations from '../translations/fr.json';

// Type for supported languages
export type Language = 'en' | 'es' | 'fr';

// Map client language codes to DeepL API language codes
const languageCodeMap: Record<Language, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

// Type for translation object
type TranslationObject = Record<string, any>;

// Type for translation cache
type TranslationCache = Record<string, string>;

// Type for context value
interface LanguageContextType {
  language: Language;
  t: (key: string, params?: Record<string, string>) => string;
}

// Create language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, TranslationObject> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

// Translation cache to avoid unnecessary API calls
const translationCache: Record<Language, TranslationCache> = {
  en: {},
  es: {},
  fr: {},
};

// Function to get browser language
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0];
  return (browserLang === 'en' || browserLang === 'es' || browserLang === 'fr') 
    ? browserLang as Language 
    : 'en';
};

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use browser language by default (no more language selection)
  const [language, setLanguage] = useState<Language>(getBrowserLanguage());

  // Function to translate text using DeepL API
  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '' || targetLang === 'EN') {
      return text;
    }

    // Check cache first
    const cacheKey = text.toLowerCase().trim();
    if (translationCache[language][cacheKey]) {
      return translationCache[language][cacheKey];
    }

    try {
      const response = await axios.post('/api/translate', {
        text,
        targetLang,
      });

      const translatedText = response.data.translatedText;
      
      // Update cache
      translationCache[language][cacheKey] = translatedText;
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text in case of error
    }
  }, [language]);

  // Translation function with support for parameter substitution and automatic translation
  const t = useCallback((key: string, params?: Record<string, string>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value: any = translations['en']; // Always start with English as base
    
    // Navigate through the nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If key not found, return the key itself
        return key;
      }
    }
    
    // If value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace dynamic values like {year} with actual values
    let result = value.replace('{year}', new Date().getFullYear().toString());
    
    // Replace any provided parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    // If language is English, return the result without translation
    if (language === 'en') {
      return result;
    }
    
    // For non-English languages, check if we have the translation in our static files first
    if (language !== 'en') {
      let localizedValue: any = translations[language];
      for (const k of keys) {
        if (localizedValue && typeof localizedValue === 'object' && k in localizedValue) {
          localizedValue = localizedValue[k];
        } else {
          localizedValue = null;
          break;
        }
      }
      
      // If we have a static translation, use it
      if (typeof localizedValue === 'string') {
        let localizedResult = localizedValue.replace('{year}', new Date().getFullYear().toString());
        
        // Replace any provided parameters
        if (params) {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            localizedResult = localizedResult.replace(`{${paramKey}}`, paramValue);
          });
        }
        
        return localizedResult;
      }
    }
    
    // If no static translation available, request translation for this text
    // Start a translation request but return the original text for now
    // (we'll update the UI once the translation arrives)
    translateText(result, languageCodeMap[language])
      .then(translatedText => {
        // This will be handled asynchronously
        // The next time this key is requested, it will be in the cache
      })
      .catch(error => {
        console.error('Translation error:', error);
      });
    
    // Return cached translation if available, otherwise original text
    const cacheKey = result.toLowerCase().trim();
    return translationCache[language][cacheKey] || result;
  }, [language, translateText]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}