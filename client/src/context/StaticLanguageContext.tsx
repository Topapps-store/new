import React, { createContext, useContext, useState } from 'react';

// Mapa básico de traducciones para la navegación y elementos esenciales
const translations = {
  'en': {
    'nav.apps': 'Apps',
    'nav.games': 'Games',
    'nav.addApp': 'Add App',
  }
};

// Tipo para el contexto de idioma simplificado
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Crear el contexto de idioma
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Propiedades para el proveedor de idioma
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Componente proveedor de idioma simplificado
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Estado para almacenar el idioma actual (ahora solo es una referencia, ya que usamos Google Translate)
  const [language, setLanguage] = useState<string>('en');

  // Función simplificada para obtener la traducción de una clave
  const t = (key: string): string => {
    return translations.en[key as keyof typeof translations.en] || key;
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t
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