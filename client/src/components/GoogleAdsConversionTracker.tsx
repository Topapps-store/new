import { useEffect } from 'react';

interface ConversionEvent {
  conversionId: string;
  value: number;
  currency: string;
  transactionId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function GoogleAdsConversionTracker() {
  useEffect(() => {
    // Inicializar Google Ads Conversion Tracking
    const initConversionTracking = () => {
      if (typeof window.gtag === 'undefined') {
        // Cargar Google Tag Manager si no está presente
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_GOOGLE_ADS_CONVERSION_ID}`;
        document.head.appendChild(script);

        const configScript = document.createElement('script');
        configScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.VITE_GOOGLE_ADS_CONVERSION_ID}');
        `;
        document.head.appendChild(configScript);
      }
    };

    if (process.env.VITE_GOOGLE_ADS_CONVERSION_ID) {
      initConversionTracking();
    }
  }, []);

  return null; // Componente invisible para tracking
}

// Hook personalizado para rastrear conversiones
export function useGoogleAdsConversion() {
  const trackConversion = (event: ConversionEvent) => {
    if (typeof window.gtag === 'undefined') {
      console.warn('Google Ads conversion tracking no está inicializado');
      return;
    }

    // Enviar evento de conversión a Google Ads
    window.gtag('event', 'conversion', {
      send_to: `${process.env.VITE_GOOGLE_ADS_CONVERSION_ID}/${event.conversionId}`,
      value: event.value,
      currency: event.currency,
      transaction_id: event.transactionId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    console.log('Conversión enviada a Google Ads:', event);
  };

  const trackAppDownload = (appId: string, appName: string, source: 'google_play' | 'app_store') => {
    trackConversion({
      conversionId: process.env.VITE_GOOGLE_ADS_APP_DOWNLOAD_CONVERSION_ID || 'app_download',
      value: 5.0, // Valor de conversión por descarga
      currency: 'EUR',
      transactionId: `download_${appId}_${source}_${Date.now()}`
    });

    // También enviar evento personalizado para analytics interno
    window.gtag('event', 'app_download', {
      app_id: appId,
      app_name: appName,
      download_source: source,
      value: 5.0,
      currency: 'EUR'
    });
  };

  const trackPageView = (appId?: string, appName?: string) => {
    if (appId && appName) {
      window.gtag('event', 'page_view', {
        page_title: `${appName} - Descarga Gratis`,
        page_location: window.location.href,
        app_id: appId,
        app_name: appName
      });
    }
  };

  return {
    trackConversion,
    trackAppDownload,
    trackPageView
  };
}

// Componente para botones de descarga con tracking automático
interface DownloadButtonProps {
  appId: string;
  appName: string;
  source: 'google_play' | 'app_store';
  url: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TrackedDownloadButton({ 
  appId, 
  appName, 
  source, 
  url, 
  children, 
  className,
  onClick 
}: DownloadButtonProps) {
  const { trackAppDownload } = useGoogleAdsConversion();

  const handleClick = () => {
    // Rastrear conversión antes de redirigir
    trackAppDownload(appId, appName, source);
    
    // Ejecutar callback personalizado si existe
    if (onClick) {
      onClick();
    }

    // Abrir en nueva pestaña después de un pequeño delay para asegurar que se envíe el tracking
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}