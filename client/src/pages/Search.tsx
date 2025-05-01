import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AppCard from "@/components/AppCard";
import { App } from "@shared/schema";
import { useEffect, useState } from "react";

const Search = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split("?")[1]);
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [location]);

  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  // Find apps that should be displayed as affiliates (every 5th app)
  const isAffiliateApp = (index: number) => {
    return (index + 1) % 5 === 0;
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Search"}
      </h1>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
        searchQuery ? (
          apps && apps.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {apps.map((app, index) => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  isAffiliate={isAffiliateApp(index)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4"><i className="fas fa-search text-gray-300"></i></div>
              <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
              <p className="text-gray-500">
                We couldn't find any apps matching "{searchQuery}". <br />
                Try different keywords or browse our categories.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4"><i className="fas fa-search text-gray-300"></i></div>
            <h2 className="text-2xl font-semibold mb-2">Search for Apps</h2>
            <p className="text-gray-500">
              Enter a search term in the search bar above to find apps.
            </p>
          </div>
        )
      )}
      
      {searchQuery && apps && apps.length > 0 && (
        <div className="mt-10 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
            SPONSORED
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
              <h3 className="text-xl font-bold mb-2">Looking for more {searchQuery} apps?</h3>
              <p className="mb-4">Discover premium alternatives and enhanced versions of the apps you're searching for!</p>
              <a 
                href="#premium-search" 
                className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={() => console.log("Affiliate link clicked: Premium Search")}
                data-event="click:trackAffiliate"
              >
                <span>Explore Premium Apps</span>
                <i className="fas fa-chevron-right ml-2"></i>
              </a>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1581266503569-aba0832fa0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=768&q=80" 
                alt="Premium App Search" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
