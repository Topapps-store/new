import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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
  // Get language from localStorage or use browser language as fallback
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const storedLanguage = localStorage.getItem('language') as Language;
    return (storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'fr') 
      ? storedLanguage 
      : getBrowserLanguage();
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function with support for parameter substitution
  const t = (key: string, params?: Record<string, string>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value: any = translations[language];
    
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
    
    return result;
  };

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