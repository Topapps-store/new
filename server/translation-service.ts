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
 * Traduce un texto utilizando la API de LibreTranslate con mejor manejo de errores
 */
export async function translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
  try {
    if (!text || text.trim() === '') {
      return text;
    }
    
    // Evitar traducir texto demasiado corto o que parece ser un identificador
    if (text.length < 5 || !containsRealText(text)) {
      return text;
    }
    
    // Si el idioma de origen y destino son el mismo, no es necesario traducir
    const normalizedTarget = normalizeLanguageCode(targetLang);
    const normalizedSource = normalizeLanguageCode(sourceLang);
    
    if (normalizedSource === normalizedTarget) {
      return text;
    }
    
    // Lista de endpoints alternativos de LibreTranslate en caso de que uno falle
    const endpoints = [
      'https://libretranslate.de/translate',
      'https://translate.argosopentech.com/translate'
    ];
    
    // Datos para la solicitud
    const requestData = {
      q: text,
      source: normalizedSource,
      target: normalizedTarget,
      format: 'text'
    };
    
    // Configuración de tiempo de espera (5 segundos)
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 segundos de timeout
    };
    
    // Intentar con cada endpoint hasta que uno funcione
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(endpoint, requestData, axiosConfig);
        
        if (response.data && response.data.translatedText) {
          return response.data.translatedText;
        }
      } catch (endpointError) {
        lastError = endpointError;
        console.warn(`Error con el endpoint ${endpoint}:`, endpointError.message);
        // Continuar con el siguiente endpoint
        continue;
      }
    }
    
    // Si llegamos aquí, todos los endpoints fallaron
    if (lastError) {
      throw lastError;
    }
    
    return text;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    
    // Verificar si hay errores específicos
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Tiempo de espera agotado al conectar con el servicio de traducción');
      } else if (error.response) {
        console.error(`Error de la API de traducción: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No se recibió respuesta del servicio de traducción');
      }
    }
    
    // En caso de error, devolver el texto original
    return text;
  }
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
 * Traduce múltiples textos en un solo lote con mejor manejo de errores
 * @param texts Array de textos a traducir
 * @param targetLang Idioma destino para la traducción
 * @param sourceLang Idioma origen para la traducción (por defecto 'en')
 * @returns Array de textos traducidos en el mismo orden
 */
export async function bulkTranslate(texts: string[], targetLang: string, sourceLang: string = 'en'): Promise<string[]> {
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
    
    // Normalizar códigos de idioma
    const normalizedTarget = normalizeLanguageCode(targetLang);
    const normalizedSource = normalizeLanguageCode(sourceLang);
    
    // Si los idiomas son iguales, no es necesario traducir
    if (normalizedSource === normalizedTarget) {
      return texts;
    }
    
    // Traducir textos en lotes pequeños para no sobrecargar la API
    // y con reintentos en caso de error
    const batchSize = 5; // Traducir 5 textos a la vez
    const translatedTexts: string[] = [];
    
    for (let i = 0; i < validTexts.length; i += batchSize) {
      const batch = validTexts.slice(i, i + batchSize);
      
      // Traducir cada lote con 3 intentos máximo
      let attempts = 0;
      let batchTranslated = false;
      let batchResults: string[] = [];
      
      while (!batchTranslated && attempts < 3) {
        try {
          // Usamos Promise.all pero con un pequeño delay entre solicitudes
          batchResults = await Promise.all(
            batch.map(async (text, index) => {
              // Pequeño delay para no saturar la API
              if (index > 0) {
                await new Promise(resolve => setTimeout(resolve, 200));
              }
              return await translateText(text, normalizedTarget, normalizedSource);
            })
          );
          batchTranslated = true;
        } catch (error) {
          attempts++;
          console.warn(`Error en lote ${i}-${i+batch.length}, intento ${attempts}/3:`, error.message);
          // Esperar un poco más antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
      
      // Si después de 3 intentos sigue fallando, usar los textos originales
      if (!batchTranslated) {
        console.error(`No se pudo traducir el lote ${i}-${i+batch.length} después de 3 intentos.`);
        batchResults = batch;
      }
      
      // Añadir los resultados del lote
      translatedTexts.push(...batchResults);
    }
    
    // Reemplazar los textos originales con las traducciones
    const result = [...texts]; // Clonar el array original
    let translationIndex = 0;
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      // Solo reemplazar el texto si era válido para traducción
      if (text && text.trim() !== '' && text.length >= 5 && containsRealText(text)) {
        result[i] = translatedTexts[translationIndex];
        translationIndex++;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error en traducción por lotes:', error);
    return texts;
  }
}