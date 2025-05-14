import { log } from './vite';
import fetch from 'node-fetch';

// Constantes para la API de DeepL
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// Cache para traducciones ya realizadas para evitar llamadas repetidas a la API
type TranslationCache = {
  [key: string]: {
    [targetLang: string]: string;
  };
};

const translationCache: TranslationCache = {};

/**
 * Verifica si la API de DeepL está configurada correctamente
 */
export function isTranslationAvailable(): boolean {
  return !!process.env.DEEPL_API_KEY;
}

/**
 * Traduce un texto al idioma especificado usando DeepL API
 * @param text Texto a traducir
 * @param targetLanguage Código de idioma de destino (ej: 'ES', 'FR')
 * @returns Texto traducido o el original si no se pudo traducir
 */
export async function translateText(
  text: string,
  targetLanguage: string = 'EN'
): Promise<string> {
  // Si el texto está vacío, devolvemos texto vacío
  if (!text || text.trim() === '') {
    return text;
  }

  // Normalizamos los códigos de idioma (DeepL usa mayúsculas)
  targetLanguage = targetLanguage.substring(0, 2).toUpperCase();

  // Si el idioma de destino es inglés (default) o no tenemos API key, devolvemos el original
  if (targetLanguage === 'EN' || !process.env.DEEPL_API_KEY) {
    return text;
  }

  // Verificamos si ya tenemos esta traducción en caché
  if (
    translationCache[text] &&
    translationCache[text][targetLanguage]
  ) {
    return translationCache[text][targetLanguage];
  }

  try {
    // Hacemos la petición a la API de DeepL
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { translations: { text: string }[] };
    
    if (data.translations && data.translations.length > 0) {
      const translatedText = data.translations[0].text;

      // Guardamos en caché
      if (!translationCache[text]) {
        translationCache[text] = {};
      }
      translationCache[text][targetLanguage] = translatedText;

      log(`Translated text from EN to ${targetLanguage}`, 'debug');
      return translatedText;
    }

    return text;
  } catch (error) {
    log(`Translation error: ${error}`, 'error');
    return text; // En caso de error, devolvemos el texto original
  }
}

/**
 * Traduce un objeto completo de manera recursiva
 * @param obj Objeto a traducir
 * @param targetLanguage Código de idioma de destino
 * @returns Objeto con todos los textos traducidos
 */
export async function translateObject(
  obj: any,
  targetLanguage: string
): Promise<any> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Si es un array, traducimos cada elemento
  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item, targetLanguage));
    }
    return translatedArray;
  }

  // Si es un objeto, traducimos cada propiedad
  const translatedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Campos que NO deben traducirse (IDs, URLs, fechas, etc.)
      const nonTextFields = [
        'id', 'url', 'iconUrl', 'appId', 'categoryId', 'originalAppId', 'googlePlayUrl', 'iosAppStoreUrl', 
        'downloadUrl', 'screenshots', 'rating', 'version', 'size', 'releaseDate', 'lastSyncedAt', 'createdAt', 
        'updatedAt', 'price', 'reviews', 'installs', 'isNotified', 'icon', 'color'
      ];

      // Traducimos TODOS los campos de texto que no estén en la lista de exclusión
      if (typeof value === 'string' && !nonTextFields.includes(key)) {
        // Solo traducimos si el texto tiene al menos 3 caracteres y no es solo números
        if (value.length > 2 && !/^\d+$/.test(value)) {
          translatedObj[key] = await translateText(value, targetLanguage);
        } else {
          translatedObj[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        translatedObj[key] = await translateObject(value, targetLanguage);
      } else {
        translatedObj[key] = value;
      }
    }
  }

  return translatedObj;
}

/**
 * Procesa las cabeceras HTTP para detectar el idioma preferido del usuario
 * @param acceptLanguageHeader El header Accept-Language de la petición HTTP
 * @returns El código de idioma detectado, 'en' por defecto
 */
export function detectLanguageFromHeader(acceptLanguageHeader?: string): string {
  if (!acceptLanguageHeader) {
    return 'en';
  }

  // Parseamos el header Accept-Language
  const languages = acceptLanguageHeader
    .split(',')
    .map(lang => {
      const [code, qualityStr] = lang.trim().split(';q=');
      const quality = qualityStr ? parseFloat(qualityStr) : 1.0;
      return { code: code.substring(0, 2).toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Idiomas soportados
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];

  // Retornamos el primer idioma soportado
  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code)) {
      return lang.code;
    }
  }

  // Por defecto inglés
  return 'en';
}