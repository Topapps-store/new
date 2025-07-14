import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface DownloadButtonProps {
  appId: string;
  customUrl?: string;
  className?: string;
}

/**
 * Botón de descarga verde personalizable que mantiene la misma apariencia
 * que el botón original, pero permite configurar un enlace personalizado.
 */
const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  appId, 
  customUrl = "https://download.example.com/app", 
  className = "" 
}) => {
  const { t } = useTranslation();

  // Obtener el texto del botón usando el sistema de traducción
  const getButtonText = () => {
    // Romanian text for uber-romania page
    if (appId === 'uber-romania') {
      return 'Continuă';
    }
    // Custom text for lose weight app for women
    if (appId === 'lose-weight-app-for-women') {
      return 'Continue';
    }
    return t('ui.continue', 'Continue');
  };

  // Función para construir la URL con parámetros actuales
  const buildDownloadUrl = () => {
    // Verificar si existe el parámetro main=123 en la URL
    let baseUrl = customUrl;
    
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      // Comprobar el parámetro "main" con valor "123"
      if (currentParams.get('main') === '123') {
        // Si existe el parámetro main con valor 123, usar WebMediaDownload
        baseUrl = "https://lp.webmediadownload.com/";
        console.log("Redirección a WebMediaDownload activada por parámetro main=123");
      }
    }
    
    // Crear URL con parámetros
    const url = new URL(baseUrl);
    
    // Añadir información del app y otros parámetros útiles
    url.searchParams.set('app_id', appId);
    url.searchParams.set('source', 'topapps');
    url.searchParams.set('utm_source', 'topapps');
    url.searchParams.set('utm_medium', 'download_button');
    url.searchParams.set('utm_campaign', 'app_download');
    
    // Añadir timestamp para prevenir cacheo
    url.searchParams.set('t', Date.now().toString());
    
    // Preservar los parámetros actuales de la URL si existen
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        // Pasar todos los parámetros directamente (sin prefijo ref_)
        url.searchParams.set(key, value);
      });
      
      // Añadir información de referencia
      if (document.referrer) {
        url.searchParams.set('ref', encodeURIComponent(document.referrer));
      }
    }
    
    return url.toString();
  };

  // Función para manejar el clic y redirigir si es necesario
  const handleClick = (e: React.MouseEvent) => {
    // Registrar evento de analítica
    console.log("Download clicked:", appId);
    
    // Verificar si debe redirigir a WebMediaDownload
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.get('main') === '123') {
        e.preventDefault(); // Prevenir navegación por defecto
        
        // Construir URL de descarga
        const downloadUrl = buildDownloadUrl();
        
        // Abrir en nueva pestaña
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        console.log("Redirección mediante window.open a:", downloadUrl);
      }
    }
  };
  
  // Generar URL estática de descarga para casos sin redirección especial
  const downloadUrl = buildDownloadUrl();

  return (
    <div className="w-full">
      <a 
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block w-full mx-auto text-center text-white font-bold py-4 px-6 rounded-2xl mb-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden ${className}`}
        style={{
          backgroundColor: '#22c55e',
          boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.3)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          textDecoration: 'none'
        }}
        onClick={handleClick}
        data-event="click:customDownload"
        data-app-id={appId}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#16a34a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#22c55e';
        }}
      >
        {/* Botón simple solo con texto */}
        <span className="relative z-10 flex items-center justify-center">
          <span className="text-lg font-bold">Continuer</span>
        </span>
        
        {/* Efecto de hover */}
        <span className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
        
        {/* Animación de reflejo */}
        <span 
          className="absolute top-0 left-0 w-1/3 h-full bg-white/20 transform -skew-x-12 opacity-0 group-hover:animate-shimmer"
          style={{
            animation: 'shimmer 2s infinite',
          }}
        ></span>
        
        {/* Efecto de brillo pulsante */}
        <span className="absolute inset-0 rounded-xl ring-2 ring-white/30 animate-pulse-slow"></span>
      </a>
      
      {/* Steps below the button - matching the image */}
      <div className="flex justify-center items-center space-x-6 text-xs text-gray-500 mb-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
          <span>Create Account</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>Start Trial</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>Get Answers</span>
        </div>
      </div>
      
      {/* Additional promotional text sections */}
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div className="w-1 h-4 bg-blue-500 rounded-full mr-3"></div>
          <span>Join ExpertAnswer.com Today</span>
          <div className="ml-auto">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div className="w-1 h-4 bg-yellow-500 rounded-full mr-3"></div>
          <span>Access to 12,000+ Experts in seconds</span>
          <div className="ml-auto">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadButton;