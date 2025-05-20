import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/StaticLanguageContext';
import { detectBrowserLanguage } from '../services/translationService';
import { getTranslation, SupportedLanguage, translations } from '../translations/dictionary';

// Caché local para almacenar traducciones
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Hook personalizado para traducir textos dinámicamente
 * @param text Texto a traducir
 * @param sourceLang Idioma de origen (opcional, por defecto detecta el idioma del navegador o usa 'en')
 * @returns El texto traducido y un indicador de carga
 */
export function useTranslation(text: string, sourceLang?: string) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const sourceLanguage = sourceLang || 'en'; // Por defecto usamos inglés como idioma de origen
  
  // Normalizar códigos de idioma
  const normalizedTarget = language.toLowerCase().split('-')[0];
  const normalizedSource = sourceLanguage.toLowerCase().split('-')[0];

  useEffect(() => {
    // Si no hay texto, no necesitamos traducir
    if (!text || text.length < 5) {
      setTranslatedText(text);
      return;
    }
    
    // Si el idioma de origen y destino son el mismo, no es necesario traducir
    if (normalizedSource === normalizedTarget) {
      setTranslatedText(text);
      return;
    }

    // 1. Verificar si el texto está en nuestro diccionario local de traducciones
    // Si parece ser una clave de traducción (como 'nav.home', 'appDetail.description', etc.)
    if (/^[a-zA-Z0-9.]+$/.test(text) && text.includes('.')) {
      const localTranslation = getTranslation(text, normalizedTarget as SupportedLanguage);
      if (localTranslation !== text) {
        setTranslatedText(localTranslation);
        return;
      }
    }

    // 2. Verificar si ya tenemos esta traducción en caché
    const cacheKey = `${normalizedSource}_${normalizedTarget}`;
    if (translationCache[cacheKey]?.[text]) {
      setTranslatedText(translationCache[cacheKey][text]);
      return;
    }

    // 3. Usar el servicio de traducción remoto
    const translateText = async () => {
      setIsLoading(true);
      try {
        // Primero revisamos si hay algún texto similar en nuestro diccionario
        // Esto es útil para descripciones de apps que pueden contener frases comunes
        const appKeys = Object.keys(translations.en).filter(key => key.startsWith('app.'));
        for (const key of appKeys) {
          if (text.toLowerCase().includes(translations.en[key].toLowerCase())) {
            // Si el texto contiene una frase común, usamos la traducción del diccionario
            const localTranslation = getTranslation(key, normalizedTarget as SupportedLanguage);
            if (localTranslation) {
              // Almacenar en caché
              if (!translationCache[cacheKey]) {
                translationCache[cacheKey] = {};
              }
              translationCache[cacheKey][text] = localTranslation;
              
              setTranslatedText(localTranslation);
              setIsLoading(false);
              return;
            }
          }
        }

        // Si no encontramos nada en el diccionario, usar la API
        const response = await axios.post('/api/translate', {
          text,
          targetLang: normalizedTarget,
          sourceLang: normalizedSource
        });

        if (response.data && response.data.translatedText) {
          // Almacenar en caché
          if (!translationCache[cacheKey]) {
            translationCache[cacheKey] = {};
          }
          translationCache[cacheKey][text] = response.data.translatedText;
          
          setTranslatedText(response.data.translatedText);
        } else {
          setTranslatedText(text);
        }
      } catch (error) {
        console.error('Error al traducir texto:', error);
        
        // En caso de error con el servicio de traducción, intentamos buscar traducción parcial
        // en nuestro diccionario local para frases comunes
        let bestMatch = '';
        let matchScore = 0;
        
        // Buscar coincidencias parciales en el diccionario
        for (const key of Object.keys(translations.en)) {
          const value = translations.en[key];
          if (typeof value === 'string' && value.length > 5) {
            const commonWords = text.toLowerCase().split(' ')
              .filter(word => value.toLowerCase().includes(word))
              .length;
            
            if (commonWords > matchScore) {
              matchScore = commonWords;
              bestMatch = key;
            }
          }
        }
        
        // Si encontramos una coincidencia parcial, usar esa traducción
        if (bestMatch && matchScore > 2) {
          const partialTranslation = getTranslation(bestMatch, normalizedTarget as SupportedLanguage);
          if (partialTranslation) {
            setTranslatedText(partialTranslation);
          } else {
            setTranslatedText(text); // Usar el texto original si no hay coincidencia
          }
        } else {
          setTranslatedText(text); // Usar el texto original si no hay coincidencia
        }
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, normalizedTarget, normalizedSource]);

  return { translatedText, isLoading };
}