import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AppCard from "@/components/AppCard";
import CategoryCard from "@/components/CategoryCard";
import SponsoredBanner from "@/components/SponsoredBanner";
import { useState } from "react";
import { App, Category } from "@shared/schema";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { t } = useLanguage();

  const { data: popularApps, isLoading: isLoadingPopular } = useQuery<App[]>({
    queryKey: ["/api/apps/popular"],
  });

  const { data: recentApps, isLoading: isLoadingRecent } = useQuery<App[]>({
    queryKey: ["/api/apps/recent"],
  });
  
  const { data: justInTimeApps, isLoading: isLoadingJustInTime } = useQuery<App[]>({
    queryKey: ["/api/apps/just-in-time"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <>
      {/* Top 10 Apps Last Month Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('top10AppsLastMonth')}</h2>
          <Link href="/apps/popular">
            <span className="text-primary hover:underline cursor-pointer">{t('viewAll')}</span>
          </Link>
        </div>
        
        {isLoadingPopular ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-48 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularApps?.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Sponsored Content Banner */}
      <SponsoredBanner
        title="Boost Your Device Performance!"
        description="Try our recommended optimization tools to enhance your device speed and battery life."
        imageUrl="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&h=768&q=80"
        ctaText="Learn More"
        ctaLink="#performance-boost"
      />

      {/* App Categories Section */}
      <section className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">App Categories</h2>
        
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex items-center p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories?.slice(0, showAllCategories ? categories.length : 12).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
            
            {!showAllCategories && categories && categories.length > 12 && (
              <button
                className="col-span-2 sm:col-span-3 md:col-span-4 mt-2 text-primary font-medium flex items-center justify-center"
                onClick={() => setShowAllCategories(true)}
              >
                Show More
                <i className="fas fa-chevron-down ml-1"></i>
              </button>
            )}
            
            {showAllCategories && (
              <button
                className="col-span-2 sm:col-span-3 md:col-span-4 mt-2 text-primary font-medium flex items-center justify-center"
                onClick={() => setShowAllCategories(false)}
              >
                Show Less
                <i className="fas fa-chevron-up ml-1"></i>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Top 10 Just-In-Time Apps Section */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('top10JustInTimeApps')}</h2>
          <Link href="/apps/just-in-time">
            <span className="text-primary hover:underline cursor-pointer">{t('viewAll')}</span>
          </Link>
        </div>
        
        {isLoadingJustInTime ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-48 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {justInTimeApps?.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>
      
      {/* Recent Apps Section */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('recentApps')}</h2>
          <Link href="/apps/all">
            <span className="text-primary hover:underline cursor-pointer">{t('viewAll')}</span>
          </Link>
        </div>
        
        {isLoadingRecent ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentApps?.slice(0, 3).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
            {recentApps && recentApps.length > 3 && (
              <AppCard app={recentApps[3]} isAffiliate={true} />
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
