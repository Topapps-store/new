import { useState, useEffect } from 'react';
import esTranslations from '../locales/es.json';
import arLocales from '../locales/ar.json';
import deTranslations from '../translations/de.json';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';
import daTranslations from '../translations/da.json';
import svTranslations from '../translations/sv.json';
import fiTranslations from '../translations/fi.json';
import noTranslations from '../translations/no.json';
import ptTranslations from '../translations/pt.json';
import roTranslations from '../translations/ro.json';
import huTranslations from '../translations/hu.json';
import arTranslations from '../translations/ar.json';

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
    
    console.log('🌐 Language detection:', { browserLang, langCode, urlPath });
    
    // Detectar desde la URL primero
    if (urlPath.startsWith('/de/') || urlPath.startsWith('/de')) {
      setLocale('de');
    } else if (urlPath.startsWith('/es/') || urlPath.startsWith('/es')) {
      setLocale('es');
    } else if (urlPath.startsWith('/fr/') || urlPath.startsWith('/fr')) {
      setLocale('fr');
    } else if (urlPath.startsWith('/da/') || urlPath.startsWith('/da')) {
      setLocale('da');
    } else if (urlPath.startsWith('/sv/') || urlPath.startsWith('/sv')) {
      setLocale('sv');
    } else if (urlPath.startsWith('/fi/') || urlPath.startsWith('/fi')) {
      setLocale('fi');
    } else if (urlPath.startsWith('/no/') || urlPath.startsWith('/no')) {
      setLocale('no');
    } else if (urlPath.startsWith('/pt/') || urlPath.startsWith('/pt')) {
      setLocale('pt');
    } else if (urlPath.startsWith('/ro/') || urlPath.startsWith('/ro')) {
      setLocale('ro');
    } else if (urlPath.startsWith('/hu/') || urlPath.startsWith('/hu')) {
      setLocale('hu');
    } else if (urlPath.startsWith('/ar/') || urlPath.startsWith('/ar')) {
      setLocale('ar');
    } else if (langCode === 'de') {
      setLocale('de');
    } else if (langCode === 'es' || langCode === 'ca') {
      setLocale('es');
    } else if (langCode === 'fr') {
      setLocale('fr');
    } else if (langCode === 'da') {
      setLocale('da');
    } else if (langCode === 'sv') {
      setLocale('sv');
    } else if (langCode === 'fi') {
      setLocale('fi');
    } else if (langCode === 'no' || langCode === 'nb' || langCode === 'nn') {
      setLocale('no');
    } else if (langCode === 'pt') {
      setLocale('pt');
    } else if (langCode === 'ro') {
      setLocale('ro');
    } else if (langCode === 'hu') {
      setLocale('hu');
    } else if (langCode === 'ar') {
      setLocale('ar');
    } else {
      setLocale('en');
    }
  }, []);

  const t = (key: AllTranslationKeys, fallback?: string): string => {
    // Debug logging
    console.log('Translation request:', { key, locale, fallback });
    
    // Seleccionar el archivo de traducciones correcto
    let translations;
    switch (locale) {
      case 'en':
        translations = enTranslations;
        break;
      case 'de':
        translations = deTranslations;
        break;
      case 'fr':
        translations = frTranslations;
        break;
      case 'da':
        translations = daTranslations;
        break;
      case 'sv':
        translations = svTranslations;
        break;
      case 'fi':
        translations = fiTranslations;
        break;
      case 'no':
        translations = noTranslations;
        break;
      case 'pt':
        translations = ptTranslations;
        break;
      case 'ro':
        translations = roTranslations;
        break;
      case 'hu':
        translations = huTranslations;
        break;
      case 'ar':
        translations = arTranslations;
        break;
      case 'es':
      default:
        translations = esTranslations;
        break;
    }
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