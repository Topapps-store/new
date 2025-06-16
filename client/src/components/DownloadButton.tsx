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
      return 'Descarcă';
    }
    // Custom text for lose weight app for women
    if (appId === 'lose-weight-app-for-women') {
      return 'Try for free';
    }
    return t('ui.continue', 'Download');
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
      onClick={handleClick}
      data-event="click:customDownload"
      data-app-id={appId}
    >
      {/* Botón simple solo con texto */}
      <span className="relative z-10 flex items-center justify-center">
        <span className="text-lg font-medium">{getButtonText()}</span>
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