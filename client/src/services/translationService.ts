import axios from 'axios';

// Caché para almacenar traducciones previamente realizadas
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Inicializa el servicio de traducción
 */
export const initializeTranslator = async (): Promise<void> => {
  try {
    console.log('Servicio de traducción inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el servicio de traducción:', error);
  }
};

/**
 * Detecta el idioma del navegador con un enfoque más completo
 * @returns El código de idioma del navegador (ej. 'es', 'en', 'fr')
 */
export const detectBrowserLanguage = (): string => {
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar', 'nl'];
  
  // Intentar obtener el idioma del navegador
  if (typeof navigator !== 'undefined') {
    try {
      // 1. Intentar con localStorage si está disponible (para recordar la preferencia del usuario)
      if (typeof localStorage !== 'undefined') {
        const storedLanguage = localStorage.getItem('preferredLanguage');
        if (storedLanguage) {
          const normalized = storedLanguage.toLowerCase().split('-')[0];
          if (supportedLanguages.includes(normalized)) {
            return normalized;
          }
        }
      }
      
      // 2. Comprobar navegadores que utilizan propiedades específicas
      // Algunos navegadores tienen userLanguage o browserLanguage
      const anyNavigator = navigator as any;
      if (anyNavigator.userLanguage) {
        const normalized = anyNavigator.userLanguage.toLowerCase().split('-')[0];
        if (supportedLanguages.includes(normalized)) {
          return normalized;
        }
      }
      
      // 3. Usar navigator.language (estándar)
      if (navigator.language) {
        const normalized = navigator.language.toLowerCase().split('-')[0];
        if (supportedLanguages.includes(normalized)) {
          return normalized;
        }
      }
      
      // 4. Probar navigator.languages (array de idiomas preferidos)
      if (navigator.languages && navigator.languages.length > 0) {
        // Iterar por la lista de idiomas preferidos
        for (const lang of navigator.languages) {
          const normalized = lang.toLowerCase().split('-')[0];
          if (supportedLanguages.includes(normalized)) {
            return normalized;
          }
        }
      }
    } catch (error) {
      console.error('Error al detectar idioma del navegador:', error);
    }
  }
  
  // Si ninguno de los métodos anteriores funciona o el idioma no está soportado,
  // devolver inglés por defecto
  return 'en';
};

/**
 * Traduce un texto al idioma especificado usando el API del servidor
 * @param text Texto a traducir
 * @param targetLang Código del idioma de destino (ej. 'es', 'en', 'fr')
 * @param sourceLang Código del idioma de origen (por defecto 'en')
 * @returns Texto traducido o el texto original si hay un error
 */
export const translateText = async (text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> => {
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Evitar traducir texto demasiado corto o que parece ser un identificador
  if (text.length < 5 || text.includes('.') || !containsRealText(text)) {
    return text;
  }
  
  // Normalizar códigos de idioma
  const normalizedTarget = targetLang.toLowerCase().split('-')[0];
  const normalizedSource = sourceLang.toLowerCase().split('-')[0];
  
  // Si el idioma de origen y destino son el mismo, no es necesario traducir
  if (normalizedSource === normalizedTarget) {
    return text;
  }
  
  // Verificar si ya tenemos esta traducción en caché
  if (translationCache[normalizedTarget]?.[text]) {
    return translationCache[normalizedTarget][text];
  }
  
  try {
    // Usar la API del servidor para traducir el texto
    const response = await axios.post('/api/translate', {
      text,
      targetLang: normalizedTarget,
      sourceLang: normalizedSource
    });
    
    if (response.data && response.data.translatedText) {
      const translatedText = response.data.translatedText;
      
      // Guardar en caché
      if (!translationCache[normalizedTarget]) {
        translationCache[normalizedTarget] = {};
      }
      translationCache[normalizedTarget][text] = translatedText;
      
      return translatedText;
    }
    
    return text;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    return text;
  }
};

/**
 * Determina si el texto contiene contenido real para traducir
 * (evita traducir códigos, identificadores, etc.)
 */
const containsRealText = (text: string): boolean => {
  // Evitar traducir textos que parecen identificadores o rutas
  if (/^[a-zA-Z0-9_/.]+$/.test(text)) {
    return false;
  }
  
  // Evitar traducir URLs
  if (text.startsWith('http') || text.startsWith('www.')) {
    return false;
  }
  
  return true;
};

/**
 * Traduce un conjunto de textos en un lote
 * @param texts Array de textos a traducir
 * @param targetLang Código del idioma de destino
 * @param sourceLang Código del idioma de origen (por defecto 'en')
 * @returns Array con los textos traducidos
 */
export const translateBulk = async (texts: string[], targetLang: string, sourceLang: string = 'en'): Promise<string[]> => {
  if (!texts || texts.length === 0) {
    return [];
  }
  
  // Normalizar códigos de idioma
  const normalizedTarget = targetLang.toLowerCase().split('-')[0];
  const normalizedSource = sourceLang.toLowerCase().split('-')[0];
  
  // Si los idiomas son iguales, no es necesario traducir
  if (normalizedSource === normalizedTarget) {
    return texts;
  }
  
  try {
    // Usar la API del servidor para traducir los textos en lote
    const response = await axios.post('/api/translate/bulk', {
      texts,
      targetLang: normalizedTarget,
      sourceLang: normalizedSource
    });
    
    if (response.data && response.data.translatedTexts) {
      return response.data.translatedTexts;
    }
    
    return texts;
  } catch (error) {
    console.error('Error al traducir textos en lote:', error);
    return texts;
  }
};

/**
 * Traduce un objeto completo al idioma especificado
 * @param obj Objeto a traducir
 * @param targetLang Código del idioma de destino
 * @param sourceLang Código del idioma de origen (por defecto 'en')
 * @returns Objeto con textos traducidos
 */
export const translateObject = async <T extends Record<string, any>>(
  obj: T, 
  targetLang: string,
  sourceLang: string = 'en'
): Promise<T> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Normalizar códigos de idioma
  const normalizedTarget = targetLang.toLowerCase().split('-')[0];
  const normalizedSource = sourceLang.toLowerCase().split('-')[0];
  
  // Si los idiomas son iguales, no es necesario traducir
  if (normalizedSource === normalizedTarget) {
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
          result[key] = await translateText(value, normalizedTarget, normalizedSource) as any;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Usamos type assertion para asegurar que TypeScript entienda que estamos manteniendo el tipo
        result[key] = await translateObject(value, normalizedTarget, normalizedSource) as any;
      }
    }
  }
  
  return result;
};