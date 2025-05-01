import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { App } from "@shared/schema";
import AppCard from "@/components/AppCard";
import { Badge } from "@/components/ui/badge";

const AppDetail = () => {
  const { appId } = useParams();
  const [activeTab, setActiveTab] = useState<"description" | "screenshots" | "info">("description");

  const { data: app, isLoading } = useQuery<App>({
    queryKey: [`/api/apps/${appId}`],
  });

  const { data: relatedApps, isLoading: isLoadingRelated } = useQuery<App[]>({
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <img 
                  src={app.iconUrl} 
                  alt={app.name} 
                  className="w-32 h-32 object-contain mb-3"
                />
                <h1 className="text-2xl font-bold text-center">{app.name}</h1>
                <Badge variant="category" className="mt-1">
                  {app.category}
                </Badge>
                <div className="flex items-center mt-2">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{app.downloads} downloads</p>
                
                <div className="mt-6 w-full">
                  <a 
                    href={app.downloadUrl} 
                    className="block w-full text-center bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded mb-3"
                    onClick={handleDownloadClick}
                    data-event="click:downloadApp"
                  >
                    Download APK
                  </a>
                  <a 
                    href={app.googlePlayUrl} 
                    className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded"
                    onClick={handleGooglePlayClick}
                    data-event="click:redirectToStore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-google-play mr-2"></i> Google Play
                  </a>
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
                  Description
                </button>
                <button
                  className={`pb-2 font-medium ${
                    activeTab === "screenshots"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("screenshots")}
                >
                  Screenshots
                </button>
                <button
                  className={`pb-2 font-medium ${
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
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-line">{app.description}</p>
                </div>
              )}
              
              {activeTab === "screenshots" && (
                <div className="mb-6">
                  <div className="flex overflow-x-auto space-x-4 pb-4">
                    {app.screenshots.map((screenshot, index) => (
                      <img 
                        key={index}
                        src={screenshot} 
                        className="h-64 w-auto rounded-lg" 
                        alt={`Screenshot ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "info" && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Version</p>
                      <p className="font-medium">{app.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{app.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Updated</p>
                      <p className="font-medium">{app.updated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requires</p>
                      <p className="font-medium">{app.requires}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Developer</p>
                      <p className="font-medium">{app.developer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Installs</p>
                      <p className="font-medium">{app.installs}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Apps */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Related Apps</h2>
        
        {isLoadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-40 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedApps?.slice(0, 4).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Sponsored Banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
          SPONSORED
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
            <h3 className="text-xl font-bold mb-2">Get Premium Apps for Free!</h3>
            <p className="mb-4">Subscribe to our newsletter and get access to exclusive app deals and promotions.</p>
            <a 
              href="#premium-apps" 
              className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={() => console.log("Affiliate link clicked: Premium Apps")}
              data-event="click:trackAffiliate"
            >
              <span>Subscribe Now</span>
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
