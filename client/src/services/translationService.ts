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
 * Traduce un texto al idioma especificado usando el API del servidor
 * @param text Texto a traducir
 * @param targetLang Código del idioma de destino (ej. 'ES', 'EN', 'FR')
 * @returns Texto traducido o el texto original si hay un error
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Evitar traducir texto demasiado corto o que parece ser un identificador
  if (text.length < 5 || text.includes('.') || !containsRealText(text)) {
    return text;
  }
  
  // Si ya está en inglés y el destino es inglés, no necesitamos traducir
  if (targetLang.toLowerCase() === 'en' && isEnglish(text)) {
    return text;
  }
  
  // Verificar si ya tenemos esta traducción en caché
  if (translationCache[targetLang]?.[text]) {
    return translationCache[targetLang][text];
  }
  
  try {
    // Usar la API del servidor para traducir el texto
    const response = await axios.post('/api/translate', {
      text,
      targetLang
    });
    
    if (response.data && response.data.translatedText) {
      const translatedText = response.data.translatedText;
      
      // Guardar en caché
      if (!translationCache[targetLang]) {
        translationCache[targetLang] = {};
      }
      translationCache[targetLang][text] = translatedText;
      
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
 * Intenta determinar si un texto ya está en inglés para evitar traducciones innecesarias
 */
const isEnglish = (text: string): boolean => {
  // Lista de palabras comunes en inglés para hacer una detección simple
  const commonEnglishWords = ['the', 'and', 'is', 'in', 'it', 'you', 'that', 'this', 'with', 'for', 'on', 'at', 'to', 'from', 'by'];
  
  // Contar cuántas palabras comunes en inglés contiene el texto
  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter(word => commonEnglishWords.includes(word)).length;
  
  // Si más del 15% de las palabras son comunes en inglés, asumimos que el texto ya está en inglés
  return englishWordCount > 0 && (englishWordCount / words.length) > 0.15;
};

/**
 * Traduce un conjunto de textos en un lote
 * @param texts Array de textos a traducir
 * @param targetLang Código del idioma de destino
 * @returns Array con los textos traducidos
 */
export const translateBulk = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (!texts || texts.length === 0) {
    return [];
  }
  
  try {
    // Usar la API del servidor para traducir los textos en lote
    const response = await axios.post('/api/translate/bulk', {
      texts,
      targetLang
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
 * @returns Objeto con textos traducidos
 */
export const translateObject = async <T extends Record<string, any>>(
  obj: T, 
  targetLang: string
): Promise<T> => {
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
          result[key] = await translateText(value, targetLang) as any;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Usamos type assertion para asegurar que TypeScript entienda que estamos manteniendo el tipo
        result[key] = await translateObject(value, targetLang) as any;
      }
    }
  }
  
  return result;
};