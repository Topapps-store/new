import { useState, useEffect } from 'react';
import esTranslations from '../locales/es.json';
import deTranslations from '../translations/de.json';

type TranslationKey = keyof typeof esTranslations;
type NestedTranslationKey<T> = T extends object ? {
  [K in keyof T]: T[K] extends object ? `${string & K}.${string & keyof T[K]}` : string & K;
}[keyof T] : never;

type AllTranslationKeys = NestedTranslationKey<typeof esTranslations>;

export function useTranslation() {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Detectar idioma del navegador o desde la URL
    const browserLang = navigator.language.toLowerCase();
    const langCode = browserLang.split('-')[0];
    const urlPath = window.location.pathname;
    
    // Detectar desde la URL primero
    if (urlPath.startsWith('/de/') || urlPath.startsWith('/de')) {
      setLocale('de');
    } else if (urlPath.startsWith('/es/') || urlPath.startsWith('/es')) {
      setLocale('es');
    } else if (langCode === 'de') {
      setLocale('de');
    } else if (langCode === 'es' || langCode === 'ca') {
      setLocale('es');
    } else {
      setLocale('en');
    }
  }, []);

  const t = (key: AllTranslationKeys, fallback?: string): string => {
    // Debug logging
    console.log('Translation request:', { key, locale, fallback });
    
    if (locale === 'en') {
      return fallback || key;
    }

    // Seleccionar el archivo de traducciones correcto
    const translations = locale === 'de' ? deTranslations : esTranslations;
    console.log('Using translations for locale:', locale, translations);

    // Navegar por el objeto de traducciones usando la clave con puntos
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.log('Translation key not found:', key, 'at segment:', k);
        return fallback || key;
      }
    }
    
    const result = typeof value === 'string' ? value : (fallback || key);
    console.log('Translation result:', result);
    return result;
  };

  const isSpanish = locale === 'es';
  const isGerman = locale === 'de';

  return { t, locale, isSpanish, isGerman };
}