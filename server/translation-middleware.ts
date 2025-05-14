import { Request, Response, NextFunction } from 'express';
import { translateObject } from './translation-service';
import { log } from './vite';

// Idiomas que soportamos para traducción
const SUPPORTED_LANGUAGES = ['EN', 'ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'RU', 'ZH', 'JA', 'PL'];

/**
 * Detecta el idioma preferido del usuario desde la cabecera Accept-Language
 */
function detectLanguage(req: Request): string {
  const acceptLanguage = req.headers['accept-language'] || '';
  
  // Extrae los idiomas y sus prioridades del header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qualityStr] = lang.trim().split(';q=');
      const quality = qualityStr ? parseFloat(qualityStr) : 1.0;
      return {
        code: code.substring(0, 2).toUpperCase(),
        quality
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Busca el primer idioma soportado
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang.code)) {
      return lang.code;
    }
  }

  // Por defecto inglés
  return 'EN';
}

/**
 * Middleware que traduce las respuestas de la API al idioma del navegador
 */
export function translationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Guarda la referencia original al método json
    const originalJson = res.json;
    
    // Sobrescribe el método json para interceptar la respuesta
    res.json = function(body: any) {
      // Solo procesamos respuestas con éxito
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Detecta el idioma preferido del usuario
        const targetLanguage = detectLanguage(req);
        
        // Solo traducimos si no es inglés
        if (targetLanguage !== 'EN') {
          // Procesamos la traducción de manera asíncrona
          (async () => {
            try {
              // Solo traducimos ciertas rutas
              const pathsToTranslate = [
                '/api/apps',
                '/api/categories',
                '/api/app-updates'
              ];
              
              let shouldTranslate = false;
              for (const path of pathsToTranslate) {
                if (req.path.startsWith(path)) {
                  shouldTranslate = true;
                  break;
                }
              }
              
              if (shouldTranslate) {
                log(`Translating response to ${targetLanguage}`, 'debug');
                const translatedBody = await translateObject(body, targetLanguage);
                
                // Restauramos el método original y enviamos la respuesta traducida
                res.json = originalJson;
                return originalJson.call(res, translatedBody);
              }
            } catch (error) {
              log(`Error translating response: ${error}`, 'error');
            }
            
            // Si hay error o no debemos traducir, enviamos la respuesta original
            res.json = originalJson;
            return originalJson.call(res, body);
          })();
          
          // Devolvemos para no llamar dos veces a res.json
          return this;
        }
      }
      
      // Si no necesitamos traducir, usamos el comportamiento original
      return originalJson.call(res, body);
    };
    
    next();
  };
}