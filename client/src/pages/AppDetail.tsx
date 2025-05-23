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

  // Verificar si estamos en la página de Uber, Lyft, Electrify America o ChargePoint
  const isUberPage = appId === 'uber-request-a-ride';
  const isLyftPage = appId === 'lyft';
  const isElectrifyAmericaPage = appId === 'electrify-america';
  const isChargePointPage = appId === 'chargepoint';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button - reduced margin */}
      <div className="mb-2">
        <Link href="/">
          <div className="flex items-center text-gray-600 hover:text-primary cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back</span>
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
                       app.name} 
                  className="w-24 h-24 object-contain mb-2 rounded-xl"
                />
                <h1 className="text-xl font-bold text-center">
                  {isUberPage ? "Uber App - Request a Ride" : 
                   isLyftPage ? "Lyft" : 
                   isElectrifyAmericaPage ? "Electrify America" :
                   isChargePointPage ? "ChargePoint" :
                   app.name}
                </h1>
                
                <div className="flex items-center mt-1 mb-3">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                
                {/* Advertisement buttons with affiliate links - moved up, below rating */}
                <div className="w-full mb-3 flex flex-col items-center">
                  <div className="text-[10px] text-gray-500 mb-3 self-start">
                    ADVERTISEMENT
                  </div>
                  
                  {/* Solo mostramos el botón de descarga verde */}
                  <DownloadButton 
                    appId={app?.id || ''} 
                    customUrl={app?.downloadUrl || 'https://topapps.store/download'} 
                  />
                </div>
                
                {/* App Info Cards - more compact */}
                <div className="w-full space-y-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                    <i className="fas fa-download text-green-500 w-6 text-lg"></i>
                    <div>
                      <p className="text-xs text-gray-500">Downloads</p>
                      <p className="font-medium text-sm">{app.downloads || '10M+'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                    <i className="fas fa-code-branch text-blue-500 w-6 text-lg"></i>
                    <div>
                      <p className="text-xs text-gray-500">Developer</p>
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
                  Description
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "screenshots"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("screenshots")}
                >
                  Screenshots
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "info"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  Information
                </button>

              </div>
              
              {activeTab === "description" && (
                <div className="mb-3">
                  <div className="text-gray-700 whitespace-pre-line text-sm">
                    {isUberPage ? (
                      <>
                        <h3 className="text-xl font-bold mb-3">Download the Uber App – Fast & Easy Rides at Your Fingertips</h3>
                        
                        <p className="mb-3">Get the official Uber ride app for Android and iPhone. Request your ride in seconds.</p>
                        
                        <p className="mb-3">The Uber mobile app makes getting around easy and reliable. Whether you're on Android or iPhone, install the Uber app and start riding today.</p>
                        
                        <p className="mb-3">The Uber app connects you to a ride in minutes. With the Uber ride app, you just tap to request a ride, and it's easy to pay with credit or cash in select cities.</p>
                        
                        <p className="mb-3">Whether you're going to the airport or across town, there's an Uber for every occasion. Uber is available in more than 10,000 cities worldwide—download Uber today and take your first trip.</p>
                        
                        <p className="mb-3">Get the Uber ride app now and enjoy safe, fast, and affordable transportation. Download Uber today to book a ride anytime, anywhere.</p>
                        
                        <p className="mb-3">Fast, Safe, and Easy Rides on the Uber mobile app. Install Uber App and Request a Ride with Uber today!</p>
                        
                        <p className="font-semibold">Get Uber App for Android or iPhone and enjoy:</p>
                        <ul className="list-disc pl-5 mt-2 mb-3">
                          <li>One-tap ride requests</li>
                          <li>Multiple payment options</li>
                          <li>Price estimates before you confirm</li>
                          <li>GPS tracking to follow your driver's route</li>
                          <li>Driver ratings and reviews</li>
                        </ul>
                        
                        <p className="mb-3">Uber download is simple. Just tap, install, and ride. Download Uber App now and make transportation easier than ever!</p>
                        
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
                    ) : (
                      app.description
                    )}
                  </div>
                  
                  {/* App Store links */}
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
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="font-medium">
                        <Link href={`/category/${isAppLegacy(app) ? app.categoryId : ''}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {getCategoryName(app)}
                          </span>
                        </Link>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
                      <p className="font-medium">{app.downloads}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                      <p className="font-medium">{app.updated}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Version</h3>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Size</h3>
                      <p className="font-medium">{app.size}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Requires</h3>
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
          <h2 className="text-xl font-bold mb-4">Related Apps</h2>
          
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
            <p className="text-gray-500">No related apps found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetail;