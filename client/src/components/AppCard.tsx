import { Link } from "wouter";
import StarRating from "./StarRating";
import { App, AppLegacy } from "@shared/schema";

type AppCardProps = {
  app: App | AppLegacy;
  isAffiliate?: boolean;
};

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

const AppCard: React.FC<AppCardProps> = ({ app, isAffiliate = false }) => {
  const handleAffiliateClick = () => {
    // Track affiliate link click
    console.log("Affiliate link clicked:", app.id);
    // In a real implementation, this would send tracking data to analytics
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105 relative">
      {isAffiliate && (
        <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold py-1 px-2">
          AD
        </span>
      )}
      
      <Link href={`/apps/${app.id}`}>
        <div
          className="block cursor-pointer"
          onClick={isAffiliate ? handleAffiliateClick : undefined}
          data-event={isAffiliate ? "click:trackAffiliate" : undefined}
        >
          <div className="p-4 flex flex-col items-center">
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img
                src={app.iconUrl || "https://cdn-icons-png.flaticon.com/512/731/731985.png"}
                alt={app.name}
                className="w-20 h-20 object-contain rounded-xl shadow-sm"
                onError={(e) => {
                  // Fallback to a generic app icon if the original URL fails
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/731/731985.png";
                }}
              />
            </div>
            <h3 className="font-medium text-center line-clamp-2 h-12">{app.name}</h3>
            <span className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded-full mt-1">
              {getCategoryName(app)}
            </span>
            <div className="flex items-center mt-2">
              <StarRating rating={app.rating} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
