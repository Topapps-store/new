/**
 * DeepL Translation Service
 * 
 * This service manages translations using the DeepL API.
 * It includes caching to minimize API calls and costs.
 */

// Type for supported languages
export type SupportedLanguage = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'JA' | 'ZH';

// Cache interface for storing translations
interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

/**
 * Translate text to the target language using DeepL API
 * 
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
  // Don't translate empty text
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Create a cache key
  const cacheKey = text.substring(0, 100); // Use first 100 chars as key to avoid huge keys
  
  // Check if this text has been translated before
  if (translationCache[cacheKey] && translationCache[cacheKey][targetLang]) {
    console.log('[Translation] Cache hit for:', cacheKey);
    return translationCache[cacheKey][targetLang];
  }
  
  // Verify API key is available
  if (!process.env.DEEPL_API_KEY) {
    console.error('[Translation] Missing DEEPL_API_KEY environment variable');
    return text; // Return original text if no API key
  }
  
  try {
    const apiUrl = 'https://api-free.deepl.com/v2/translate';
    
    // Prepare API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        source_lang: sourceLang,
        // Preserve formatting and don't translate proper nouns
        preserve_formatting: true,
      }),
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Translation] DeepL API error:', response.status, errorData);
      return text; // Return original text on error
    }
    
    const data = await response.json();
    
    // Extract translated text
    if (data.translations && data.translations.length > 0) {
      const translatedText = data.translations[0].text;
      
      // Cache the result
      if (!translationCache[cacheKey]) {
        translationCache[cacheKey] = {};
      }
      translationCache[cacheKey][targetLang] = translatedText;
      
      return translatedText;
    }
    
    return text; // Fallback to original text
  } catch (error) {
    console.error('[Translation] Error translating text:', error);
    return text; // Return original text on exception
  }
}

/**
 * Translate multiple texts in bulk
 * 
 * @param texts Array of texts to translate
 * @param targetLang Target language code
 * @returns Array of translated texts
 */
export async function bulkTranslate(
  texts: string[],
  targetLang: SupportedLanguage
): Promise<string[]> {
  // Filter out empty texts
  const validTexts = texts.filter(text => text && text.trim() !== '');
  
  if (validTexts.length === 0) {
    return texts;
  }
  
  // For small batches, just translate each text individually
  if (validTexts.length <= 5) {
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang))
    );
    return translations;
  }
  
  // For larger batches, use the DeepL API bulk endpoint
  try {
    if (!process.env.DEEPL_API_KEY) {
      console.error('[Translation] Missing DEEPL_API_KEY environment variable');
      return texts;
    }
    
    const apiUrl = 'https://api-free.deepl.com/v2/translate';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: validTexts,
        target_lang: targetLang,
        preserve_formatting: true,
      }),
    });
    
    if (!response.ok) {
      console.error('[Translation] DeepL API bulk error:', response.status);
      return texts;
    }
    
    const data = await response.json();
    
    if (data.translations && data.translations.length === validTexts.length) {
      // Update the translation cache for each text
      validTexts.forEach((text, i) => {
        const cacheKey = text.substring(0, 100);
        if (!translationCache[cacheKey]) {
          translationCache[cacheKey] = {};
        }
        translationCache[cacheKey][targetLang] = data.translations[i].text;
      });
      
      // Map the original array structure, translating only non-empty texts
      return texts.map(text => {
        if (!text || text.trim() === '') return text;
        const index = validTexts.indexOf(text);
        return index >= 0 ? data.translations[index].text : text;
      });
    }
    
    return texts;
  } catch (error) {
    console.error('[Translation] Error in bulk translation:', error);
    return texts;
  }
}

/**
 * Detect language from browser locale
 * 
 * @param locale Browser locale string (e.g., 'en-US', 'es-ES')
 * @returns SupportedLanguage code
 */
export function detectLanguageFromLocale(locale: string): SupportedLanguage {
  const lang = locale.split('-')[0].toUpperCase();
  
  // Map browser language to supported language
  const langMap: { [key: string]: SupportedLanguage } = {
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
  
  return langMap[lang] || 'EN'; // Default to English
}