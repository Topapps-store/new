/**
 * Servicio de traducción simplificado que devuelve el texto original
 * Ya que ahora usamos Google Translate directamente en el cliente
 */
export async function translateText(text: string, targetLang: string, sourceLang?: string): Promise<string> {
  // Simplemente devolvemos el texto original, la traducción se maneja con Google Translate en el cliente
  return text;
}

// Estas funciones ya no son necesarias porque usamos Google Translate en el cliente

/**
 * Traduce un objeto completo al idioma especificado
 * Versión simplificada que solo devuelve el objeto original
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLang: string
): Promise<T> {
  // Simplemente retornamos el objeto original, ya que la traducción se maneja con Google Translate
  return obj;
}

/**
 * Traduce múltiples textos en un solo lote
 * Versión simplificada que solo devuelve los textos originales
 * @param texts Array de textos a traducir
 * @param targetLang Idioma destino para la traducción
 * @returns Array de textos originales sin traducir
 */
export async function bulkTranslate(texts: string[], targetLang: string): Promise<string[]> {
  // Simplemente retornamos los textos originales, ya que la traducción se maneja con Google Translate
  return texts;
}