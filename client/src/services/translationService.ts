import axios from 'axios';

// Caché para almacenar traducciones previamente realizadas
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Inicializa el servicio de traducción
 */
export const initializeTranslator = async (): Promise<void> => {
  try {
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
    if (!apiKey) {
      console.error('No se ha proporcionado la clave API de DeepL');
      return;
    }
    
    console.log('Servicio de traducción inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el servicio de traducción:', error);
  }
};

/**
 * Traduce un texto al idioma especificado usando la API REST de DeepL
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
    // Convertir el código de idioma al formato que espera DeepL
    const deeplLang = convertToDeeplLanguage(targetLang);
    
    // Obtener la clave API
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
    if (!apiKey) {
      console.error('No se ha proporcionado la clave API de DeepL');
      return text;
    }
    
    // Hacer la petición a la API de DeepL
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      {
        text: [text],
        target_lang: deeplLang
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.translations && response.data.translations.length > 0) {
      const translatedText = response.data.translations[0].text;
      
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
 * Convierte los códigos de idioma al formato que espera DeepL
 */
const convertToDeeplLanguage = (lang: string): string => {
  // Normalizar el código de idioma (convertir a mayúsculas y eliminar guiones/regiones)
  const normalizedLang = lang.toUpperCase().split('-')[0];
  
  // Mapa de códigos de idioma a códigos DeepL
  const languageMap: { [key: string]: string } = {
    'ES': 'ES',
    'EN': 'EN-US',
    'FR': 'FR',
    'DE': 'DE',
    'IT': 'IT',
    'PT': 'PT-BR',
    'RU': 'RU',
    'JA': 'JA',
    'ZH': 'ZH',
  };
  
  return languageMap[normalizedLang] || 'EN-US';
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