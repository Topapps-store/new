import axios from 'axios';

/**
 * Determina si el texto contiene contenido real para traducir
 * (evita traducir códigos, identificadores, etc.)
 */
function containsRealText(text: string): boolean {
  // Evitar traducir textos que parecen identificadores o rutas
  if (/^[a-zA-Z0-9_/.]+$/.test(text)) {
    return false;
  }
  
  // Evitar traducir URLs
  if (text.startsWith('http') || text.startsWith('www.')) {
    return false;
  }
  
  return true;
}

/**
 * Convierte los códigos de idioma al formato estándar ISO
 */
function normalizeLanguageCode(lang: string): string {
  // Normalizar el código de idioma (convertir a minúsculas y tomar sólo la parte principal)
  const normalizedLang = lang.toLowerCase().split('-')[0];
  
  // Mapa de códigos de idioma soportados por LibreTranslate
  const supportedLanguages = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar', 'nl'
  ];
  
  return supportedLanguages.includes(normalizedLang) ? normalizedLang : 'en';
}

/**
 * Retorna el texto original sin traducir (sistema de traducción desactivado)
 */
export async function translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
  // Simplemente devolvemos el texto original sin intentar traducirlo
  console.log('Sistema de traducción desactivado, devolviendo texto original');
  return text;
}

/**
 * Traduce un objeto completo al idioma especificado
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<T> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const result = { ...obj } as T;
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];
      
      if (typeof value === 'string') {
        // Solo traducir campos que probablemente contengan contenido a traducir
        const fieldsToTranslate = ['name', 'description', 'title', 'content', 'text', 'summary'];
        if (fieldsToTranslate.includes(key) || key.includes('text') || key.includes('description')) {
          // Usamos type assertion para asegurar que TypeScript entienda que estamos manteniendo el tipo
          result[key] = await translateText(value, targetLang, sourceLang) as any;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Usamos type assertion para asegurar que TypeScript entienda que estamos manteniendo el tipo
        result[key] = await translateObject(value, targetLang, sourceLang) as any;
      }
    }
  }
  
  return result;
}

/**
 * Retorna los textos originales sin traducir (sistema de traducción desactivado)
 * @param texts Array de textos (sin traducción)
 * @returns El mismo array de textos sin cambios
 */
export async function bulkTranslate(texts: string[], targetLang: string, sourceLang: string = 'en'): Promise<string[]> {
  // Simplemente devolvemos los textos originales sin traducir
  console.log('Sistema de traducción masiva desactivado, devolviendo textos originales');
  return texts;
}