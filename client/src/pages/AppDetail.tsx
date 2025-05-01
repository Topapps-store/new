import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { App, AppLegacy } from "@shared/schema";
import AppCard from "@/components/AppCard";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../context/LanguageContext";

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

  const handleDownloadClick = () => {
    console.log("Download click:", app?.id);
    // In a real implementation, this would track the download
  };

  const handleGooglePlayClick = () => {
    console.log("Google Play redirect:", app?.id);
    // In a real implementation, this would redirect to Google Play
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
      {/* Back button */}
      <div className="mb-4">
        <Link href="/">
          <div className="flex items-center text-gray-600 hover:text-primary cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>{t('nav.back')}</span>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <img 
                  src={app.iconUrl} 
                  alt={app.name} 
                  className="w-32 h-32 object-contain mb-3 rounded-xl"
                />
                <h1 className="text-2xl font-bold text-center">{app.name}</h1>
                
                <div className="flex items-center mt-2">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                
                {/* App Info Cards */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center border border-gray-200 rounded-lg p-2">
                    <i className="fas fa-language text-gray-500 w-8"></i>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.language')}</p>
                      <p className="font-medium">English</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg p-2">
                    <i className="fas fa-code-branch text-gray-500 w-8"></i>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.developer')}</p>
                      <p className="font-medium">{app.developer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded-lg p-2">
                    <i className="fas fa-tag text-gray-500 w-8"></i>
                    <div>
                      <p className="text-sm text-gray-500">#Version</p>
                      <p className="font-medium">{app.version}</p>
                    </div>
                  </div>
                </div>
                
                {/* Advertisement banner */}
                <div className="w-full mt-4 border-t border-gray-200 pt-4">
                  <div className="text-xs text-gray-500 mb-1">{t('sponsored.sponsored')}</div>
                  <a 
                    href="#advertisement-link" 
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mb-4"
                    onClick={() => console.log("Advertisement download clicked")}
                    data-event="click:advertisementDownload"
                  >
                    {t('appDetail.downloadAPK')}
                  </a>
                </div>
                
                {/* Download buttons */}
                <div className="w-full mt-2">
                  <a 
                    href={app.downloadUrl} 
                    className="block w-full text-center bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mb-3"
                    onClick={handleDownloadClick}
                    data-event="click:downloadApp"
                  >
                    {t('appDetail.downloadAPK')}
                  </a>
                  
                  <div className="flex space-x-2">
                    <a 
                      href={app.googlePlayUrl} 
                      className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-2 rounded-lg"
                      onClick={handleGooglePlayClick}
                      data-event="click:redirectToStore"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-google-play mr-1"></i> {t('appDetail.googlePlay')}
                    </a>
                    
                    <a 
                      href={app.iosAppStoreUrl || "#app-store"} 
                      className={`flex-1 text-center ${app.iosAppStoreUrl ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-400'} font-bold py-3 px-2 rounded-lg`}
                      onClick={() => console.log("App Store redirect")}
                      data-event="click:redirectToAppStore"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-apple mr-1"></i> {t('appDetail.appStore')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-8">
              <div className="flex space-x-6 border-b mb-6">
                <button
                  className={`pb-2 font-medium ${
                    activeTab === "description"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  {t('appDetail.description')}
                </button>
                <button
                  className={`pb-2 font-medium ${
                    activeTab === "screenshots"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("screenshots")}
                >
                  {t('appDetail.screenshots')}
                </button>
                <button
                  className={`pb-2 font-medium ${
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
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-line">{app.description}</p>
                  
                  {/* Show more button */}
                  <div className="mt-4">
                    <button className="text-primary hover:text-blue-600 font-medium">
                      Read More <i className="fas fa-chevron-down ml-1"></i>
                    </button>
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
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary">
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === "info" && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.version')}</p>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.size')}</p>
                      <p className="font-medium">{app.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.updated')}</p>
                      <p className="font-medium">{app.updated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.requires')}</p>
                      <p className="font-medium">{app.requires}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.developer')}</p>
                      <p className="font-medium">{app.developer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('appDetail.installs')}</p>
                      <p className="font-medium">{app.installs}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Platforms</p>
                      <p className="font-medium">Android, iOS</p>
                    </div>
                  </div>
                  
                  {/* Additional info and compatibility badges */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Android 5.0+</Badge>
                      <Badge variant="outline" className="text-xs">iOS 12.0+</Badge>
                      <Badge variant="outline" className="text-xs">No Ads</Badge>
                      <Badge variant="outline" className="text-xs">Free Download</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {/* App Play Store link */}
              <div className="mt-4 mb-6">
                <a 
                  href={app.googlePlayUrl} 
                  className="text-primary hover:text-blue-600 font-medium flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-google-play mr-2"></i>
                  {t('appDetail.googlePlay')}
                  <i className="fas fa-external-link-alt ml-2 text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Apps */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">{t('appDetail.relatedApps')}</h2>
        
        {isLoadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-40 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {relatedApps?.slice(0, 5).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
        
        {relatedApps && relatedApps.length > 5 && (
          <div className="text-center mt-4">
            <button className="text-primary hover:text-blue-600 font-medium">
              Load More <i className="fas fa-chevron-down ml-1"></i>
            </button>
          </div>
        )}
      </section>

      {/* Sponsored Banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
          {t('sponsored.sponsored')}
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
            <h3 className="text-xl font-bold mb-2">{t('sponsored.premiumApps')}</h3>
            <p className="mb-4">{t('sponsored.newsletter')}</p>
            <a 
              href="#premium-apps" 
              className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={() => console.log("Affiliate link clicked: Premium Apps")}
              data-event="click:trackAffiliate"
            >
              <span>{t('sponsored.subscribeNow')}</span>
              <i className="fas fa-chevron-right ml-2"></i>
            </a>
          </div>
          <div className="md:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=768&q=80" 
              alt="Premium Apps" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
