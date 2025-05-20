import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initializeTranslator, 
  translateText, 
  detectBrowserLanguage 
} from '../services/translationService';

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
    'appDetail.alternativeDownloads': 'Descargas Alternativas',
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

// Caché para almacenar traducciones previamente realizadas
const translationCache: Record<string, Record<string, string>> = {
  'en': {},
  'es': {},
  'fr': {},
  'de': {},
  'it': {},
  'pt': {},
  'ru': {},
  'ja': {},
  'zh': {}
};

// Tipo para el contexto de idioma
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translateDynamic: (text: string) => Promise<string>;
  supportedLanguages: { code: string; name: string }[];
}

// Crear el contexto de idioma
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Lista de idiomas soportados
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
];

// Propiedades para el proveedor de idioma
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Componente proveedor de idioma
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Estado para almacenar el idioma actual
  const [language, setLanguage] = useState<string>('en');
  // Estado para rastrear si el traductor está inicializado
  const [isTranslatorInitialized, setIsTranslatorInitialized] = useState<boolean>(false);

  // Detectar el idioma del navegador al cargar
  useEffect(() => {
    const initLanguage = () => {
      const browserLang = detectBrowserLanguage();
      // Solo establecer si es un idioma que soportamos
      const isSupported = supportedLanguages.some(lang => lang.code === browserLang);
      if (isSupported) {
        setLanguage(browserLang);
      }
    };

    // Inicializar el traductor
    const initTranslator = async () => {
      try {
        await initializeTranslator();
        setIsTranslatorInitialized(true);
        console.log('Servicio de traducción inicializado');
      } catch (error) {
        console.error('Error al inicializar el servicio de traducción:', error);
      }
    };

    initLanguage();
    initTranslator();
  }, []);

  // Función para obtener la traducción de una clave
  const t = (key: string): string => {
    // Obtener traducciones para el idioma actual de los idiomas predefinidos
    const defaultLang = language in defaultTranslations ? language : 'en';
    const translations = defaultTranslations[defaultLang as keyof typeof defaultTranslations] || defaultTranslations.en;
    
    // Devolver la traducción o la clave si no se encuentra
    return translations[key as keyof typeof translations] || key;
  };

  // Función para traducir texto dinámico usando LibreTranslate
  const translateDynamic = async (text: string): Promise<string> => {
    // Si el texto está vacío o es muy corto, devuélvelo tal cual
    if (!text || text.length < 3) {
      return text;
    }

    // Normalizar el idioma
    const normalizedLang = language.toLowerCase().split('-')[0];
    
    // Definir el idioma de origen (asumimos que es inglés)
    const sourceLang = 'en';
    
    // Si los idiomas son iguales, no es necesario traducir
    if (normalizedLang === sourceLang) {
      return text;
    }

    try {
      // Clave para la caché
      const cacheKey = `${sourceLang}_${normalizedLang}`;
      
      // Buscar en caché primero
      if (translationCache[normalizedLang]?.[text]) {
        return translationCache[normalizedLang][text];
      }

      // Si no está en caché, traducir con LibreTranslate
      const translated = await translateText(text, normalizedLang, sourceLang);
      
      // Guardar en caché
      if (!translationCache[normalizedLang]) {
        translationCache[normalizedLang] = {};
      }
      translationCache[normalizedLang][text] = translated;
      
      return translated;
    } catch (error) {
      console.error('Error al traducir texto dinámico:', error);
      return text;
    }
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
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