import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { App, AppLegacy, AffiliateLink } from "@shared/schema";
import AppCard from "@/components/AppCard";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";


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

  const { data: app, isLoading } = useQuery<App | AppLegacy>({
    queryKey: [`/api/apps/${appId}`],
  });

  const { data: relatedApps, isLoading: isLoadingRelated } = useQuery<(App | AppLegacy)[]>({
    queryKey: ["/api/apps/related", appId],
  });
  
  // Fetch affiliate links for this app
  const { data: affiliateLinks, isLoading: isLoadingAffiliateLinks } = useQuery<AffiliateLink[]>({
    queryKey: [`/api/apps/${appId}/affiliate-links`],
    enabled: !!appId,
  });

  const handleDownloadClick = () => {
    console.log("Download click:", app?.id);
    // In a real implementation, this would track the download
  };

  const handleGooglePlayClick = () => {
    console.log("Google Play redirect:", app?.id);
    // In a real implementation, this would redirect to Google Play
  };
  
  const handleAffiliateLinkClick = async (linkId: number, linkUrl: string) => {
    // Track the click
    try {
      await apiRequest(`/api/affiliate-links/${linkId}/click`, { method: 'POST' });
      console.log(`Clicked affiliate link: ${linkId}`);
      // Open the link in a new tab
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track affiliate link click:', error);
      // Still open the link even if tracking fails
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
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
                <h1 className="text-xl font-bold text-center">{app.name}</h1>
                
                <div className="flex items-center mt-1 mb-3">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                
                {/* Advertisement buttons with affiliate links - moved up, below rating */}
                <div className="w-full mb-3 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-3 self-start">
                    {t('sponsored.sponsored')}
                  </div>
                  
                  {isLoadingAffiliateLinks ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-14 bg-gray-200 rounded-lg"></div>
                      <div className="h-14 bg-gray-200 rounded-lg"></div>
                    </div>
                  ) : affiliateLinks && affiliateLinks.length > 0 ? (
                    <div className="space-y-2">
                      {affiliateLinks.map((link) => (
                        <div key={link.id} className="relative transform hover:scale-105 transition-all duration-300">
                          {link.label && (
                            <div className="text-xs font-medium mb-0.5">{link.label}</div>
                          )}
                          <a 
                            href={link.url}
                            className="group relative block w-4/5 mx-auto text-center font-bold py-3 px-5 rounded-full mb-1 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden scale-125"
                            style={{ 
                              backgroundColor: link.buttonColor || '#22c55e', 
                              color: 'white',
                              boxShadow: `0 4px 16px 0 ${link.buttonColor ? link.buttonColor + '80' : 'rgba(34, 197, 94, 0.6)'}`,
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleAffiliateLinkClick(link.id, link.url);
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-event="click:affiliateLink"
                            data-affiliate-id={link.id}
                          >
                            {/* Button content with animated download icon */}
                            <span className="relative z-10 flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                              {link.buttonText}
                            </span>
                            
                            {/* Hover overlay effect */}
                            <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                            
                            {/* Reflection animation effect */}
                            <span 
                              className="absolute top-0 left-0 w-1/3 h-full bg-white/20 transform -skew-x-12 opacity-0 group-hover:animate-shimmer"
                              style={{
                                animation: 'shimmer 2s infinite',
                              }}
                            ></span>
                            
                            {/* Pulsing outline effect */}
                            <span className="absolute inset-0 rounded-lg ring-2 ring-white/30 animate-pulse-slow"></span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <a 
                      href={app.downloadUrl} 
                      className="group relative block w-4/5 mx-auto text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full mb-4 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden scale-125"
                      style={{
                        boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.6)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                      onClick={() => console.log("Advertisement download clicked")}
                      data-event="click:advertisementDownload"
                    >
                      {/* Button content */}
                      <span className="relative z-10 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        {t('appDetail.downloadAPK')}
                      </span>
                      
                      {/* Hover effect */}
                      <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                      
                      {/* Reflection animation */}
                      <span 
                        className="absolute top-0 left-0 w-1/3 h-full bg-white/20 transform -skew-x-12 opacity-0 group-hover:animate-shimmer"
                        style={{
                          animation: 'shimmer 2s infinite',
                        }}
                      ></span>
                      
                      {/* Pulsing glow effect */}
                      <span className="absolute inset-0 rounded-lg ring-2 ring-white/30 animate-pulse-slow"></span>
                    </a>
                  )}
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
                    {app.description}
                  </p>
                  
                  {/* Google Play download link */}
                  <div className="mt-4">
                    <a 
                      href={`https://play.google.com/store/apps/details?id=${app.id}`}
                      className="inline-block font-bold text-blue-600 hover:text-blue-800 text-lg transition-colors"
                      onClick={handleGooglePlayClick}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Play
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