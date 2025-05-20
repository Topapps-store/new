import { useState } from 'react';

/**
 * Hook simplificado que solo devuelve el texto original
 * La traducción se maneja con Google Translate directamente en el cliente
 * @param text Texto original
 * @returns El texto original sin traducir
 */
export function useTranslation(text: string) {
  // Simplemente devolvemos el texto original
  const [translatedText] = useState(text);
  const [isLoading] = useState(false);

  return { translatedText, isLoading };
}

// Función auxiliar para traducir textos estáticos
export function t(key: string): string {
  // Mapa de traducciones para los elementos de navegación
  const translations: Record<string, string> = {
    'nav.apps': 'Apps',
    'nav.games': 'Games',
    'nav.addApp': 'Add App',
  };
  
  return translations[key] || key;
}