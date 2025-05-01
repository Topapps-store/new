import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import StarRating from "./StarRating";
import { App } from "@shared/schema";

type AppDetailDialogProps = {
  app?: App;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedApps: App[];
};

const AppDetailDialog: React.FC<AppDetailDialogProps> = ({
  app,
  open,
  onOpenChange,
  relatedApps,
}) => {
  const [activeTab, setActiveTab] = useState<"description" | "screenshots" | "info">("description");

  const handleDownloadClick = () => {
    console.log("Download click:", app?.id);
    // In a real implementation, this would track the download
  };

  const handleGooglePlayClick = () => {
    console.log("Google Play redirect:", app?.id);
    // In a real implementation, this would redirect to Google Play
  };

  if (!app) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">App Details</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
              <div className="flex flex-col items-center">
                <img 
                  src={app.iconUrl} 
                  alt={app.name} 
                  className="w-32 h-32 object-contain mb-3"
                />
                <h2 className="text-xl font-bold text-center">{app.name}</h2>
                <span className="text-sm text-gray-500 py-1 px-2 bg-gray-100 rounded-full mt-1">
                  {app.category}
                </span>
                <div className="flex items-center mt-2">
                  <StarRating rating={app.rating} showScore={true} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{app.downloads} downloads</p>
                
                <div className="mt-4 w-full">
                  <a 
                    href={app.downloadUrl} 
                    className="block w-full text-center bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded mb-2"
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
            
            <div className="md:w-2/3">
              <div className="flex space-x-4 border-b mb-4">
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
                  <p className="text-gray-600">{app.description}</p>
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
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Apps */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-lg font-bold mb-4">Related Apps</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedApps.slice(0, 4).map((relatedApp) => (
                <Link key={relatedApp.id} href={`/apps/${relatedApp.id}`}>
                  <a className="flex flex-col items-center">
                    <img 
                      src={relatedApp.iconUrl} 
                      alt={relatedApp.name} 
                      className="w-16 h-16 object-contain mb-2"
                    />
                    <span className="text-sm text-center">{relatedApp.name}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppDetailDialog;
