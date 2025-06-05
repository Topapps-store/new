import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import StarRating from "../components/StarRating";
import { useState, useEffect } from "react";
import { App, AppLegacy, AffiliateLink } from "@shared/schema";
import AppCard from "../components/AppCard";
import { Badge } from "../components/ui/badge";
import { useLanguage } from "../context/StaticLanguageContext";
import { apiRequest } from "../lib/queryClient";
import { Download, PlayCircle } from "lucide-react";
import { processAffiliateUrl } from "../lib/url-utils";
import DownloadButton from "../components/DownloadButton";
import UberAppSEO from "../components/UberAppSEO";
import { useTranslation } from "../hooks/useTranslation";



// Type guard to check if the app is of type AppLegacy
function isAppLegacy(app: App | AppLegacy): app is AppLegacy {
  return 'category' in app;
}

// Function to get category name
function getCategoryName(app: App | AppLegacy): string {
  if (isAppLegacy(app)) {
    return app.category;
  }
  return 'Unknown'; // For App type that doesn't have category property
}

const AppDetail = () => {
  const { appId } = useParams();
  const [activeTab, setActiveTab] = useState<"description" | "screenshots" | "info">("description");
  const { t } = useLanguage();
  const { t: translate, isSpanish } = useTranslation();
  
  // Scroll to top when component mounts and update SEO meta tags
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Guardar el título original para restaurarlo al desmontar
    const originalTitle = document.title;
    
    // Crear o actualizar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    // Personalizar SEO según la página
    if (appId === 'uber-request-a-ride') {
      // Establecer nuevo título
      document.title = "Download Uber App – Request a Ride Today | TopApps Store";
      metaDescription.setAttribute('content', 'Get the Uber ride app for Android or iPhone. Download now and request safe, fast rides.');
    } 
    else if (appId === 'lyft') {
      // Establecer nuevo título
      document.title = "Download Lyft App | TopApps Store";
      metaDescription.setAttribute('content', 'Install the official Lyft app for iPhone or Android. Tap to request a ride now.');
    }
    else if (appId === 'electrify-america') {
      // Establecer título y descripción optimizados para Electrify America
      document.title = "Download Electrify America App | Fast EV Charging Stations Near You";
      metaDescription.setAttribute('content', 'Get the Electrify America app to locate chargers, start charging, and manage your EV trips.');
    }
    else if (appId === 'chargepoint') {
      // Establecer título y descripción optimizados para ChargePoint
      document.title = "Download ChargePoint App | EV Charging Stations Near You";
      metaDescription.setAttribute('content', 'Get the ChargePoint app to find EV charging stations, start charging, and manage sessions.');
    }
    else if (appId === 'bp-pulse') {
      // Establecer título y descripción optimizados para BP Pulse según especificaciones de Google Ads
      document.title = "Descargar App BP Pulse | Carga tu Coche Eléctrico Rápido y Fácil";
      metaDescription.setAttribute('content', 'Instala la app oficial de BP Pulse y encuentra puntos de carga cerca de ti. Disponible para Android y iPhone.');
    }
    else if (appId === 'enbw-mobility-ev-charging') {
      // Establecer título y descripción optimizados para EnBW mobility+ según especificaciones de Google Ads
      document.title = "EnBW mobility+ App herunterladen | Schnellladen für Elektroautos";
      metaDescription.setAttribute('content', 'EnBW App für Android & iOS. Finde Ladestationen, nutze AutoCharge und lade dein Elektroauto in Minuten. Jetzt EnBW App herunterladen.');
    }
    
    // Limpiar al desmontar
    return () => {
      document.title = originalTitle;
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', '');
      }
    };
  }, [appId]);

  const { data: app, isLoading } = useQuery<App | AppLegacy>({
    queryKey: [`/api/apps/${appId}`],
    queryFn: async () => {
      const { getAppById } = await import('../services/staticDataService');
      return getAppById(appId || '');
    },
    enabled: !!appId
  });

  const { data: relatedApps, isLoading: isLoadingRelated } = useQuery<(App | AppLegacy)[]>({
    queryKey: ["/api/apps/related", appId],
    queryFn: async () => {
      const { getRelatedApps } = await import('../services/staticDataService');
      return getRelatedApps(appId || '');
    },
    enabled: !!appId
  });
  
  // Fetch affiliate links for this app
  const { data: affiliateLinks, isLoading: isLoadingAffiliateLinks } = useQuery<AffiliateLink[]>({
    queryKey: [`/api/apps/${appId}/affiliate-links`],
    queryFn: async () => {
      const { getAffiliateLinks } = await import('../services/staticDataService');
      return getAffiliateLinks(appId || '');
    },
    enabled: !!appId
  });

  const handleDownloadClick = () => {
    console.log("Download click:", app?.id);
    // In a real implementation, this would track the download
  };

  const handleGooglePlayClick = (e: React.MouseEvent) => {
    // Don't prevent default here to allow the native link behavior
    console.log("Google Play redirect:", app?.id);
    
    // Add tracking parameters to the URL if needed
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      try {
        // Add basic UTM parameters for tracking
        const urlObj = new URL(href);
        urlObj.searchParams.set('utm_source', 'topapps');
        urlObj.searchParams.set('utm_medium', 'app_detail');
        urlObj.searchParams.set('utm_campaign', 'google_play');
        
        // Replace the href with the updated URL
        e.currentTarget.setAttribute('href', urlObj.toString());
      } catch (error) {
        console.error('Error processing Google Play URL:', error);
      }
    }
  };
  
  const handleAffiliateLinkClick = async (linkId: number, linkUrl: string) => {
    // Track the click
    try {
      await apiRequest(`/api/affiliate-links/${linkId}/click`, { method: 'POST' });
      console.log(`Clicked affiliate link: ${linkId}`);
      
      // Process affiliate URL to preserve and add tracking parameters
      const processedUrl = processAffiliateUrl(linkUrl, app?.id || '', linkId);
      console.log(`Original URL: ${linkUrl}`);
      console.log(`Processed URL: ${processedUrl}`);
      
      // Open the processed link in a new tab
      window.open(processedUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track affiliate link click:', error);
      
      // Still open the link even if tracking fails, but with processed URL
      const processedUrl = processAffiliateUrl(linkUrl, app?.id || '', linkId);
      window.open(processedUrl, '_blank', 'noopener,noreferrer');
    }
    
    return false; // Prevent default link behavior
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6">
          <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="md:w-2/3 md:pl-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            <div className="mt-6 mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="flex space-x-4 overflow-x-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 w-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return <div className="text-center py-10">App not found</div>;
  }

  // Verificar si estamos en la página de Uber, Lyft, Electrify America, ChargePoint, BP Pulse, EnBW mobility+ o HBO Max
  const isUberPage = appId === 'uber-request-a-ride';
  const isLyftPage = appId === 'lyft';
  const isElectrifyAmericaPage = appId === 'electrify-america';
  const isChargePointPage = appId === 'chargepoint';
  const isBPPulsePage = appId === 'bp-pulse';
  const isEnBWPage = appId === 'enbw-mobility-ev-charging';
  const isHBOMaxPage = appId === 'max-stream-hbo-tv-movies';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button - reduced margin */}
      <div className="mb-2">
        <Link href="/">
          <div className="flex items-center text-gray-600 hover:text-primary cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>{translate('ui.backToApps', 'Back')}</span>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <div className="flex flex-col items-center">
                <img 
                  src={app.iconUrl} 
                  alt={isUberPage ? "Uber app download icon" : 
                       isLyftPage ? "Lyft App Android iPhone" : 
                       isElectrifyAmericaPage ? "Electrify America app download" :
                       isChargePointPage ? "Download ChargePoint app" :
                       isBPPulsePage ? "Descargar BP Pulse app" :
                       isEnBWPage ? "EnBW App herunterladen" :
                       app.name} 
                  className="w-24 h-24 object-contain mb-2 rounded-xl"
                />
                <h1 className="text-xl font-bold text-center">
                  {isUberPage ? "Uber App - Request a Ride" : 
                   isLyftPage ? "Lyft" : 
                   isElectrifyAmericaPage ? "Electrify America" :
                   isChargePointPage ? "ChargePoint" :
                   isBPPulsePage ? "BP Pulse" :
                   app.name}
                </h1>
                
                <div className="flex items-center mt-1 mb-3">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                
                {/* Advertisement buttons with affiliate links - moved up, below rating */}
                <div className="w-full mb-2">
                  <div className="text-[10px] text-gray-500 mb-1">
                    {translate('ui.advertisement', 'ADVERTISEMENT')}
                  </div>
                  <div className="border border-gray-200 rounded-lg pt-3 pb-2 px-2 relative flex justify-center items-center min-h-[50px]">
                    <button className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">
                      ×
                    </button>
                    
                    {/* Solo mostramos el botón de descarga verde */}
                    <DownloadButton 
                      appId={app?.id || ''} 
                      customUrl={app?.downloadUrl || 'https://topapps.store/download'} 
                    />
                  </div>
                </div>
                
                {/* App Info Cards - more compact */}
                <div className="w-full space-y-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                    <i className="fas fa-download text-green-500 w-6 text-lg"></i>
                    <div>
                      <p className="text-xs text-gray-500">{translate('ui.downloads', 'Downloads')}</p>
                      <p className="font-medium text-sm">{app.downloads || '10M+'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                    <i className="fas fa-code-branch text-blue-500 w-6 text-lg"></i>
                    <div>
                      <p className="text-xs text-gray-500">{translate('ui.developer', 'Developer')}</p>
                      <p className="font-medium text-sm">{app.developer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-4">
              <div className="flex space-x-4 border-b mb-3">
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "description"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  {translate('ui.description', 'Description')}
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "screenshots"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("screenshots")}
                >
                  {translate('appDetail.screenshots', 'Screenshots')}
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "info"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  {translate('appDetail.information', 'Information')}
                </button>

              </div>
              
              {activeTab === "description" && (
                <div className="mb-3">
                  <div className="text-gray-700 whitespace-pre-line text-sm">
                    {isUberPage ? (
                      <>
                        <h3 className="text-xl font-bold mb-3">Download Uber App – Fast & Easy Rides at Your Fingertips</h3>
                        
                        <p className="mb-3">Get Uber App for the most reliable transportation experience. The Uber Ride App is available for Android and iPhone, making it easy to request rides in seconds.</p>
                        
                        <p className="mb-3">The Uber Mobile App is designed to make getting around simple and convenient. Whether you need the Uber App for Android or iPhone, you can Download Uber App and start riding immediately.</p>
                        
                        <p className="mb-3">Get Uber App today and experience the difference. The Uber Ride App connects you to drivers in minutes, and with one tap you can book your ride using the trusted Uber Mobile App.</p>
                        
                        <p className="mb-3">Looking for a quick Uber Download? Our Uber App for Android and iOS is available worldwide. Whether you're traveling across town or to the airport, Get Uber App for instant access to rides.</p>
                        
                        <p className="mb-3">The Uber Mobile App offers safe, fast, and affordable transportation anytime. With the Uber Ride App, you can track your driver, pay seamlessly, and rate your experience.</p>
                        
                        <p className="mb-3">Ready for your Uber Download? The Uber App for Android and iPhone provides reliable service in over 10,000 cities. Download Uber App now and join millions of satisfied riders worldwide.</p>
                        
                        <h4 className="font-semibold mb-2">Why Get Uber App?</h4>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Download Uber App for instant ride access</li>
                          <li>Uber Ride App with real-time tracking</li>
                          <li>Uber App for Android and iOS compatibility</li>
                          <li>Multiple payment options in the Uber Mobile App</li>
                          <li>Price estimates before confirming your ride</li>
                        </ul>
                        
                        <p className="mb-3">Your Uber Download is just a tap away. Get Uber App and experience the convenience of the world's most popular Uber Ride App. The Uber Mobile App makes every journey smooth and reliable!</p>
                        
                        {/* Keywords ocultos para SEO pero visibles para lectores de pantalla */}
                        <div className="sr-only">
                          <p>Uber App</p>
                          <p>Download Uber App</p>
                          <p>Uber Ride App</p>
                          <p>Install Uber App</p>
                          <p>Get Uber App for Android</p>
                          <p>Get Uber App for iPhone</p>
                          <p>Uber Mobile App</p>
                          <p>Request a Ride with Uber</p>
                          <p>Uber Download</p>
                          <p>Fast, Safe, and Easy Rides</p>
                        </div>
                      </>
                    ) : isBPPulsePage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">Descargar App BP Pulse – Recarga tu Coche Eléctrico</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Localiza estaciones BP Pulse, paga desde la app y recarga tu coche en minutos.</h2>
                        
                        <p className="mb-3">Descargar BP Pulse te permite encontrar estaciones de carga BP Pulse, iniciar sesiones de carga rápida y segura, y paga desde tu móvil de manera fácil y conveniente.</p>
                        
                        <p className="mb-3">La App BP Pulse para Android e iOS te conecta con el mapa de puntos de carga BP más completo. Esta aplicación de recarga de coches eléctricos ofrece instalación fácil y gratuita disponible en Google Play y App Store.</p>
                        
                        <p className="mb-3">Con BP Pulse puedes localizar cargadores disponibles, verificar precios en tiempo real, y iniciar sesiones de carga directamente desde tu teléfono móvil.</p>
                        
                        <p className="mb-3">Descargar BP Pulse te permite acceder a miles de puntos de carga en toda Europa. La aplicación BP Pulse está disponible para Android e iOS, ofreciendo una experiencia de carga sin complicaciones.</p>
                        
                        <p className="mb-3">BP Pulse App facilita el pago seguro y el seguimiento de tus sesiones de carga. Obtén la app BP Pulse y únete a la comunidad de conductores de vehículos eléctricos más grande de Europa.</p>
                        
                        <p className="mb-3">Gestiona tu cuenta BP Pulse, revisa el historial de cargas y encuentra nuevos destinos con puntos de carga disponibles. La aplicación BP Pulse hace que conducir un vehículo eléctrico sea más conveniente que nunca.</p>
                        
                        <h3 className="text-xl font-bold mb-3">¿Qué es la app BP Pulse?</h3>
                        <p className="mb-4">La app BP Pulse es una aplicación de recarga de coches eléctricos que te permite localizar estaciones de carga BP Pulse en toda Europa. Con esta App BP Pulse para Android e iOS puedes encontrar puntos de carga disponibles, realizar carga rápida y segura, y paga desde tu móvil de forma instantánea. La instalación fácil y gratuita está disponible en Google Play y App Store.</p>
                        
                        <h4 className="font-semibold mb-2">¿Por qué elegir BP Pulse App?</h4>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Encuentra puntos de carga BP Pulse cerca de ti</li>
                          <li>Inicia y termina sesiones de carga remotamente</li>
                          <li>Precios transparentes y pago sin contacto</li>
                          <li>Navegación integrada a estaciones de carga</li>
                          <li>Historial completo de todas tus cargas</li>
                          <li>Soporte 24/7 para asistencia técnica</li>
                        </ul>
                        
                        <p className="mb-3">Descargar BP Pulse es gratis y te da acceso instantáneo a la red de carga rápida más extensa. La app BP Pulse convierte la carga de tu vehículo eléctrico en una experiencia simple y eficiente.</p>
                        
                        {/* Botones de descarga para BP Pulse */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=com.aml.evapp&hl=es"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Descargar App BP Pulse en Google Play
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/es/app/bp-pulse-puntos-de-carga/id1515768723"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Descargar App BP Pulse en App Store
                          </a>
                        </div>
                        
                        {/* Keywords para SEO */}
                        <div className="sr-only">
                          <p>BP Pulse App</p>
                          <p>Descargar BP Pulse</p>
                          <p>Puntos de carga BP Pulse</p>
                          <p>App carga vehículos eléctricos</p>
                          <p>BP Pulse Android</p>
                          <p>BP Pulse iOS</p>
                          <p>Estaciones de carga BP</p>
                          <p>Carga rápida vehículos eléctricos</p>
                        </div>
                      </>
                    ) : isEnBWPage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">EnBW mobility+ App herunterladen – Schnellladen für dein Elektroauto</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Installiere die EnBW mobility+ App für Android & iOS und nutze AutoCharge sofort.</h2>
                        
                        <p className="mb-3"><strong>Wir laden alles, was uns bewegt. Willkommen bei Deutschlands bestem E-Mobilitätsanbieter!</strong></p>
                        
                        <p className="mb-3">Mit der EnBW mobility+ App starten Sie elektrisch durch. Unsere Alleskönner-App bietet Ihnen diverse Funktionen rund um die Elektromobilität an:</p>
                        
                        <ol className="list-decimal pl-5 mb-4">
                          <li>Ladestationen in der Nähe finden</li>
                          <li>Ladevorgang via App, Ladekarte oder AutoCharge starten</li>
                          <li>Bequem per App bezahlen</li>
                        </ol>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Wir laden überall</strong></h3>
                        <p className="mb-3">Dank der EnBW mobility+ App sind Sie mit Ihrem E-Auto überall sorglos unterwegs. Wir bieten Ihnen Zugang zum größten Ladenetz und der besten Ladenetzabdeckung in Deutschland, Österreich, der Schweiz und weiteren Ländern Europas. Eine interaktive Karte ermöglicht es Ihnen, freie Ladesäulen in Ihrer Nähe zu finden. Dabei stehen zahlreiche Filter für z. B. Ladeleistung, Anzahl an Ladepunkten, Preis, Umgebungsinformationen oder barrierearmer Zugang zur Verfügung.</p>
                        
                        <p className="mb-3">Mit Apple CarPlay/Android Auto kann die EnBW mobility+ App über das Display in Ihrem E-Auto angezeigt werden. So ist das Finden der nächsten Ladesäule noch einfacher.</p>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Wir laden einfach</strong></h3>
                        <p className="mb-3">Mit der EnBW mobility+ App starten Sie bequem den Ladevorgang Ihres E-Autos und bezahlen auf Wunsch direkt mit dem Smartphone. Und das an allen Ladestationen im EnBW HyperNetz – egal ob sie von der EnBW oder anderen Anbietern betrieben werden. Hinterlegen Sie bei der Registrierung einfach die gewünschte Bezahlmethode – und los geht's! Mit unserem Lademonitor behalten Sie stets den Überblick und beenden per Knopfdruck den Ladevorgang. Wer lieber mit der Ladekarte unterwegs ist: Diese können Sie problemlos mit der EnBW mobility+ App bestellen.</p>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Noch einfacher geht's mit AutoCharge!</strong></h3>
                        <p className="mb-3">Anschließen, losladen, weiterfahren! Mit AutoCharge laden Sie ohne App oder Ladekarte. Nach einmaliger Aktivierung in der EnBW mobility+ App müssen Sie künftig nur noch den Ladestecker einstecken und Ihr Ladevorgang startet an EnBW-Schnellladestationen automatisch.</p>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Wir laden volle Preistransparenz</strong></h3>
                        <p className="mb-4">Ihre Ladekosten und den aktuellen Kontostand haben Sie mit der EnBW mobility+ App immer im Blick. Mit einem Preisfilter können Sie Ihre individuelle Preisgrenze festlegen. Ihre monatlichen Rechnungen können Sie jederzeit in der App einsehen und überprüfen.</p>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Wir laden ausgezeichnet</strong></h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2"><strong>Connect Testsieger: bester Elektromobilitätsanbieter</strong></h4>
                          <p className="text-sm">Als Deutschlands größter und bester E-Mobilitätsanbieter belegt EnBW mobility+ zum wiederholten Mal Platz 1 im connect Ladenetztest und überzeugt in diversen Kategorien.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2"><strong>COMPUTER BILD Testsieger: beste Lade-App</strong></h4>
                          <p className="text-sm">Im Lade-App Vergleich 2024 der COMPUTER BILD sichert sich die EnBW mobility+ App den Testsieg durch gute Bedienbarkeit und hervorragende Filterfunktionen.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2"><strong>AUTO BILD Sieger: Lade-App Bedienbarkeit</strong></h4>
                          <p className="text-sm">Die EnBW mobility+ App hat sich erneut als herausragender Anbieter unter den freien Lade-Apps erwiesen. Betont werden die besonders gute Bedienbarkeit, die hilfreichen Filtermöglichkeiten und die exzellente Ladenetzabdeckung mit über 800.000 Ladepunkten in Europa.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2"><strong>AUTO BILD Testsieger: größtes Schnellladenetz</strong></h4>
                          <p className="text-sm">Mit dem größten Schnellladenetz in Deutschland punktet EnBW mobility+ beim aktuellen e-mobility Excellence Report. Durch die große Anzahl an Schnellladepunkten in Deutschland liegt die EnBW weit vor anderen Ladenetz-Betreibern.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2"><strong>Elektroautomobil Testsieger: dreifacher Testsieg für unsere Tarife</strong></h4>
                          <p className="text-sm">Das Magazin „elektroautomobil" hat die EnBW mobility+ Ladetarife gleich dreimal zum Testsieger gekürt und lobte besonders das „stimmige Gesamtpaket aus hoher Verfügbarkeit an Ladepunkten, der durchdachten App und den fairen Ladepreisen".</p>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 mt-6"><strong>Wie können wir noch besser werden?</strong></h3>
                        <p className="mb-4">Wir möchten, dass die EnBW mobility+ App perfekt zu Ihren Anforderungen passt und elektrisch Fahren Freude macht. Deshalb sind wir gespannt auf Ihr Feedback an mobility@enbw.com.</p>
                        
                        <p className="mb-4 font-medium">Allzeit gute Fahrt im EnBW HyperNetz!</p>
                        <p className="mb-4 font-medium">Ihr EnBW mobility+ Team</p>
                        
                        {/* Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-blue-600 mb-2">Jetzt EnBW App herunterladen</p>
                        </div>
                        
                        {/* Botones de descarga para EnBW mobility+ */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href={app.googlePlayUrl || "https://play.google.com/store/apps/details?id=com.enbw.ev&hl=de"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            EnBW App herunterladen - Google Play
                          </a>
                          
                          <a 
                            href={app.appStoreUrl || "https://apps.apple.com/de/app/enbw-mobility-e-auto-laden/id1232210521"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            EnBW App herunterladen - App Store
                          </a>
                        </div>
                        
                        {/* Second Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-green-600">Jetzt EnBW App herunterladen</p>
                        </div>
                        
                        {/* Keywords para SEO */}
                        <div className="sr-only">
                          <p>EnBW mobility+ App</p>
                          <p>EnBW App herunterladen</p>
                          <p>EnBW mobility+ installieren</p>
                          <p>EnBW mobility+ Download</p>
                          <p>EnBW App für Android</p>
                          <p>EnBW App für iOS</p>
                          <p>EnBW App für Elektroauto</p>
                          <p>EnBW mobility+ AutoCharge</p>
                          <p>EnBW mobility+ Schnellladen</p>
                          <p>EnBW App Ladestationen</p>
                        </div>
                        
                        {/* ALT text optimized images - hidden for SEO */}
                        <div className="sr-only">
                          <img alt="EnBW App herunterladen" />
                          <img alt="EnBW App für Elektroauto" />
                          <img alt="EnBW App AutoCharge" />
                          <img alt="EnBW App Schnellladen" />
                        </div>
                      </>
                    ) : isLyftPage ? (
                      <>
                        <h3 className="text-xl font-bold mb-3">Download the Lyft App – Fast, Safe Rides</h3>
                        
                        <p className="mb-3">Get the official Lyft ride app for iPhone and Android. Request your ride in seconds.</p>
                        
                        <p className="mb-3">The Lyft mobile app makes it easy to get around your city. Whether you're on Android or iPhone, install the Lyft app and start riding today.</p>
                        
                        <p className="mb-3">Download the Lyft app to request a ride in seconds. With the Lyft ride app, you just tap to book a ride, and payment is simple and automatic through the app.</p>
                        
                        <p className="mb-3">Get fast, safe, and affordable rides using the Lyft app. The official Lyft mobile app is available for Android and iPhone users across hundreds of cities.</p>
                        
                        <p className="mb-3">Tap, book, and ride with Lyft—anytime, anywhere. Installing the Lyft app is the fastest way to move around your city.</p>
                        
                        <p className="font-semibold">Get Lyft App for Android or iPhone and enjoy:</p>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Quick ride requests with just a few taps</li>
                          <li>Upfront pricing with no surprises</li>
                          <li>Multiple ride options to fit your needs</li>
                          <li>Real-time driver location tracking</li>
                          <li>Easy payment through the app</li>
                        </ul>
                        
                        <p className="mb-3">Download Lyft today and have a ride ready whenever you need it. Install the Lyft App on your phone and enjoy the convenience of on-demand rides!</p>
                        
                        {/* Keywords ocultos para SEO pero visibles para lectores de pantalla */}
                        <div className="sr-only">
                          <p>Lyft App</p>
                          <p>Download Lyft</p>
                          <p>Lyft Mobile App</p>
                          <p>Request a Lyft ride</p>
                          <p>Get Lyft app</p>
                          <p>Lyft app for Android</p>
                          <p>Lyft app for iPhone</p>
                          <p>Install Lyft on Your Phone</p>
                          <p>Lyft Rider App</p>
                        </div>
                      </>
                    ) : isElectrifyAmericaPage ? (
                      <>
                        <h3 className="text-xl font-bold mb-3">Download Electrify America App – Find EV Charging Stations Fast</h3>
                        
                        <p className="mb-3">Get the Electrify America app to locate chargers, manage your EV sessions, and pay easily.</p>
                        
                        <p className="mb-3">Use the Electrify America app to find charging stations across the U.S. Whether you're nearby or on a road trip, Electrify America keeps your EV moving.</p>
                        
                        <p className="mb-3">Charging at Electrify America is easy with the mobile app. Simply locate a station, start charging your EV in seconds—just tap and go.</p>
                        
                        <p className="mb-3">Learn how to use Electrify America and manage all your sessions from your phone. The app shows real-time charger availability and allows you to monitor your charging progress.</p>
                        
                        <p className="mb-3">Looking for EV charging near me? The Electrify America app makes it simple to find charging stations wherever you are.</p>
                        
                        <p className="font-semibold">Download the Electrify America app and enjoy:</p>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Fast station location with interactive maps</li>
                          <li>Real-time charger availability</li>
                          <li>Simple payment through the app</li>
                          <li>Charging session monitoring</li>
                          <li>Saved favorite locations</li>
                          <li>Manage your electric vehicle charging easily</li>
                        </ul>
                        
                        <p className="mb-3">Start charging your EV with ease. Download the Electrify America app today and experience convenient, reliable electric vehicle charging across the country!</p>
                        
                        {/* Keywords ocultos para SEO pero visibles para lectores de pantalla */}
                        <div className="sr-only">
                          <p>Electrify America app</p>
                          <p>Download Electrify America app</p>
                          <p>Find charging stations</p>
                          <p>EV charging near me</p>
                          <p>How to use Electrify America</p>
                          <p>Charging at Electrify America</p>
                          <p>Electrify America near me</p>
                          <p>Start charging your EV</p>
                          <p>Manage your electric vehicle charging</p>
                        </div>
                      </>
                    ) : isChargePointPage ? (
                      <>
                        <h3 className="text-xl font-bold mb-3">Download ChargePoint App – EV Charging Made Easy</h3>
                        
                        <p className="mb-3">Find charging stations, start charging, and manage sessions with the ChargePoint app.</p>
                        
                        <p className="mb-3">Download the ChargePoint app to find EV charging stations nearby and on your route. With thousands of charging locations across the country, ChargePoint makes it simple to keep your electric vehicle powered up.</p>
                        
                        <p className="mb-3">Start charging in seconds and track your charging history on your phone. The ChargePoint app allows you to manage your charging experience from start to finish with just a few taps.</p>
                        
                        <p className="mb-3">The ChargePoint app supports Android and iOS for all EV drivers. No matter what electric vehicle you drive, ChargePoint provides a seamless charging experience.</p>
                        
                        <p className="mb-3">Whether you're at home or on a road trip, the ChargePoint app helps you stay charged. Locate ChargePoint near me with the interactive station map and never worry about running out of power.</p>
                        
                        <p className="mb-3">Learn how to use ChargePoint for fast and reliable EV charging. The app guides you through the entire process for a hassle-free experience.</p>
                        
                        <p className="font-semibold">Get the ChargePoint app and enjoy these features:</p>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Find available charging stations in real-time</li>
                          <li>Start and stop charging sessions remotely</li>
                          <li>Receive notifications when your car is fully charged</li>
                          <li>Track your charging history and energy usage</li>
                          <li>Set charging reminders and favorites</li>
                          <li>Pay for charging sessions securely through the app</li>
                        </ul>
                        
                        <p className="mb-3">Install ChargePoint app today and experience the convenience of managing your EV charging from anywhere. Download now and join the largest EV charging network!</p>
                        
                        {/* Keywords ocultos para SEO pero visibles para lectores de pantalla */}
                        <div className="sr-only">
                          <p>ChargePoint app</p>
                          <p>Download ChargePoint</p>
                          <p>EV charging with ChargePoint</p>
                          <p>Find charging stations</p>
                          <p>Start charging with the ChargePoint app</p>
                          <p>ChargePoint station map</p>
                          <p>Install ChargePoint app</p>
                          <p>ChargePoint near me</p>
                          <p>How to use ChargePoint</p>
                        </div>
                      </>
                    ) : isHBOMaxPage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">Download HBO Max App – Stream HBO TV & Movies Instantly</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Start your HBO Max subscription and enjoy exclusive series, movies and Max Originals.</h2>
                        
                        <p className="mb-3">Download HBO Max and unlock unlimited access to the world's most talked-about shows and movies. The HBO app for Android and iOS brings you exclusive HBO series, blockbuster movies, and Max Originals right to your fingertips. Install the HBO Max app today and start streaming instantly.</p>
                        
                        <p className="mb-3">With your HBO Max subscription, you'll get access to thousands of premium titles including The Last of Us, House of the Dragon, Succession, and The White Lotus. Stream HBO Max shows and movies with the highest video and audio quality available.</p>
                        
                        <p className="mb-3">Get the HBO Max app now and enjoy seamless streaming across all your devices. Your Max subscription lets you watch on any device – phone, tablet, Smart TV, or laptop. Download Max app and enjoy offline viewing, so you can watch your favorite content anywhere, anytime.</p>
                        
                        <p className="mb-3">Install the HBO Max app for personalized profiles and parental controls. Watch HBO Max on your Smart TV, mobile device, tablet, and gaming console with crystal-clear picture quality and immersive sound.</p>
                        
                        <h3 className="text-xl font-bold mb-3">Why Download HBO Max?</h3>
                        
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Stream HBO Max shows including exclusive Max Originals not available anywhere else</li>
                          <li>HBO app for Android and iOS with seamless streaming across all devices</li>
                          <li>Download Max app to continue watching where you left off across devices</li>
                          <li>HBO Max subscription includes live sports and breaking news coverage</li>
                          <li>Get the HBO Max app now for award-winning documentaries and true crime series</li>
                          <li>Max subscription lets you watch on any device with multiple user profiles</li>
                          <li>Download shows and movies for offline viewing with select plans</li>
                          <li>Stream up to 3 games simultaneously with Multiview experience</li>
                        </ul>
                        
                        <p className="mb-3">Get the HBO Max app now and join millions of subscribers enjoying premium entertainment. Your Max subscription lets you watch on any device, anywhere, anytime. Download HBO Max today and start your premium streaming experience with exclusive content you can't find anywhere else.</p>
                        
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-blue-600 mb-2">Download HBO Max Now</p>
                        </div>
                        
                        {/* Botones de descarga para HBO Max */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=com.wbd.stream&hl=en_US"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Download HBO Max App for Android on Google Play
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/us/app/max-stream-hbo-tv-movies/id1666653815"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Download HBO Max App for iOS on App Store
                          </a>
                        </div>
                        
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-green-600">Download HBO Max Now</p>
                        </div>
                        
                        {/* Keywords para SEO */}
                        <div className="sr-only">
                          <p>Download HBO Max</p>
                          <p>HBO Max subscription</p>
                          <p>HBO app for Android and iOS</p>
                          <p>Install the HBO Max app</p>
                          <p>Stream HBO Max shows and movies</p>
                          <p>Max subscription lets you watch on any device</p>
                          <p>Get the HBO Max app now</p>
                          <p>Watch HBO Max on your Smart TV</p>
                          <p>Download Max app and enjoy offline viewing</p>
                        </div>
                        
                        {/* ALT text optimized images - hidden for SEO */}
                        <div className="sr-only">
                          <img alt="Download HBO Max App" />
                          <img alt="HBO Max subscription" />
                          <img alt="Stream HBO movies and shows" />
                          <img alt="Install HBO Max for Android" />
                        </div>
                      </>
                    ) : (
                      app.description
                    )}
                  </div>
                  
                  {/* App Store links - Hidden for BP Pulse and HBO Max as they have integrated download buttons */}
                  {!isBPPulsePage && !isHBOMaxPage && (
                    <div className="mt-4 flex flex-col space-y-3">
                      {/* Google Play download link */}
                      <a 
                        href={app.googlePlayUrl || app.downloadUrl}
                        className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                        onClick={(e) => handleGooglePlayClick(e)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-app-id={app.id}
                        data-event="click:googlePlay"
                      >
                        <PlayCircle size={20} />
                        {isUberPage || isLyftPage || isElectrifyAmericaPage || isChargePointPage ? "Download for Android on Google Play" : "Google Play"}
                      </a>

                      {/* iOS App Store links */}
                      {isLyftPage && (
                        <a 
                          href="https://apps.apple.com/us/app/lyft/id529379082"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download for iOS on App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for Uber */}
                      {isUberPage && (
                        <a 
                          href="https://apps.apple.com/us/app/uber-request-a-ride/id368677368"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download for iOS on App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for Electrify America */}
                      {isElectrifyAmericaPage && (
                        <a 
                          href="https://apps.apple.com/us/app/electrify-america/id1458030456"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download for iOS on App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for ChargePoint */}
                      {isChargePointPage && (
                        <a 
                          href="https://apps.apple.com/us/app/chargepoint/id356866743"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download for iOS on App Store
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "screenshots" && (
                <div className="mb-6">
                  <div className="relative">
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                      {app.screenshots.map((screenshot, index) => (
                        <img 
                          key={index}
                          src={screenshot} 
                          className="h-72 w-auto rounded-lg object-cover" 
                          alt={`Screenshot ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* Navigation buttons */}
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100">
                      <i className="fas fa-chevron-left text-gray-600"></i>
                    </button>
                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100">
                      <i className="fas fa-chevron-right text-gray-600"></i>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === "info" && (
                <div className="mb-6 space-y-4">
                  {/* App info grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.category', 'Category')}</h3>
                      <p className="font-medium">
                        <Link href={`/category/${isAppLegacy(app) ? app.categoryId : ''}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {getCategoryName(app)}
                          </span>
                        </Link>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.downloads', 'Downloads')}</h3>
                      <p className="font-medium">{app.downloads}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.updated', 'Last Updated')}</h3>
                      <p className="font-medium">{app.updated}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.version', 'Version')}</h3>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.size', 'Size')}</h3>
                      <p className="font-medium">{app.size}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{translate('ui.requires', 'Requires')}</h3>
                      <p className="font-medium">{app.requires || 'Android 5.0+'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Apps */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">{translate('ui.relatedApps', 'Related Apps')}</h2>
          
          {isLoadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-3 rounded-lg shadow animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : relatedApps && relatedApps.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{translate('common.noRelatedApps', 'No related apps found')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetail;