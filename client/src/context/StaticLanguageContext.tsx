import React, { createContext, useContext } from 'react';
import { dictionary } from '../translations/english';

// Tipo para el contexto de idioma
interface LanguageContextType {
  language: string;
  t: (key: string) => string;
  // Mantener la estructura antigua para compatibilidad
  setLanguage: (lang: string) => void;
  translateDynamic: (text: string) => Promise<string>;
  supportedLanguages: { code: string; name: string }[];
}

// Crear el contexto de idioma
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Solamente idioma inglés
const supportedLanguages = [
  { code: 'en', name: 'English' }
];

// Propiedades para el proveedor de idioma
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Componente proveedor de idioma (solo inglés)
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Función para obtener la traducción de una clave
  const t = (key: string): string => {
    // Buscar en el diccionario
    return dictionary[key as keyof typeof dictionary] || key;
  };

  // Función sin operación para compatibilidad
  const setLanguage = (lang: string): void => {
    console.log('Múltiples idiomas ya no están soportados, usando inglés por defecto');
  };

  // Función stub para compatibilidad que devuelve el texto original sin traducir
  const translateDynamic = async (text: string): Promise<string> => {
    return text;
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ 
      language: 'en', 
      t,
      setLanguage,
      translateDynamic,
      supportedLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};