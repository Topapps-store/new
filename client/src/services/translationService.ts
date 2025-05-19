import * as deepl from 'deepl-node';

// Inicializar el cliente DeepL con la clave API
let translator: deepl.Translator | null = null;

/**
 * Inicializa el cliente de DeepL
 */
export const initializeTranslator = async (): Promise<void> => {
  try {
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
    if (!apiKey) {
      console.error('No se ha proporcionado la clave API de DeepL');
      return;
    }
    
    translator = new deepl.Translator(apiKey);
    
    // Verificar la conexión
    const usage = await translator.getUsage();
    console.log('DeepL translator initialized successfully');
    try {
      if (usage.character?.count !== undefined && usage.character?.limit !== undefined) {
        console.log(`Character usage: ${usage.character.count} of ${usage.character.limit}`);
      }
    } catch (e) {
      console.log('No se pudo obtener el uso de caracteres');
    }
  } catch (error) {
    console.error('Error al inicializar el traductor DeepL:', error);
    translator = null;
  }
};

/**
 * Traduce un texto al idioma especificado
 * @param text Texto a traducir
 * @param targetLang Código del idioma de destino (ej. 'ES', 'EN', 'FR')
 * @returns Texto traducido o el texto original si hay un error
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || text.trim() === '') {
    return text;
  }
  
  if (!translator) {
    await initializeTranslator();
    if (!translator) {
      console.warn('No se pudo inicializar el traductor DeepL');
      return text;
    }
  }
  
  try {
    // Convertir el código de idioma al formato que espera DeepL
    const deeplLang = convertToDeeplLanguage(targetLang);
    
    // Evitar traducir texto demasiado corto o que parece ser un identificador
    if (text.length < 5 || text.includes('.') || !containsRealText(text)) {
      return text;
    }
    
    const result = await translator.translateText(text, null, deeplLang);
    return typeof result === 'string' ? result : result.text;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    return text;
  }
};

/**
 * Convierte los códigos de idioma al formato que espera DeepL
 */
const convertToDeeplLanguage = (lang: string): deepl.TargetLanguageCode => {
  // Normalizar el código de idioma (convertir a mayúsculas y eliminar guiones/regiones)
  const normalizedLang = lang.toUpperCase().split('-')[0];
  
  // Mapa de códigos de idioma a códigos DeepL
  const languageMap: { [key: string]: deepl.TargetLanguageCode } = {
    'ES': 'es',
    'EN': 'en-US',
    'FR': 'fr',
    'DE': 'de',
    'IT': 'it',
    'PT': 'pt-BR',
    'RU': 'ru',
    'JA': 'ja',
    'ZH': 'zh',
    // Añadir más idiomas según sea necesario
  };
  
  return languageMap[normalizedLang] || 'en-US';
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