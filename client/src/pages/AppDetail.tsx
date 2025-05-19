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
import TranslatedText from "../components/TranslatedText";


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
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button - reduced margin */}
      <div className="mb-2">
        <Link href="/">
          <div className="flex items-center text-gray-600 hover:text-primary cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>{t('nav.back')}</span>
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
                  alt={app.name} 
                  className="w-24 h-24 object-contain mb-2 rounded-xl"
                />
                <h1 className="text-xl font-bold text-center"><TranslatedText text={app.name} /></h1>
                
                <div className="flex items-center mt-1 mb-3">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                
                {/* Advertisement buttons with affiliate links - moved up, below rating */}
                <div className="w-full mb-3 flex flex-col items-center">
                  <div className="text-[10px] text-gray-500 mb-3 self-start">
                    {t('sponsored.sponsored')}
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
                      <p className="text-xs text-gray-500">{t('appDetail.downloads')}</p>
                      <p className="font-medium text-sm">{app.downloads || '10M+'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                    <i className="fas fa-code-branch text-blue-500 w-6 text-lg"></i>
                    <div>
                      <p className="text-xs text-gray-500">{t('appDetail.developer')}</p>
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
                  {t('appDetail.description')}
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "screenshots"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("screenshots")}
                >
                  {t('appDetail.screenshots')}
                </button>
                <button
                  className={`pb-1 text-sm font-medium ${
                    activeTab === "info"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  {t('appDetail.information')}
                </button>

              </div>
              
              {activeTab === "description" && (
                <div className="mb-3">
                  <p className="text-gray-700 whitespace-pre-line text-sm">
                    <TranslatedText text={app.description} />
                  </p>
                  
                  {/* Google Play download link */}
                  <div className="mt-4">
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
                      {t('appDetail.googlePlay', 'Google Play')}
                    </a>
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
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.category')}</h3>
                      <p className="font-medium">
                        <Link href={`/category/${isAppLegacy(app) ? app.categoryId : ''}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {getCategoryName(app)}
                          </span>
                        </Link>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.downloads')}</h3>
                      <p className="font-medium">{app.downloads}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.lastUpdated')}</h3>
                      <p className="font-medium">{app.updated}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.version')}</h3>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.size')}</h3>
                      <p className="font-medium">{app.size}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('appDetail.requires')}</h3>
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
          <h2 className="text-xl font-bold mb-4">{t('appDetail.relatedApps')}</h2>
          
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
            <p className="text-gray-500">{t('appDetail.noRelatedApps')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetail;