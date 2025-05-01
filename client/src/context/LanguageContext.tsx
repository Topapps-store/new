import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Import translations
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import frTranslations from '../translations/fr.json';

// Type for supported languages
export type Language = 'en' | 'es' | 'fr';

// Type for translation object
type TranslationObject = Record<string, any>;

// Type for context value
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, TranslationObject> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

// Function to get browser language
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return (browserLang === 'en' || browserLang === 'es' || browserLang === 'fr') 
    ? browserLang as Language 
    : 'en';
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get language from localStorage or use browser language as fallback
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage || getBrowserLanguage();
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value: any = translations[language];
    
    // Navigate through the nested object
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // If key not found, return the key itself (for debugging purposes)
        return key;
      }
    }
    
    // Replace dynamic values like {year} with actual values
    if (typeof value === 'string') {
      value = value.replace('{year}', new Date().getFullYear().toString());
      return value;
    }
    
    // If value is not a string, convert it to string or return the key
    return typeof value === 'object' ? key : String(value);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};