import { useQuery } from "@tanstack/react-query";
import AppCard from "@/components/AppCard";
import { App } from "@shared/schema";
import { useState } from "react";

const AllApps = () => {
  const [sortBy, setSortBy] = useState<"popularity" | "rating" | "recent">("popularity");

  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const getSortedApps = () => {
    if (!apps) return [];
    
    switch (sortBy) {
      case "popularity":
        return [...apps].sort((a, b) => {
          const aDownloads = Number(a.downloads.replace(/[^0-9]/g, ""));
          const bDownloads = Number(b.downloads.replace(/[^0-9]/g, ""));
          return bDownloads - aDownloads;
        });
      case "rating":
        return [...apps].sort((a, b) => b.rating - a.rating);
      case "recent":
        // Sort by the 'updated' date, assuming it's in a format that can be parsed by Date
        return [...apps].sort((a, b) => {
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        });
      default:
        return apps;
    }
  };

  // Find apps that should be displayed as affiliates (every 7th app)
  const isAffiliateApp = (index: number) => {
    return (index + 1) % 7 === 0;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Apps</h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "popularity" | "rating" | "recent")}
            className="border-gray-200 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 h-48 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getSortedApps().map((app, index) => (
              <AppCard 
                key={app.id} 
                app={app} 
                isAffiliate={isAffiliateApp(index)} 
              />
            ))}
          </div>
          
          {/* Sponsored Banner */}
          <div className="my-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
              SPONSORED
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
                <h3 className="text-xl font-bold mb-2">Enhance Your App Experience!</h3>
                <p className="mb-4">Get access to premium apps and exclusive features with our partner services.</p>
                <a 
                  href="#premium-subscription" 
                  className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => console.log("Affiliate link clicked: Premium Subscription")}
                  data-event="click:trackAffiliate"
                >
                  <span>Get Premium Access</span>
                  <i className="fas fa-chevron-right ml-2"></i>
                </a>
              </div>
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=768&q=80" 
                  alt="Premium App Access" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AllApps;
