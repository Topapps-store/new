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
import BookingComSEO from "../components/BookingComSEO";
import { useTranslation } from "../hooks/useTranslation";
import { ClickTracker } from "../components/ClickTracker";



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
    
    // SEO optimization for Chargemap page - targeting "Chargemap Pass" keyword
    if (appId === 'chargemap-charging-stations') {
      // Update page title with focus on "Chargemap Pass" keyword
      document.title = 'Chargemap Pass | Télécharger App & Utiliser le Pass de Recharge';
      
      // Update meta description with primary focus on "Chargemap Pass"
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Obtenez le Chargemap Pass, localisez les bornes et rechargez votre véhicule avec Chargemap app. Télécharger l\'application Chargemap Pass maintenant.');
      
      // Add lang attribute for French
      document.documentElement.setAttribute('lang', 'fr');
      
      // Add keywords meta tag focused on "Chargemap Pass"
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'Chargemap Pass, utiliser Chargemap Pass, Chargemap pass recharge, application Chargemap Pass, badge Chargemap Pass');
    }
    // SEO optimization for Electra page
    else if (appId === 'electra-charging-hubs') {
      // Update page title with French keywords
      document.title = 'Electra App | Télécharger pour Recharge Voiture';
      
      // Update meta description with all keywords
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Téléchargez Electra, trouvez les bornes et rechargez votre voiture électrique rapidement. Application gratuite pour iOS et Android.');
      
      // Add lang attribute for French
      document.documentElement.setAttribute('lang', 'fr');
      
      // Add keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'télécharger Electra, application Electra, Electra app, Electra bornes recharge, Electra voiture électrique, app Electra gratuite');
    }
    // SEO optimization for Uber Ride App page
    else if (appId === 'uber-request-a-ride') {
      // Update page title with English keywords
      document.title = 'Download Uber Rides App | Get an Uber Now';
      
      // Update meta description with all keywords
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Download the Uber app for Android free. Need an Uber ride now? Book fast and easy.');
      
      // Add lang attribute for English
      document.documentElement.setAttribute('lang', 'en');
      
      // Add keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'download uber rides app, uber ride app, need uber ride now, get an uber, uber ride sharing app, uber app download, uber app download for android, uber app download free for android');
    }
    // SEO optimization for Romanian Uber page
    else if (appId === 'uber-romania') {
      // Update page title with Romanian keywords
      document.title = 'Descarcă Uber App | Comandă Uber Taxi Rapid în România';
      
      // Update meta description with all keywords
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Descarcă Uber app, comandă Uber taxi rapid și sigur în România. Transport urban sigur cu aplicația Uber pentru călătorii rapide în România.');
      
      // Add lang attribute for Romanian
      document.documentElement.setAttribute('lang', 'ro');
      
      // Add keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'Uber, Uber taxi, Uber app, transport urban, aplicație taxi, ride sharing, călătorii rapide, România');
      
    }
    // SEO optimization for Uber France page - optimized for Google Ads 10/10 Quality Score
    else if (appId === 'uber-france') {
      // Update page title with main French keywords
      document.title = 'Télécharger Uber App France | Uber Course Taxi Transport';
      
      // Update meta description with all keywords
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Télécharger Uber app France. Réservez votre course en quelques clics. Uber taxi, transport fiable 24h/24 dans toute la France.');
      
      // Add lang attribute for French
      document.documentElement.setAttribute('lang', 'fr');
      
      // Add keywords meta tag with all Google Ads keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'télécharger uber, uber app, application uber, uber france, uber course, uber taxi, uber transport, uber paris, uber lyon, uber marseille, uber chauffeur, uber voiture, uber prix');
      
    }
    
    // Get or create meta description element
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }

    // Personalizar SEO según la página
    if (appId === 'uber-request-a-ride') {
      // Establecer nuevo título
      document.title = "Download Uber App – Request a Ride Today | TopApps Store";
      metaDesc.setAttribute('content', 'Get the Uber ride app for Android or iPhone. Download now and request safe, fast rides.');
    } 
    else if (appId === 'lyft') {
      // Establecer nuevo título
      document.title = "Download Lyft App – Book Your Lyft Ride in Seconds | TopApps Store";
      metaDesc.setAttribute('content', 'Download Lyft app for instant Lyft ride booking. Get safe, affordable Lyft rides with upfront pricing. Book your Lyft ride now with the official Lyft app.');
    }
    else if (appId === 'bolt-france') {
      // SEO optimisé pour Google Ads français
      document.title = "Télécharger Bolt App – Commandez un Trajet Instantané | TopApps Store";
      metaDesc.setAttribute('content', 'Téléchargez l\'application Bolt pour commander un trajet en France. Installer Bolt app, réservez un taxi Bolt 24/7. Service de transport fiable et rapide.');
    }
    else if (appId === 'electrify-america') {
      // Establecer título y descripción optimizados para Electrify America
      document.title = "Download Electrify America App | Fast EV Charging Stations Near You";
      metaDesc.setAttribute('content', 'Get the Electrify America app to locate chargers, start charging, and manage your EV trips.');
    }
    else if (appId === 'chargepoint') {
      // Establecer título y descripción optimizados para ChargePoint
      document.title = "Download ChargePoint App | EV Charging Stations Near You";
      metaDesc.setAttribute('content', 'Get the ChargePoint app to find EV charging stations, start charging, and manage sessions.');
    }
    else if (appId === 'bp-pulse') {
      // Establecer título y descripción optimizados para BP Pulse según especificaciones de Google Ads
      document.title = "Descargar App BP Pulse | Carga tu Coche Eléctrico Rápido y Fácil";
      metaDesc.setAttribute('content', 'Instala la app oficial de BP Pulse y encuentra puntos de carga cerca de ti. Disponible para Android y iPhone.');
    }
    else if (appId === 'enbw-mobility-ev-charging') {
      // Establecer título y descripción optimizados para EnBW mobility+ según especificaciones de Google Ads
      document.title = "EnBW mobility+ App herunterladen | Schnellladen für Elektroautos";
      metaDesc.setAttribute('content', 'EnBW App für Android & iOS. Finde Ladestationen, nutze AutoCharge und lade dein Elektroauto in Minuten. Jetzt EnBW App herunterladen.');
    }
    else if (appId === 'deliveroo-food-shopping') {
      // SEO optimisé pour Google Ads français - Deliveroo
      document.title = "telecharger deliveroo app – abonnement et paiement rapide";
      metaDesc.setAttribute('content', 'Installez deliveroo app, entrez email & Visa, confirmez votre compte et commandez repas.');
    }
    
    // Limpiar al desmontar
    return () => {
      document.title = originalTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', '');
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

  // Verificar si estamos en la página de Uber, Lyft, Electrify America, ChargePoint, BP Pulse, EnBW mobility+, HBO Max, Lose Weight App o Deliveroo
  const isUberPage = appId === 'uber-request-a-ride';
  const isUberRomaniaPage = appId === 'uber-romania';
  const isUberDeutschlandPage = appId === 'uber-deutschland';
  const isUberFrancePage = appId === 'uber-france';
  const isUberArabicPage = appId === 'uber-ar';
  const isLyftPage = appId === 'lyft';
  const isBoltFrancePage = appId === 'bolt-france';
  const isElectrifyAmericaPage = appId === 'electrify-america';
  const isChargePointPage = appId === 'chargepoint';
  const isBPPulsePage = appId === 'bp-pulse';
  const isEnBWPage = appId === 'enbw-mobility-ev-charging';
  const isHBOMaxPage = appId === 'max-stream-hbo-tv-movies';
  const isLoseWeightPage = appId === 'lose-weight-app-for-women';
  const isDeliverooPage = appId === 'deliveroo-food-shopping';
  const isBookingComPage = appId === 'bookingcom-hotels-travel';
  const isChargemapPage = appId === 'chargemap-charging-stations';
  const isElectraPage = appId === 'electra-charging-hubs';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Special App SEO optimizations */}
      {isUberRomaniaPage && app && <UberAppSEO app={app} />}
      {isBookingComPage && app && <BookingComSEO app={app} />}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-[#f2f2f2]">
          {/* Header section with app logo on the left */}
          <div className="flex items-start space-x-4 mt-[14px] mb-[14px]">
            <img 
              src={app.iconUrl} 
              alt={isUberPage ? "Uber app download icon" : 
                   isUberArabicPage ? "تحميل تطبيق أوبر - Uber app download" :
                   isUberRomaniaPage ? "Buton descărcare aplicația Uber" :
                   isUberDeutschlandPage ? "Uber App Deutschland herunterladen" :
                   isUberFrancePage ? "Télécharger Uber app France - Uber course taxi" :
                   isLyftPage ? "Lyft App Android iPhone" : 
                   isElectrifyAmericaPage ? "Electrify America app download" :
                   isChargePointPage ? "Download ChargePoint app" :
                   isBPPulsePage ? "Descargar BP Pulse app" :
                   isEnBWPage ? "EnBW App herunterladen" :
                   isLoseWeightPage ? "Lose weight app for women - Get fit at home" :
                   isDeliverooPage ? "telecharger deliveroo app" :
                   isBookingComPage ? "Booking app download - Beach hotel & hotels close to the beach" :
                   isChargemapPage ? "Chargemap Pass - télécharger application recharge" :
                   isElectraPage ? "application Electra" :
                   isUberPage ? "download uber rides app" :
                   app.name} 
              className="w-16 h-16 object-contain rounded-2xl flex-shrink-0"
            />
            
            <div className="flex-1">
              <h1 className="text-lg font-bold mb-2">
                {isUberPage ? "Uber App - Request a Ride" :
                 isUberArabicPage ? "Uber / أوبر- اطلب سيارة" :
                 isUberRomaniaPage ? "Descarcă aplicația Uber" : 
                 isUberDeutschlandPage ? "Uber App Deutschland - Fahrt anfordern" :
                 isUberFrancePage ? "Uber : Commander une course" :
                 isLyftPage ? "Lyft" : 
                 isBoltFrancePage ? "Bolt App : Télécharger Bolt pour Commander Course Taxi" :
                 isElectrifyAmericaPage ? "Electrify America" :
                 isChargePointPage ? "ChargePoint" :
                 isBPPulsePage ? "BP Pulse" :
                 isLoseWeightPage ? "Lose Weight App for Women" :
                 isDeliverooPage ? "Telecharger deliveroo app – livraison repas rapide" :
                 isBookingComPage ? "Booking.com App: Hotels & Travel" :
                 isChargemapPage ? "Chargemap app – Bornes de recharge" :
                 isElectraPage ? "Electra – Application Recharge Rapide" :
                 isUberPage ? "Download Uber Rides App – Get an Uber Ride Now" :
                 app.name}
              </h1>
              
              <div className="flex items-center mb-3">
                <StarRating rating={app.rating} showScore={true} />
              </div>
            </div>
          </div>
          
          {/* App Info Cards - moved below and full width justified */}
          <div className="grid grid-cols-3 gap-4 text-sm mb-4 px-4">
            <div>
              <p className="text-gray-600 font-medium mb-1">{translate('ui.downloads', 'Downloads')}</p>
              <p className="text-gray-500 text-xs">{app.downloads || '100.8M'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 font-medium mb-1">{translate('ui.developer', 'Developer')}</p>
              <p className="text-gray-500 text-xs">{app.developer}</p>
            </div>
            
            <div>
              <p className="text-gray-600 font-medium mb-1">{translate('ui.category', 'Category')}</p>
              <p className="text-gray-500 text-xs">{getCategoryName(app)}</p>
            </div>
          </div>
          
          {/* Advertisement and download button section */}
          <div className="px-4">
            <div className="border border-gray-200 rounded-lg px-2 relative flex flex-col justify-center items-center min-h-[50px] mb-4 bg-[#f9faf9] ml-[-24px] mr-[-24px] pt-[17px] pb-[17px]">
              <div className="text-gray-400 mb-3 text-left absolute top-1 left-2 text-[12px]">
                {translate('ui.advertisement', 'ADVERTISEMENT')}
              </div>
              
              <button className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">
                ×
              </button>
              
              <div className="mb-6 mt-4">
                <DownloadButton 
                  appId={app?.id || ''} 
                  customUrl={app?.downloadUrl || 'https://topapps.store/download'} 
                />
              </div>
              
              
            </div>
          </div>
          
          <div className="px-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-full">
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
                    {translate('ui.screenshots', 'Screenshots')}
                  </button>
                  <button
                    className={`pb-1 text-sm font-medium ${
                      activeTab === "info"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    {translate('ui.information', 'Information')}
                  </button>
                </div>
              
                {activeTab === "description" && (
                <div className="mb-3">
                  <div className="text-gray-700 whitespace-pre-line text-sm">
                    {isUberPage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-blue-600">Uber app download free for Android – Need Uber ride now? Get the Uber ride app today.</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Download uber rides app</strong> and experience the convenience of on-demand transportation. 
                            The <strong>uber ride app</strong> connects you with drivers in minutes, making it easy when you <strong>need uber ride now</strong>.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🚗 Why Get an Uber App:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Get an uber</strong> in minutes with real-time tracking</li>
                              <li><strong>Uber ride sharing app</strong> available 24/7 worldwide</li>
                              <li><strong>Uber app download</strong> is completely free</li>
                              <li>Safe and reliable <strong>uber ride app</strong> experience</li>
                            </ul>
                          </div>
                          
                          <p className="text-lg">
                            Ready for <strong>uber app download for android</strong>? The <strong>uber app download free for android</strong> 
                            gives you instant access to rides in over 10,000 cities worldwide.
                          </p>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">📱 Download Features:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Download uber rides app</strong> for instant booking</li>
                              <li><strong>Uber ride sharing app</strong> with cashless payments</li>
                              <li><strong>Uber app download for android</strong> and iOS</li>
                              <li>Track your driver in real-time with the <strong>uber ride app</strong></li>
                            </ul>
                          </div>
                          
                          <p className="text-lg font-semibold text-center py-4 bg-yellow-50 rounded-lg">
                            🚀 <strong>Need uber ride now</strong>? <strong>Get an uber</strong> with just a few taps! 
                            <strong>Download uber rides app</strong> today and join millions of satisfied riders.
                          </p>
                        </div>
                        
                        {/* Keywords hidden for SEO but visible to screen readers */}
                        <div className="sr-only">
                          <p>download uber rides app</p>
                          <p>uber ride app</p>
                          <p>need uber ride now</p>
                          <p>get an uber</p>
                          <p>uber ride sharing app</p>
                          <p>uber app download</p>
                          <p>uber app download for android</p>
                          <p>uber app download free for android</p>
                          <p>Fast, Safe, and Easy Rides</p>
                        </div>
                      </>
                    ) : isUberArabicPage ? (
                      <>
                        <div className="space-y-4" dir="rtl">
                          <h2 className="text-xl font-bold text-blue-600">تحميل تطبيق أوبر مجاناً للأندرويد - تحتاج سيارة أوبر الآن؟ احصل على تطبيق أوبر اليوم</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>تحميل تطبيق أوبر</strong> واستمتع بسهولة النقل عند الطلب. 
                            يربطك <strong>تطبيق أوبر</strong> بالسائقين في دقائق، مما يجعل الأمر سهلاً عندما <strong>تحتاج سيارة أوبر الآن</strong>.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🚗 لماذا تحصل على تطبيق أوبر:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>احصل على أوبر</strong> في دقائق مع تتبع فوري</li>
                              <li><strong>تطبيق أوبر لمشاركة الرحلات</strong> متاح 24/7 حول العالم</li>
                              <li><strong>تحميل تطبيق أوبر</strong> مجاني تماماً</li>
                              <li>تجربة <strong>تطبيق أوبر</strong> آمنة وموثوقة</li>
                            </ul>
                          </div>
                          
                          <p className="text-lg">
                            مستعد لـ <strong>تحميل تطبيق أوبر للأندرويد</strong>؟ يمنحك <strong>تحميل تطبيق أوبر مجاناً للأندرويد</strong> 
                            وصولاً فورياً للرحلات في أكثر من 10,000 مدينة حول العالم.
                          </p>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">📱 ميزات التحميل:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>تحميل تطبيق أوبر</strong> للحجز الفوري</li>
                              <li><strong>تطبيق أوبر لمشاركة الرحلات</strong> مع مدفوعات بدون نقد</li>
                              <li><strong>تحميل تطبيق أوبر للأندرويد</strong> و iOS</li>
                              <li>تتبع سائقك في الوقت الفعلي مع <strong>تطبيق أوبر</strong></li>
                            </ul>
                          </div>
                          
                          <p className="text-lg font-semibold text-center py-4 bg-yellow-50 rounded-lg">
                            🚀 <strong>تحتاج سيارة أوبر الآن</strong>؟ <strong>احصل على أوبر</strong> بنقرات قليلة فقط! 
                            <strong>تحميل تطبيق أوبر</strong> اليوم وانضم لملايين الركاب المرضيين.
                          </p>
                        </div>
                        
                        {/* كلمات مفتاحية مخفية للSEO ولكن مرئية لقارئات الشاشة */}
                        <div className="sr-only">
                          <p>تحميل تطبيق أوبر</p>
                          <p>تطبيق أوبر</p>
                          <p>تحتاج سيارة أوبر الآن</p>
                          <p>احصل على أوبر</p>
                          <p>تطبيق أوبر لمشاركة الرحلات</p>
                          <p>تحميل تطبيق أوبر للأندرويد</p>
                          <p>تحميل تطبيق أوبر مجاناً للأندرويد</p>
                          <p>رحلات سريعة وآمنة وسهلة</p>
                        </div>
                      </>
                    ) : isUberRomaniaPage ? (
                      <>
                        <h2 className="text-xl font-bold mb-4">Uber taxi rapid și sigur în România</h2>
                        
                        <p className="mb-3">Descarcă aplicația Uber și comandă un Uber taxi rapid și sigur în România. Uber app îți oferă acces instant la transport urban de calitate cu șoferi verificați.</p>
                        
                        <p className="mb-3">Cu aplicația Uber, poți comanda un Uber taxi în câteva secunde și urmări călătoria în timp real. Uber app este disponibilă pentru Android și iPhone, oferind servicii de transport sigur în toate orașele mari din România.</p>
                        
                        <p className="mb-3">Uber taxi în România înseamnă călătorii rapide, sigure și convenabile. Aplicația Uber îți permite să plătești direct din telefon și să evaluezi experiența cu fiecare Uber taxi.</p>
                        
                        <p className="mb-3">Descarcă Uber app acum și bucură-te de serviciul de Uber taxi care conectează milioane de utilizatori cu șoferi profesioniști. Transport urban nu a fost niciodată mai simplu cu aplicația Uber.</p>
                        
                        <h4 className="font-semibold mb-2">De ce să alegi Uber app în România?</h4>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>Descarcă aplicația Uber pentru acces instant la transport</li>
                          <li>Uber taxi cu urmărire în timp real</li>
                          <li>Uber app compatibilă cu Android și iOS</li>
                          <li>Plată simplă și sigură prin aplicația Uber</li>
                          <li>Estimări de preț înainte de comandă</li>
                          <li>Șoferi verificați pentru călătorii sigure</li>
                        </ul>
                        
                        <p className="mb-3">Alătură-te milioanelor de utilizatori care au ales aplicația Uber pentru transport urban în România. Comandă primul tău Uber taxi și experimentează diferența!</p>
                        
                        {/* Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-blue-600 mb-2">Descarcă Uber app acum</p>
                        </div>
                        
                        {/* Botones de descarga para Uber Romania */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=com.ubercab&hl=ro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Descarcă Uber app - Google Play
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/ro/app/uber-comand%C4%83-o-ma%C8%99in%C4%83/id368677368?l=ro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Descarcă Uber app - App Store
                          </a>
                        </div>
                        
                        {/* Second Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-green-600">Comandă primul tău Uber taxi</p>
                        </div>
                        
                        {/* Keywords pentru SEO în română */}
                        <div className="sr-only">
                          <p>Uber</p>
                          <p>Uber taxi</p>
                          <p>Uber app</p>
                          <p>aplicația Uber</p>
                          <p>descarcă Uber app</p>
                          <p>transport urban România</p>
                          <p>călătorii rapide</p>
                          <p>taxi sigur România</p>
                        </div>
                      </>
                    ) : isUberDeutschlandPage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">Uber App Deutschland herunterladen - Fahrt anfordern leicht gemacht</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Laden Sie die Uber App herunter und fordern Sie eine Fahrt in Deutschland an. Uber Deutschland bietet schnelle und sichere Fahrten mit verifizierten Fahrern.</h2>
                        
                        <p className="mb-3">Uber App herunterladen und eine Fahrt in Deutschland anfordern war noch nie so einfach! Die Uber Deutschland App verbindet Sie mit Fahrern in Ihrer Nähe und bietet sichere Fahrten zu transparenten Preisen.</p>
                        
                        <h3 className="text-lg font-semibold mb-2">🚗 Warum Uber App Deutschland herunterladen?</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Fahrt anfordern in Deutschland 24/7 verfügbar</li>
                          <li>Uber Deutschland App mit Echtzeit-Tracking</li>
                          <li>Sichere Zahlungen direkt über die Uber App</li>
                          <li>Transparente Preise vor der Fahrt anfordern</li>
                          <li>Verifizierte Fahrer für sicheres Reisen</li>
                          <li>Verschiedene Fahrzeugtypen verfügbar</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2">📱 Uber Deutschland Features</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Einfach Uber App herunterladen und registrieren</li>
                          <li>Schnell eine Fahrt anfordern mit einem Tippen</li>
                          <li>Fahrer in Echtzeit verfolgen</li>
                          <li>Fahrten im Voraus planen und buchen</li>
                          <li>Bewertungssystem für Qualitätssicherung</li>
                          <li>Fahrten mit Freunden teilen</li>
                          <li>Kontaktloser Service verfügbar</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2">🌟 Uber Deutschland - Ihr zuverlässiger Partner</h3>
                        <p className="mb-3">Uber App herunterladen und entdecken Sie, warum Millionen von Nutzern Uber Deutschland für ihre täglichen Fahrten vertrauen. Fahrt anfordern war noch nie so komfortabel und sicher.</p>
                        
                        <h3 className="text-lg font-semibold mb-2">⭐ Vorteile der Uber App Deutschland</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Schnell und einfach Fahrt anfordern</li>
                          <li>Uber Deutschland mit landesweiter Abdeckung</li>
                          <li>Sichere und komfortable Fahrten</li>
                          <li>24/7 Kundensupport verfügbar</li>
                          <li>Umweltfreundliche Fahrzeugoptionen</li>
                          <li>Transparente Preisgestaltung</li>
                        </ul>
                        
                        <p className="mb-3">Fahrt anfordern in Deutschland war noch nie so einfach! Uber App herunterladen und erleben Sie die Zukunft der Mobilität mit Uber Deutschland.</p>
                        
                        {/* Call to Action für Deutschland */}
                        <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                          <p className="text-xl font-bold text-green-700 mb-2">Uber App Deutschland jetzt herunterladen</p>
                          <p className="text-gray-600">Fahrt anfordern und erste Fahrt buchen!</p>
                        </div>
                        
                        {/* Download buttons für Deutschland */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=com.ubercab&hl=de"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Uber App Deutschland - Google Play herunterladen
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/de/app/uber/id368677368"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Uber App auf App Store - Fahrt anfordern
                          </a>
                        </div>
                        
                        {/* Call to Action sekundär */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-blue-600">Fahrt anfordern - Ihre erste Uber Deutschland Fahrt</p>
                          <p className="text-sm text-gray-600 mt-1">Uber App herunterladen und sofort losfahren!</p>
                        </div>
                        
                        {/* SEO Keywords für Deutschland */}
                        <div className="sr-only">
                          <p>uber app herunterladen</p>
                          <p>fahrt anfordern</p>
                          <p>uber deutschland</p>
                          <p>uber app deutschland</p>
                          <p>uber herunterladen</p>
                          <p>uber fahrt buchen</p>
                          <p>uber app download</p>
                          <p>taxi app deutschland</p>
                          <p>uber taxi</p>
                          <p>ridesharing deutschland</p>
                          <p>uber fahrer</p>
                          <p>uber fahrt</p>
                          <p>mobility app</p>
                          <p>transport app</p>
                        </div>
                      </>
                    ) : isBoltFrancePage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">Télécharger Bolt App Paris - Commander Bolt Course Taxi 24/7</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Installer Bolt pour réserver bolt course instantanément. Bolt transport fiable à Paris et partout en France.</h2>
                        
                        <p className="mb-3">Télécharger bolt app officielle et commander bolt course en quelques secondes ! Bolt app paris vous permet de réserver bolt taxi premium avec des chauffeurs vérifiés. Installer bolt maintenant pour profiter du meilleur service de bolt transport en France.</p>
                        
                        <h3 className="text-lg font-semibold mb-2">🚗 Pourquoi Télécharger Bolt App Paris ?</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Commander bolt course instantanément 24h/24 et 7j/7</li>
                          <li>Bolt app paris optimisé pour la région parisienne</li>
                          <li>Réserver bolt taxi premium avec estimation de prix</li>
                          <li>Service bolt france avec conducteurs vérifiés</li>
                          <li>Trajet bolt sécurisé avec suivi en temps réel</li>
                          <li>Application bolt rapide et intuitive</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2">📱 Bolt Transport - Fonctionnalités Premium</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Interface simple pour télécharger bolt app</li>
                          <li>Commander bolt taxi en un clic depuis bolt app paris</li>
                          <li>Réserver bolt course à l'avance</li>
                          <li>Historique complet de vos trajets bolt</li>
                          <li>Évaluation des chauffeurs bolt taxi</li>
                          <li>Partage de course bolt avec vos proches</li>
                          <li>Mode économique pour voyager moins cher</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2">🌟 Bolt France - Service de Transport #1</h3>
                        <p className="mb-3">Installer bolt pour découvrir pourquoi des millions d'utilisateurs choisissent bolt transport pour leurs déplacements quotidiens. Télécharger bolt app maintenant et profitez du service bolt taxi le plus fiable à Paris et dans toute la France.</p>
                        
                        <h3 className="text-lg font-semibold mb-2">⭐ Avantages Application Bolt</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Réserver bolt course instantanément avec bolt app paris</li>
                          <li>Commander bolt taxi de qualité premium</li>
                          <li>Bolt france - couverture nationale complète</li>
                          <li>Service client bolt transport disponible 24/7</li>
                          <li>Tarifs transparents pour chaque trajet bolt</li>
                          <li>Paiement sécurisé dans l'application bolt</li>
                        </ul>
                        
                        <p className="mb-3">Commander bolt course n'a jamais été aussi simple ! Télécharger bolt app dès maintenant et découvrez le service de bolt transport qui révolutionne vos déplacements à Paris et en France.</p>
                        
                        {/* Call to Action principal */}
                        <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                          <p className="text-xl font-bold text-green-700 mb-2">Télécharger Bolt App Paris Maintenant</p>
                          <p className="text-gray-600">Installer Bolt et commandez votre première course bolt !</p>
                        </div>
                        
                        {/* Boutons de téléchargement optimisés avec mots-clés */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=ee.mtakso.client&hl=fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Télécharger Bolt App sur Google Play - Commander Bolt Course
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/fr/app/bolt-demandez-un-trajet-24-7/id675033630"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Installer Bolt sur App Store - Réserver Bolt Taxi
                          </a>
                        </div>
                        
                        {/* Section spéciale Bolt Paris */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h3 className="text-lg font-bold text-blue-700 mb-2">🚕 Bolt App Paris - Service Premium</h3>
                          <p className="text-gray-700 mb-2">Bolt app paris couvre toute l'Île-de-France avec des milliers de chauffeurs disponibles. Commander bolt course à Paris n'a jamais été aussi simple !</p>
                          <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                            <li>Bolt paris - service disponible 24h/24</li>
                            <li>Réserver bolt taxi premium dans toute la région</li>
                            <li>Trajet bolt rapide vers tous les aéroports parisiens</li>
                            <li>Application bolt optimisée pour bolt transport urbain</li>
                          </ul>
                        </div>
                        
                        {/* Call to Action secondaire */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-blue-600">Commander Bolt - Votre Premier Trajet Bolt</p>
                          <p className="text-sm text-gray-600 mt-1">Télécharger bolt maintenant et profitez d'une course bolt gratuite !</p>
                        </div>
                        
                        {/* Mots-clés SEO complets pour Google Ads 10/10 */}
                        <div className="sr-only">
                          <p>commander bolt</p>
                          <p>bolt app paris</p>
                          <p>télécharger bolt app</p>
                          <p>télécharger bolt</p>
                          <p>course bolt</p>
                          <p>bolt transport</p>
                          <p>bolt france</p>
                          <p>trajet bolt</p>
                          <p>bolt app</p>
                          <p>bolt paris</p>
                          <p>installer bolt</p>
                          <p>réserver bolt</p>
                          <p>bolt taxi</p>
                          <p>application bolt</p>
                          <p>commander bolt paris</p>
                          <p>télécharger bolt app paris</p>
                          <p>bolt course paris</p>
                          <p>réserver bolt course</p>
                          <p>installer bolt app</p>
                          <p>bolt transport paris</p>
                          <p>application bolt paris</p>
                          <p>commander bolt course</p>
                          <p>bolt taxi paris</p>
                          <p>trajet bolt paris</p>
                        </div>
                      </>
                    ) : isUberFrancePage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-[#374151]">Télécharger Uber app France - Réservez votre course en quelques clics</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Télécharger Uber</strong> en France et découvrez l'application de transport la plus populaire au monde. 
                            L'<strong>Uber app</strong> vous permet de réserver une course rapidement et facilement dans toute la France.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🚗 Fonctionnalités Uber app France :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Uber app</strong> disponible 24h/24 et 7j/7</li>
                              <li><strong>Télécharger Uber</strong> gratuitement sur Android et iOS</li>
                              <li><strong>Uber France</strong> - courses dans toutes les grandes villes</li>
                              <li><strong>Application Uber</strong> avec paiement sécurisé intégré</li>
                              <li><strong>Uber transport</strong> avec chauffeurs professionnels</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">⭐ Avantages de télécharger Uber app :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Uber course</strong> - réservation instantanée</li>
                              <li><strong>Uber taxi</strong> - tarifs transparents et sans surprise</li>
                              <li><strong>Uber chauffeur</strong> - conducteurs vérifiés et notés</li>
                              <li><strong>Uber voiture</strong> - large choix de véhicules</li>
                              <li><strong>Uber prix</strong> - estimation avant la course</li>
                            </ul>
                          </div>
                          
                          <p className="text-lg leading-relaxed">
                            Avec plus de 5 milliards de téléchargements dans le monde, <strong>Uber app</strong> est la référence du transport urbain. 
                            <strong>Télécharger Uber</strong> maintenant et profitez de courses fiables partout en France avec l'<strong>application Uber</strong>.
                          </p>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🇫🇷 Uber France - Villes disponibles :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Uber Paris</strong> - service premium dans la capitale</li>
                              <li><strong>Uber Lyon</strong> - transport rapide et efficace</li>
                              <li><strong>Uber Marseille</strong> - courses dans toute la métropole</li>
                              <li><strong>Uber Toulouse</strong> - déplacements urbains simplifiés</li>
                            </ul>
                          </div>
                          
                          <div className="text-center my-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-700 mb-2">Télécharger Uber App France - Uber Course Tax</p>
                            <p className="text-gray-600">Réservez votre prochaine course avec l'application Uber !</p>
                          </div>
                          
                          <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-700 mb-2">Uber France - Transport fiable</p>
                            <p className="text-gray-600">Télécharger Uber et voyagez en toute sécurité !</p>
                          </div>
                        </div>
                        
                        {/* SEO optimized hidden content for Uber France */}
                        <div className="sr-only">
                          <h4>Uber France Keywords</h4>
                          <p>télécharger Uber, Uber app, application Uber, Uber France, Uber course, Uber taxi, Uber transport, Uber chauffeur, Uber voiture, Uber prix</p>
                          <p>Uber Paris, Uber Lyon, Uber Marseille, Uber Toulouse, Uber app France, télécharger Uber France</p>
                          <img alt="télécharger Uber app" />
                          <img alt="Uber France transport" />
                          <img alt="application Uber course" />
                          <img alt="Uber taxi France" />
                        </div>
                      </>
                    ) : isLyftPage ? (
                      <>
                        <h1 className="text-2xl font-bold mb-3">Download Lyft App – Book Your Lyft Ride in Seconds</h1>
                        <h2 className="text-xl text-gray-700 mb-4">Get instant Lyft ride bookings, compare prices, and enjoy safe transportation with the official Lyft app.</h2>
                        
                        <p className="mb-3">Experience the convenience of Lyft ride booking with the most trusted rideshare app. Whether you need a quick Lyft ride to the airport, office, or anywhere in the city, our app makes transportation simple and affordable.</p>
                        
                        <h3 className="text-lg font-semibold mb-2">Why Choose Lyft Ride Services?</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Instant Lyft ride booking with upfront pricing</li>
                          <li>Multiple ride options: Lyft, Lyft XL, Lyft Lux, and more</li>
                          <li>Safe and reliable Lyft ride experience</li>
                          <li>Real-time tracking for every Lyft ride</li>
                          <li>24/7 customer support for your Lyft ride</li>
                          <li>Affordable Lyft ride prices with transparent billing</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold mb-2">Lyft Ride Features</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          <li>Book a Lyft ride in just a few taps</li>
                          <li>See Lyft ride cost upfront before booking</li>
                          <li>Choose from various Lyft ride types</li>
                          <li>Schedule your Lyft ride in advance</li>
                          <li>Share your Lyft ride with friends and family</li>
                          <li>Rate your Lyft ride driver and provide feedback</li>
                        </ul>
                        
                        <p className="mb-3">Join millions of users who trust Lyft for their daily transportation needs. Download the Lyft app today and experience the best Lyft ride service in your city!</p>
                        
                        {/* Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-pink-600 mb-2">Download Lyft App Now</p>
                        </div>
                        
                        {/* Download buttons for Lyft */}
                        <div className="flex flex-col gap-3 mt-4">
                          <a 
                            href="https://play.google.com/store/apps/details?id=me.lyft.android&hl=en&gl=us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                            </svg>
                            Download Lyft App - Google Play
                          </a>
                          
                          <a 
                            href="https://apps.apple.com/us/app/lyft/id529379082"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Download Lyft App - App Store
                          </a>
                        </div>
                        
                        {/* Second Call to Action */}
                        <div className="text-center my-6">
                          <p className="text-lg font-semibold text-green-600">Book Your First Lyft Ride Today</p>
                        </div>
                        
                        {/* SEO Keywords for Lyft Ride */}
                        <div className="sr-only">
                          <p>Lyft ride</p>
                          <p>Lyft</p>
                          <p>Lyft app</p>
                          <p>book Lyft ride</p>
                          <p>Lyft ride booking</p>
                          <p>Lyft ride cost</p>
                          <p>Lyft ride service</p>
                          <p>download Lyft app</p>
                          <p>Lyft ride near me</p>
                          <p>Lyft ride share</p>
                          <p>safe Lyft ride</p>
                          <p>affordable Lyft ride</p>
                          <p>instant Lyft ride</p>
                          <p>reliable Lyft ride</p>
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
                    ) : isBookingComPage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold text-blue-600">Download Booking App - Beach Hotel & Hotels Close to the Beach</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Download booking app</strong> to find the best <strong>beach hotel</strong> deals and <strong>hotels close to the beach</strong>. 
                            Our <strong>booking app download</strong> gives you instant access to thousands of <strong>hotel beach</strong> properties worldwide.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🏖️ Beach Hotel Booking Features:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Hotel beach</strong> properties with ocean views</li>
                              <li><strong>Beach hotel</strong> deals and exclusive offers</li>
                              <li><strong>Hotels close to the beach</strong> with easy access</li>
                              <li>Instant <strong>booking app</strong> reservations</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">📱 Download Booking App Benefits:</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Download booking app for iOS</strong> - iPhone compatible</li>
                              <li><strong>Download booking app for Android</strong> - all devices</li>
                              <li><strong>Booking app download</strong> - free and instant</li>
                              <li>Exclusive <strong>beach hotel</strong> mobile deals</li>
                            </ul>
                          </div>
                          
                          <p className="text-lg leading-relaxed">
                            Get the official <strong>booking app</strong> and discover amazing <strong>hotel beach</strong> destinations. 
                            <strong>Download booking</strong> today for the best <strong>beach hotel</strong> prices and <strong>hotels close to the beach</strong> recommendations.
                          </p>
                        </div>
                        
                        {/* SEO optimized hidden content */}
                        <div className="sr-only">
                          <h4>Beach Hotel Booking Keywords</h4>
                          <p>hotel beach, beach hotel, hotels close to the beach, booking app, download booking, booking app download, download booking app for iOS, download booking app for android</p>
                        </div>
                      </>
                    ) : isChargemapPage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-blue-600">Obtenez le Chargemap Pass, localisez les bornes et rechargez votre véhicule avec Chargemap app</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Télécharger Chargemap</strong> vous permet d'accéder à plus d'un million de bornes de recharge en Europe. 
                            L'<strong>application Chargemap</strong> est l'outil indispensable pour tous les conducteurs de véhicules électriques qui souhaitent voyager sereinement.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🔌 Fonctionnalités Chargemap app :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Localiser les <strong>bornes de recharge Chargemap</strong> près de vous</li>
                              <li><strong>Utiliser Chargemap Pass</strong> pour payer facilement</li>
                              <li>Planifier vos trajets avec l'<strong>application Chargemap</strong></li>
                              <li>Accéder aux informations en temps réel avec <strong>Chargemap app</strong></li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">⚡ Avantages de télécharger Chargemap :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Application Chargemap</strong> gratuite sur iOS et Android</li>
                              <li><strong>Chargemap app</strong> couvre toute l'Europe</li>
                              <li><strong>Utiliser Chargemap Pass</strong> - paiement universel</li>
                              <li>Communauté active sur l'<strong>application Chargemap</strong></li>
                            </ul>
                          </div>
                          
                          <p className="text-lg leading-relaxed">
                            Avec plus de 2,5 millions d'utilisateurs, <strong>Chargemap app</strong> est la référence pour la recharge de véhicules électriques. 
                            <strong>Télécharger Chargemap</strong> aujourd'hui et découvrez comment <strong>utiliser Chargemap Pass</strong> pour simplifier vos recharges.
                          </p>
                          
                          <div className="text-center my-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-700 mb-2">Télécharger Chargemap maintenant</p>
                            <p className="text-gray-600">Rejoignez la plus grande communauté de conducteurs électriques !</p>
                          </div>
                          
                          {/* Second CTA at bottom of page */}
                          <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-700 mb-2">Télécharger Chargemap maintenant</p>
                            <p className="text-gray-600">Commencez à recharger facilement avec l'application Chargemap !</p>
                          </div>
                        </div>
                        
                        {/* SEO optimized hidden content for Chargemap */}
                        <div className="sr-only">
                          <h4>Chargemap Keywords</h4>
                          <p>télécharger Chargemap, application Chargemap, Chargemap app, utiliser Chargemap Pass, bornes de recharge Chargemap</p>
                          <img alt="télécharger Chargemap" />
                          <img alt="Chargemap app" />
                          <img alt="Chargemap pass recharge" />
                          <img alt="application Chargemap voiture" />
                        </div>
                      </>
                    ) : isElectraPage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-blue-600">Télécharger Electra app pour localiser et recharger votre voiture électrique facilement</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Télécharger Electra</strong> vous permet d'accéder aux bornes de recharge ultra-rapides en Europe. 
                            L'<strong>application Electra</strong> est la solution idéale pour recharger votre <strong>Electra voiture électrique</strong> en quelques minutes seulement.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">⚡ Fonctionnalités Electra app :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Localiser les <strong>Electra bornes recharge</strong> ultra-rapides</li>
                              <li><strong>App Electra gratuite</strong> pour tous les conducteurs</li>
                              <li>Recharge rapide pour votre <strong>Electra voiture électrique</strong></li>
                              <li>Interface intuitive avec l'<strong>application Electra</strong></li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🚗 Avantages de télécharger Electra :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Electra app</strong> 100% gratuite sur iOS et Android</li>
                              <li><strong>Electra bornes recharge</strong> jusqu'à 300 kW</li>
                              <li><strong>Application Electra</strong> simple et efficace</li>
                              <li>Réseau en expansion pour votre <strong>Electra voiture électrique</strong></li>
                            </ul>
                          </div>
                          
                          <p className="text-lg leading-relaxed">
                            Avec les stations <strong>Electra bornes recharge</strong> ultra-rapides, rechargez votre véhicule en 15 minutes. 
                            <strong>Télécharger Electra</strong> maintenant et profitez de l'<strong>app Electra gratuite</strong> pour tous vos trajets.
                          </p>
                          
                          <div className="text-center my-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-700 mb-2">Télécharger Electra app</p>
                            <p className="text-gray-600">Rechargez votre voiture électrique en 15 minutes !</p>
                          </div>
                          
                          {/* Second CTA at bottom of page */}
                          <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-700 mb-2">Télécharger Electra app</p>
                            <p className="text-gray-600">Découvrez la recharge ultra-rapide avec l'application Electra !</p>
                          </div>
                        </div>
                        
                        {/* SEO optimized hidden content for Electra */}
                        <div className="sr-only">
                          <h4>Electra Keywords</h4>
                          <p>télécharger Electra, application Electra, Electra app, Electra bornes recharge, Electra voiture électrique, app Electra gratuite</p>
                          <img alt="application Electra" />
                          <img alt="Electra recharge voiture" />
                          <img alt="Electra bornes recharge" />
                          <img alt="Electra app mobile" />
                        </div>
                      </>
                    ) : isChargemapPage ? (
                      <>
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-blue-600">Obtenez le Chargemap Pass, localisez les bornes et rechargez votre véhicule avec Chargemap app</h2>
                          
                          <p className="text-lg leading-relaxed">
                            <strong>Télécharger Chargemap</strong> vous permet d'accéder à plus d'un million de bornes de recharge en Europe. 
                            L'<strong>application Chargemap</strong> est l'outil indispensable pour tous les conducteurs de véhicules électriques qui souhaitent voyager sereinement.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🔋 Fonctionnalités Chargemap app :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Localiser les <strong>bornes de recharge Chargemap</strong> près de vous</li>
                              <li>Utiliser <strong>Chargemap Pass</strong> pour payer facilement</li>
                              <li>Planifier vos trajets avec <strong>l'application Chargemap</strong></li>
                              <li>Accéder aux informations temps réel avec <strong>Chargemap app</strong></li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">⚡ Avantages de télécharger Chargemap :</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li><strong>Application Chargemap</strong> gratuite sur iOS et Android</li>
                              <li><strong>Chargemap app</strong> couvre toute l'Europe</li>
                              <li><strong>Utiliser Chargemap Pass</strong> - paiement universel</li>
                              <li>Communauté active sur <strong>l'application Chargemap</strong></li>
                            </ul>
                          </div>
                          
                          <p className="text-lg leading-relaxed">
                            Avec plus de 2,5 millions d'utilisateurs, <strong>Chargemap app</strong> est 
                            la référence pour la recharge de véhicules électriques. <strong>Télécharger Chargemap</strong> aujourd'hui et découvrez comment 
                            <strong>utiliser Chargemap Pass</strong> pour simplifier vos recharges.
                          </p>
                          
                          <div className="text-center my-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-700 mb-2">Télécharger Chargemap maintenant</p>
                            <p className="text-gray-600">Rejoignez la plus grande communauté de conducteurs électriques !</p>
                          </div>
                          
                          <div className="text-center my-6 p-4 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-700 mb-2">Télécharger Chargemap maintenant</p>
                            <p className="text-gray-600">Repérez la plus grande communauté de conducteurs électriques en Europe.</p>
                          </div>
                        </div>
                        
                        {/* SEO optimized hidden content for Chargemap Pass */}
                        <div className="sr-only">
                          <h4>Chargemap Pass Keywords</h4>
                          <p>Chargemap Pass, utiliser Chargemap Pass, Chargemap pass recharge, application Chargemap Pass, badge Chargemap Pass</p>
                          <p>télécharger Chargemap, application Chargemap, Chargemap app, utiliser Chargemap Pass, bornes de recharge Chargemap</p>
                          <p>Chargemap Pass badge, Chargemap Pass recharge, Chargemap Pass paiement, Chargemap Pass Europe</p>
                          <img alt="Chargemap Pass badge" />
                          <img alt="utiliser Chargemap Pass" />
                          <img alt="Chargemap Pass recharge" />
                          <img alt="application Chargemap Pass" />
                        </div>
                      </>
                    ) : (
                      app.description
                    )}
                  </div>
                  
                  {/* Advertisement label */}
                  <div className="text-center text-gray-400 text-xs mb-2">
                    {translate('ui.advertisement', 'ADVERTISEMENT')}
                  </div>
                  
                  {/* Additional Download Button at the end of description */}
                  <div className="mt-6 mb-6">
                    <DownloadButton 
                      appId={app?.id || ''} 
                      customUrl={app?.downloadUrl || 'https://topapps.store/download'} 
                    />
                  </div>
                  
                  {/* Elegant Google Play Button */}
                  <div className="mt-6 mb-6">
                    <a 
                      href={isUberRomaniaPage ? "https://play.google.com/store/apps/details?id=com.ubercab&hl=ro&gl=ro" : 
                            isUberDeutschlandPage ? "https://play.google.com/store/apps/details?id=com.ubercab&hl=de&gl=de" : 
                            isBoltFrancePage ? "https://play.google.com/store/apps/details?id=ee.mtakso.client&hl=fr&gl=fr" :
                            isLyftPage ? "https://play.google.com/store/apps/details?id=me.lyft.android&hl=en&gl=us" :
                            app.googlePlayUrl || app.downloadUrl}
                      className="group relative block w-full mx-auto text-center text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                      style={{
                        backgroundColor: '#0F9D58',
                        boxShadow: '0 4px 16px 0 rgba(15, 157, 88, 0.4)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        textDecoration: 'none'
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-app-id={app.id}
                      data-event="click:googlePlayElegant"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0E8A4F';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0F9D58';
                      }}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.807 1.626L15.833 12l1.865-1.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                        </svg>
                        <span className="text-lg font-bold">
                          {isUberPage || isLyftPage || isElectrifyAmericaPage || isChargePointPage ? "Download for Android on Google Play" : 
                           isUberRomaniaPage ? "Descarcă pe Google Play" :
                           isUberDeutschlandPage ? "Uber App Deutschland auf Google Play herunterladen" :
                           isBoltFrancePage ? "Télécharger Bolt App sur Google Play" :
                           isLoseWeightPage ? "Download lose weight app for women on Google Play" :
                           isDeliverooPage ? "Telecharger deliveroo app sur Google Play - commande repas deliveroo" :
                           isBookingComPage ? "Download Booking App for Android - Beach Hotel Bookings" :
                           isChargemapPage ? "Télécharger Chargemap Pass app sur Google Play" :
                           isElectraPage ? "Télécharger Electra app sur Google Play" :
                           isUberPage ? "Download Uber Rides App Now" : "GET IT ON Google Play"}
                        </span>
                      </div>
                    </a>
                  </div>
                  
                  {/* App Store links - Hidden for BP Pulse and HBO Max as they have integrated download buttons */}
                  {!isBPPulsePage && !isHBOMaxPage && (
                    <div className="mt-4 flex flex-col space-y-3">
                      {/* Google Play download link */}
                      <a 
                        href={isUberRomaniaPage ? "https://play.google.com/store/apps/details?id=com.ubercab&hl=ro&gl=ro" : 
                              isUberDeutschlandPage ? "https://play.google.com/store/apps/details?id=com.ubercab&hl=de&gl=de" : 
                              app.googlePlayUrl || app.downloadUrl}
                        className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                        onClick={(e) => handleGooglePlayClick(e)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-app-id={app.id}
                        data-event="click:googlePlay"
                      >
                        <PlayCircle size={20} />
                        {isUberPage || isLyftPage || isElectrifyAmericaPage || isChargePointPage ? "Download for Android on Google Play" : 
                         isUberRomaniaPage ? "Descarcă pe Google Play" :
                         isUberDeutschlandPage ? "Uber App Deutschland auf Google Play herunterladen" :
                         isLoseWeightPage ? "Download lose weight app for women on Google Play" :
                         isDeliverooPage ? "Telecharger deliveroo app sur Google Play - commande repas deliveroo" :
                         isBookingComPage ? "Download Booking App for Android - Beach Hotel Bookings" :
                         isChargemapPage ? "Télécharger Chargemap Pass app sur Google Play" :
                         isElectraPage ? "Télécharger Electra app sur Google Play" :
                         isUberPage ? "Download Uber Rides App Now" : "Google Play"}
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
                      
                      {/* iOS App Store link for Romanian Uber */}
                      {isUberRomaniaPage && (
                        <a 
                          href="https://apps.apple.com/ro/app/uber-request-a-ride/id368677368"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Descarcă pe App Store
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
                      
                      {/* iOS App Store link for Lose Weight App */}
                      {isLoseWeightPage && (
                        <a 
                          href={app.appStoreUrl}
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download lose weight app for women on App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for Deliveroo */}
                      {isDeliverooPage && (
                        <a 
                          href="https://apps.apple.com/fr/app/deliveroo/id1001501844"
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Installer deliveroo sur App Store - deliveroo abonnement
                        </a>
                      )}
                      
                      {/* iOS App Store link for Chargemap */}
                      {isChargemapPage && (
                        <a 
                          href={app.appStoreUrl}
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Télécharger Chargemap Pass app sur App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for Electra */}
                      {isElectraPage && (
                        <a 
                          href={app.appStoreUrl}
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Télécharger Electra app sur App Store
                        </a>
                      )}
                      
                      {/* iOS App Store link for Uber Ride App */}
                      {isUberPage && (
                        <a 
                          href={app.appStoreUrl}
                          className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-app-id={app.id}
                          data-event="click:appStore"
                        >
                          <i className="fab fa-apple text-lg"></i>
                          Download Uber Rides App Now
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
        
        {/* Second CTA button for Uber - positioned before footer */}
        {isUberPage && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg text-white">
              <h3 className="text-xl font-bold mb-2">Download Uber Rides App Now</h3>
              <p className="mb-4">Need an Uber ride now? Get the app and start riding in minutes!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href={app.googlePlayUrl || "https://play.google.com/store/apps/details?id=com.ubercab"}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Uber Rides App Now
                </a>
                <a 
                  href={app.appStoreUrl || "https://apps.apple.com/app/uber/id368677368"}
                  className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Uber Rides App Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDetail;