import React, { createContext, useContext, useState, useEffect } from 'react';

// Traducciones predeterminadas
const defaultTranslations = {
  'en': {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.search': 'Search',
    'nav.back': 'Back',
    'search.placeholder': 'Search apps...',
    'search.noResults': 'No results found',
    'home.topApps': 'Top Apps',
    'home.popularApps': 'Popular Apps',
    'home.recentApps': 'Recent Apps',
    'home.justInTime': 'Just In Time',
    'home.top10AppsLastMonth': 'Top 10 Apps Last Month',
    'home.top10JustInTimeApps': 'Top Must-Have Apps',
    'home.viewAll': 'View All',
    'appDetail.description': 'Description',
    'appDetail.screenshots': 'Screenshots',
    'appDetail.information': 'Information',
    'appDetail.downloads': 'Downloads',
    'appDetail.developer': 'Developer',
    'appDetail.version': 'Version',
    'appDetail.updated': 'Updated',
    'appDetail.downloadAPK': 'Download',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.relatedApps': 'Related Apps',
    'sponsored.sponsored': 'Sponsored',
    'category.allApps': 'All Apps',
    'error.generic': 'An error occurred. Please try again later.',
    'loading': 'Loading...',
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.disclaimer': 'Disclaimer'
  },
  'es': {
    'nav.home': 'Inicio',
    'nav.categories': 'Categorías',
    'nav.search': 'Buscar',
    'nav.back': 'Volver',
    'search.placeholder': 'Buscar apps...',
    'search.noResults': 'No se encontraron resultados',
    'home.topApps': 'Apps Principales',
    'home.popularApps': 'Apps Populares',
    'home.recentApps': 'Apps Recientes',
    'home.justInTime': 'Recién Llegadas',
    'home.top10AppsLastMonth': 'Top 10 Apps del Mes',
    'home.top10JustInTimeApps': 'Apps Imprescindibles',
    'home.viewAll': 'Ver Todo',
    'appDetail.description': 'Descripción',
    'appDetail.screenshots': 'Capturas',
    'appDetail.information': 'Información',
    'appDetail.downloads': 'Descargas',
    'appDetail.developer': 'Desarrollador',
    'appDetail.version': 'Versión',
    'appDetail.updated': 'Actualizado',
    'appDetail.downloadAPK': 'Descargar',
    'appDetail.googlePlay': 'Google Play',
    'appDetail.relatedApps': 'Apps Relacionadas',
    'sponsored.sponsored': 'Patrocinado',
    'category.allApps': 'Todas las Apps',
    'error.generic': 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
    'loading': 'Cargando...',
    'footer.termsOfService': 'Términos de Servicio',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.contact': 'Contáctanos',
    'footer.disclaimer': 'Aviso Legal'
  }
};

// Tipo para el contexto de idioma
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

// Componente proveedor de idioma
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Estado para almacenar el idioma actual
  const [language, setLanguage] = useState<string>('en');

  // Detectar el idioma del navegador al cargar
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      // Solo establecer si es un idioma que soportamos
      if (browserLang in defaultTranslations) {
        setLanguage(browserLang);
      }
    };

    detectBrowserLanguage();
  }, []);

  // Función para obtener la traducción de una clave
  const t = (key: string): string => {
    // Obtener traducciones para el idioma actual
    const translations = defaultTranslations[language as keyof typeof defaultTranslations] || defaultTranslations.en;
    
    // Devolver la traducción o la clave si no se encuentra
    return translations[key as keyof typeof translations] || key;
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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