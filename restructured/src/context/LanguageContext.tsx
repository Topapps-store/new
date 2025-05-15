import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Supported languages
export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'JA' | 'ZH';

interface LanguageContextType {
  language: Language;
  translateText: (text: string) => Promise<string>;
  translateMultiple: (texts: string[]) => Promise<string[]>;
  detectedLanguage: Language;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  translateText: async (text) => text,
  translateMultiple: async (texts) => texts,
  detectedLanguage: 'EN',
});

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // State for current language and detected browser language
  const [language, setLanguage] = useState<Language>('EN');
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('EN');
  
  // Translation cache to minimize API calls
  const [translationCache, setTranslationCache] = useState<{
    [text: string]: { [lang: string]: string };
  }>({});
  
  // Detect language from browser on mount
  useEffect(() => {
    const detectBrowserLanguage = () => {
      try {
        const browserLang = navigator.language || (navigator as any).userLanguage;
        const lang = browserLang.split('-')[0].toUpperCase() as Language;
        
        // Map to supported languages
        const supportedLangs: Record<string, Language> = {
          'EN': 'EN',
          'ES': 'ES',
          'FR': 'FR',
          'DE': 'DE',
          'IT': 'IT',
          'PT': 'PT',
          'RU': 'RU',
          'JA': 'JA',
          'ZH': 'ZH',
        };
        
        const detectedLang = supportedLangs[lang] || 'EN';
        setDetectedLanguage(detectedLang);
        setLanguage(detectedLang);
      } catch (error) {
        console.error('Error detecting browser language:', error);
        setDetectedLanguage('EN');
        setLanguage('EN');
      }
    };
    
    detectBrowserLanguage();
  }, []);
  
  // Translate a single text
  const translateText = useCallback(async (text: string): Promise<string> => {
    // Don't translate empty strings
    if (!text || text.trim() === '') {
      return text;
    }
    
    // Use English if the detected language is the same as the target language
    if (language === 'EN' || language === detectedLanguage) {
      return text;
    }
    
    // Check cache first
    const cacheKey = text.substring(0, 100); // Use first 100 chars as key
    if (translationCache[cacheKey]?.[language]) {
      return translationCache[cacheKey][language];
    }
    
    try {
      // Call API for translation
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang: language,
        }),
      });
      
      if (!response.ok) {
        console.error('Translation API error:', response.statusText);
        return text;
      }
      
      const data = await response.json();
      const translatedText = data.translation || text;
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: {
          ...(prev[cacheKey] || {}),
          [language]: translatedText,
        },
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, [language, detectedLanguage, translationCache]);
  
  // Translate multiple texts at once
  const translateMultiple = useCallback(async (texts: string[]): Promise<string[]> => {
    // Filter out empty strings
    const nonEmptyTexts = texts.filter(text => text && text.trim() !== '');
    
    // Use English if the detected language is the same as the target language
    if (language === 'EN' || language === detectedLanguage || nonEmptyTexts.length === 0) {
      return texts;
    }
    
    try {
      // Call API for batch translation
      const response = await fetch('/api/translate/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: nonEmptyTexts,
          targetLang: language,
        }),
      });
      
      if (!response.ok) {
        console.error('Batch translation API error:', response.statusText);
        return texts;
      }
      
      const data = await response.json();
      const translatedTexts = data.translations || nonEmptyTexts;
      
      // Update cache for each text
      const newCache = { ...translationCache };
      nonEmptyTexts.forEach((text, index) => {
        const cacheKey = text.substring(0, 100);
        if (!newCache[cacheKey]) {
          newCache[cacheKey] = {};
        }
        newCache[cacheKey][language] = translatedTexts[index];
      });
      
      setTranslationCache(newCache);
      
      // Return translated texts in the original order
      return texts.map(text => {
        if (!text || text.trim() === '') {
          return text;
        }
        
        const index = nonEmptyTexts.indexOf(text);
        return index >= 0 ? translatedTexts[index] : text;
      });
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    }
  }, [language, detectedLanguage, translationCache]);
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        translateText,
        translateMultiple,
        detectedLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  const context = React.useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}