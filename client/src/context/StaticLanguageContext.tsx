import React, { createContext, useContext } from 'react';

// Traducciones predeterminadas (solo inglés)
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
    'appDetail.alternativeDownloads': 'Alternative Downloads',
    'appDetail.relatedApps': 'Related Apps',
    'sponsored.sponsored': 'Sponsored',
    'category.allApps': 'All Apps',
    'error.generic': 'An error occurred. Please try again later.',
    'loading': 'Loading...',
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.disclaimer': 'Disclaimer'
  }
};

// Tipo para el contexto de idioma
interface LanguageContextType {
  language: string;
  t: (key: string) => string;
}

// Crear el contexto de idioma
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Propiedades para el proveedor de idioma
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Componente proveedor de idioma (solo inglés)
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Función para obtener la traducción de una clave
  const t = (key: string): string => {
    // Obtener traducciones de inglés (único idioma)
    const translations = defaultTranslations.en;
    
    // Devolver la traducción o la clave si no se encuentra
    return translations[key as keyof typeof translations] || key;
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ 
      language: 'en', 
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