import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Tipos de lenguajes soportados
export type SupportedLanguage = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'JA' | 'ZH';

// Interfaz del contexto de idioma
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  detectedLanguage: SupportedLanguage;
  isAutoDetect: boolean;
  setAutoDetect: (value: boolean) => void;
  setLanguage: (language: SupportedLanguage) => void;
  translateText: (text: string) => Promise<string>;
}

// Cache de traducciones para mejorar rendimiento
interface TranslationCache {
  [key: string]: {
    [languageCode: string]: string;
  };
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Mapeo de códigos de navegador a nuestros códigos de idioma
const browserLanguageMap: Record<string, SupportedLanguage> = {
  'en': 'EN',
  'es': 'ES',
  'fr': 'FR',
  'de': 'DE',
  'it': 'IT',
  'pt': 'PT',
  'ru': 'RU',
  'ja': 'JA',
  'zh': 'ZH',
};

// Detectar el idioma del navegador
function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'EN';
  
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return browserLanguageMap[browserLang] || 'EN';
}

// Proveedor del contexto de idioma
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('EN');
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>('EN');
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  
  // Cache de traducciones en memoria
  const [translationCache] = useState<TranslationCache>({});
  
  // Detectar idioma al cargar
  useEffect(() => {
    const detected = detectBrowserLanguage();
    setDetectedLanguage(detected);
    
    if (isAutoDetect) {
      setCurrentLanguage(detected);
    }
  }, [isAutoDetect]);
  
  // Función para cambiar el idioma manualmente
  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    setIsAutoDetect(false);
  };
  
  // Función para activar/desactivar detección automática
  const setAutoDetect = (value: boolean) => {
    setIsAutoDetect(value);
    if (value) {
      setCurrentLanguage(detectedLanguage);
    }
  };
  
  // Función para traducir texto
  const translateText = async (text: string): Promise<string> => {
    // Si el idioma es inglés o el texto está vacío, devolver el texto original
    if (currentLanguage === 'EN' || !text.trim()) {
      return text;
    }
    
    // Verificar si la traducción está en caché
    if (
      translationCache[text] && 
      translationCache[text][currentLanguage]
    ) {
      return translationCache[text][currentLanguage];
    }
    
    try {
      // Realizar la petición de traducción
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang: currentLanguage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      const translatedText = data.translatedText;
      
      // Guardar en caché
      if (!translationCache[text]) {
        translationCache[text] = {};
      }
      translationCache[text][currentLanguage] = translatedText;
      
      return translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: 'Translation Error',
        description: 'Could not translate content. Using original text.',
        variant: 'destructive',
      });
      return text; // Devolver texto original en caso de error
    }
  };
  
  return (
    <LanguageContext.Provider 
      value={{
        currentLanguage,
        detectedLanguage,
        isAutoDetect,
        setAutoDetect,
        setLanguage,
        translateText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Hook para usar el contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}