import axios from 'axios';

/**
 * Servicio para traducir textos utilizando la API de DeepL
 */
export async function translateText(text: string, targetLang: string, sourceLang?: string): Promise<string> {
  try {
    if (!text || text.trim() === '') {
      return text;
    }
    
    // Evitar traducir texto demasiado corto o que parece ser un identificador
    if (text.length < 5 || !containsRealText(text)) {
      return text;
    }
    
    // Obtener la clave API de DeepL desde las variables de entorno
    const apiKey = process.env.DEEPL_API_KEY;
    
    if (!apiKey) {
      console.error('API key de DeepL no encontrada en las variables de entorno');
      return text;
    }
    
    // Convertir el código de idioma al formato que espera DeepL
    const deeplLang = convertToDeeplLanguage(targetLang);
    
    // Llamar a la API de DeepL
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
      return response.data.translations[0].text;
    }
    
    return text;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    
    // Verificar si el error es por límite de API
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        console.error('Límite de API DeepL alcanzado. Por favor, espere o actualice a un plan con mayor capacidad.');
      } else if (error.response.status === 403) {
        console.error('Error de autenticación con la API DeepL. Verifique la clave API.');
      }
    }
    
    return text;
  }
}

/**
 * Convierte los códigos de idioma al formato que espera DeepL
 */
function convertToDeeplLanguage(lang: string): string {
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
}

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
 * Traduce un objeto completo al idioma especificado
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLang: string
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
          result[key] = await translateText(value, targetLang) as any;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Usamos type assertion para asegurar que TypeScript entienda que estamos manteniendo el tipo
        result[key] = await translateObject(value, targetLang) as any;
      }
    }
  }
  
  return result;
}

/**
 * Traduce múltiples textos en un solo lote
 * @param texts Array de textos a traducir
 * @param targetLang Idioma destino para la traducción
 * @returns Array de textos traducidos en el mismo orden
 */
export async function bulkTranslate(texts: string[], targetLang: string): Promise<string[]> {
  try {
    if (!texts || texts.length === 0) {
      return [];
    }
    
    // Filtrar textos vacíos o demasiado cortos
    const validTexts = texts.filter(text => 
      text && text.trim() !== '' && text.length >= 5 && containsRealText(text)
    );
    
    if (validTexts.length === 0) {
      return texts;
    }
    
    // Obtener la clave API de DeepL desde las variables de entorno
    const apiKey = process.env.DEEPL_API_KEY;
    
    if (!apiKey) {
      console.error('API key de DeepL no encontrada en las variables de entorno');
      return texts;
    }
    
    // Convertir el código de idioma al formato que espera DeepL
    const deeplLang = convertToDeeplLanguage(targetLang);
    
    // Llamar a la API de DeepL con un lote de textos
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      {
        text: validTexts,
        target_lang: deeplLang
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Si la respuesta es válida, reemplazar los textos originales con las traducciones
    if (response.data && response.data.translations && response.data.translations.length === validTexts.length) {
      const result = [...texts]; // Clonar el array original
      let translationIndex = 0;
      
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        // Solo reemplazar el texto si era válido para traducción
        if (text && text.trim() !== '' && text.length >= 5 && containsRealText(text)) {
          result[i] = response.data.translations[translationIndex].text;
          translationIndex++;
        }
      }
      
      return result;
    }
    
    return texts;
  } catch (error) {
    console.error('Error en traducción por lotes:', error);
    
    // Verificar si el error es por límite de API
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        console.error('Límite de API DeepL alcanzado en traducción por lotes. Por favor, espere o actualice a un plan con mayor capacidad.');
      } else if (error.response.status === 403) {
        console.error('Error de autenticación con la API DeepL en traducción por lotes. Verifique la clave API.');
      }
    }
    
    return texts;
  }
}