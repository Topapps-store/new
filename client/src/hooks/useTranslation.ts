import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/StaticLanguageContext';
import { detectBrowserLanguage } from '../services/translationService';

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

    // Verificar si ya tenemos esta traducción en caché
    const cacheKey = `${normalizedSource}_${normalizedTarget}`;
    if (translationCache[cacheKey]?.[text]) {
      setTranslatedText(translationCache[cacheKey][text]);
      return;
    }

    // Función para traducir texto
    const translateText = async () => {
      setIsLoading(true);
      try {
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
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, normalizedTarget, normalizedSource]);

  return { translatedText, isLoading };
}