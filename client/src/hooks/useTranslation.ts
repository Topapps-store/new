import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/StaticLanguageContext';

// Caché local para almacenar traducciones
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Hook personalizado para traducir textos dinámicamente
 * @param text Texto a traducir
 * @returns El texto traducido y un indicador de carga
 */
export function useTranslation(text: string) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si no hay texto o está en inglés, no necesitamos traducir
    if (!text || language === 'en' || text.length < 5) {
      setTranslatedText(text);
      return;
    }

    // Verificar si ya tenemos esta traducción en caché
    if (translationCache[language]?.[text]) {
      setTranslatedText(translationCache[language][text]);
      return;
    }

    // Función para traducir texto
    const translateText = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/translate', {
          text,
          targetLang: language
        });

        if (response.data && response.data.translatedText) {
          // Almacenar en caché
          if (!translationCache[language]) {
            translationCache[language] = {};
          }
          translationCache[language][text] = response.data.translatedText;
          
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
  }, [text, language]);

  return { translatedText, isLoading };
}