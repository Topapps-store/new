import { useState, useEffect } from 'react';
import esTranslations from '../locales/es.json';

type TranslationKey = keyof typeof esTranslations;
type NestedTranslationKey<T> = T extends object ? {
  [K in keyof T]: T[K] extends object ? `${string & K}.${string & keyof T[K]}` : string & K;
}[keyof T] : never;

type AllTranslationKeys = NestedTranslationKey<typeof esTranslations>;

export function useTranslation() {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Detectar idioma del navegador
    const browserLang = navigator.language.toLowerCase();
    const langCode = browserLang.split('-')[0];
    
    // Detectar si es español o catalán
    if (langCode === 'es' || langCode === 'ca') {
      setLocale('es');
    } else {
      setLocale('en');
    }
  }, []);

  const t = (key: AllTranslationKeys, fallback?: string): string => {
    if (locale === 'en') {
      return fallback || key;
    }

    // Navegar por el objeto de traducciones usando la clave con puntos
    const keys = key.split('.');
    let value: any = esTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key);
  };

  const isSpanish = locale === 'es';

  return { t, locale, isSpanish };
}