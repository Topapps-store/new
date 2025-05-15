import axios from 'axios';
import { log } from './vite';

// DeepL API endpoint
const DEEPL_API_ENDPOINT = 'https://api-free.deepl.com/v2/translate';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Supported languages for translation
type SupportedLanguage = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'JA' | 'ZH';

// Cache for storing translated text to reduce API calls
interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

const translationCache: TranslationCache = {};

/**
 * Translate text to the target language using DeepL API
 * @param text Text to translate
 * @param targetLang Target language code (e.g., 'ES' for Spanish)
 * @param sourceLang Optional source language code
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang?: SupportedLanguage
): Promise<string> {
  try {
    // Skip translation if text is empty or just whitespace
    if (!text || text.trim() === '') {
      return text;
    }

    // Skip translation if target language is English (our default language)
    if (targetLang === 'EN') {
      return text;
    }

    // Check cache first
    const cacheKey = text.toLowerCase().trim();
    if (translationCache[cacheKey] && translationCache[cacheKey][targetLang]) {
      return translationCache[cacheKey][targetLang];
    }

    // If no API key, return original text
    if (!DEEPL_API_KEY) {
      log('Missing DeepL API key', 'warning');
      return text;
    }

    // Call DeepL API
    const response = await axios.post(
      DEEPL_API_ENDPOINT,
      {
        text: [text],
        target_lang: targetLang,
        ...(sourceLang && { source_lang: sourceLang }),
        preserve_formatting: true,
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get translated text
    const translatedText = response.data.translations[0].text;

    // Update cache
    if (!translationCache[cacheKey]) {
      translationCache[cacheKey] = {};
    }
    translationCache[cacheKey][targetLang] = translatedText;

    return translatedText;
  } catch (error) {
    log(`Translation error: ${error}`, 'error');
    return text; // Return original text in case of error
  }
}

/**
 * Translate all app descriptions in bulk
 * @param texts Array of texts to translate
 * @param targetLang Target language code
 * @returns Array of translated texts
 */
export async function bulkTranslate(
  texts: string[],
  targetLang: SupportedLanguage
): Promise<string[]> {
  // Skip if target language is English or no texts
  if (targetLang === 'EN' || texts.length === 0) {
    return texts;
  }

  // If no API key, return original texts
  if (!DEEPL_API_KEY) {
    log('Missing DeepL API key', 'warning');
    return texts;
  }

  try {
    // Filter out texts that are already in cache
    const textsToTranslate: string[] = [];
    const indexMap: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, index) => {
      const cacheKey = text.toLowerCase().trim();
      if (
        text && 
        text.trim() !== '' && 
        !(translationCache[cacheKey] && translationCache[cacheKey][targetLang])
      ) {
        textsToTranslate.push(text);
        indexMap.push(index);
      } else if (translationCache[cacheKey] && translationCache[cacheKey][targetLang]) {
        // If in cache, use cached translation
        results[index] = translationCache[cacheKey][targetLang];
      }
    });

    // If all texts are in cache, return cached results
    if (textsToTranslate.length === 0) {
      return results;
    }

    // Call DeepL API with batch
    const response = await axios.post(
      DEEPL_API_ENDPOINT,
      {
        text: textsToTranslate,
        target_lang: targetLang,
        preserve_formatting: true,
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update results and cache
    response.data.translations.forEach((translation: { text: string }, i: number) => {
      const originalIndex = indexMap[i];
      const originalText = texts[originalIndex];
      const translatedText = translation.text;
      
      results[originalIndex] = translatedText;
      
      // Update cache
      const cacheKey = originalText.toLowerCase().trim();
      if (!translationCache[cacheKey]) {
        translationCache[cacheKey] = {};
      }
      translationCache[cacheKey][targetLang] = translatedText;
    });

    return results;
  } catch (error) {
    log(`Bulk translation error: ${error}`, 'error');
    return texts; // Return original texts in case of error
  }
}