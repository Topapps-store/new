import { useState } from 'react';

/**
 * Hook simplificado para mostrar texto (sin traducción)
 * @param text Texto a mostrar
 * @returns El texto original sin traducir
 */
export function useTranslation(text: string) {
  // Simplemente devuelve el texto original sin ninguna lógica de traducción
  return { 
    translatedText: text, 
    isLoading: false 
  };
}