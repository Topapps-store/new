import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import AppCard from "../components/AppCard";
import { App, Category } from "@shared/schema";

const CategoryPage = () => {
  const { categoryId } = useParams();

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
  });

  const { data: apps, isLoading: isLoadingApps } = useQuery<App[]>({
    queryKey: [`/api/categories/${categoryId}/apps`],
  });

  // Get a random app to mark as an affiliate app
  const getRandomAffiliateApp = () => {
    if (!apps || apps.length === 0) return -1;
    return Math.floor(Math.random() * apps.length);
  };

  const affiliateAppIndex = getRandomAffiliateApp();

  if (isLoadingCategory || isLoadingApps) {
    return (
      <div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
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
      </div>
    );
  }

  if (!category) {
    return <div className="text-center py-10">Category not found</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{category.name} Apps</h1>
      
      {!apps || apps.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No apps found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <AppCard 
              key={app.id} 
              app={app} 
              isAffiliate={index === affiliateAppIndex} 
            />
          ))}
        </div>
      )}
      
      {/* Sponsored Banner */}
      <div className="my-8 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 bg-accent text-xs font-bold">
          SPONSORED
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
            <h3 className="text-xl font-bold mb-2">Discover Premium {category.name} Apps!</h3>
            <p className="mb-4">Unlock the full potential of your device with our curated premium selection.</p>
            <a 
              href="#premium-category-apps" 
              className="bg-accent hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={() => console.log("Affiliate link clicked: Premium Category Apps")}
              data-event="click:trackAffiliate"
            >
              <span>Explore Now</span>
              <i className="fas fa-chevron-right ml-2"></i>
            </a>
          </div>
          <div className="md:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=768&q=80" 
              alt={`Premium ${category.name} Apps`} 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
