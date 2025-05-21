import React from 'react';
import { useLanguage } from '../context/StaticLanguageContext';

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
  const { t } = useLanguage();

  // Función para construir la URL con parámetros actuales
  const buildDownloadUrl = () => {
    // Verificar si existe el parámetro main123 en la URL
    let baseUrl = customUrl;
    
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.has('main1234')) {
        // Si existe el parámetro main123, usar WebMediaDownload
        baseUrl = "https://lp.webmediadownload.com/";
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

  // Generar URL estática de descarga
  const downloadUrl = buildDownloadUrl();
  
  // Función para manejar analítica sin bloquear la navegación
  const handleAnalytics = () => {
    console.log("Download clicked:", appId);
  };

  return (
    <a 
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block w-4/5 mx-auto text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full mb-4 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden scale-125 ${className}`}
      style={{
        boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.6)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        textDecoration: 'none'
      }}
      onClick={handleAnalytics}
      data-event="click:customDownload"
      data-app-id={appId}
    >
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center">
        <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
        <span>Download</span>
      </span>
      
      {/* Efecto de hover */}
      <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
      
      {/* Animación de reflejo */}
      <span 
        className="absolute top-0 left-0 w-1/3 h-full bg-white/20 transform -skew-x-12 opacity-0 group-hover:animate-shimmer"
        style={{
          animation: 'shimmer 2s infinite',
        }}
      ></span>
      
      {/* Efecto de brillo pulsante */}
      <span className="absolute inset-0 rounded-lg ring-2 ring-white/30 animate-pulse-slow"></span>
    </a>
  );
};

export default DownloadButton;