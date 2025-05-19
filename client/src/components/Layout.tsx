import React from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useLanguage } from "../context/StaticLanguageContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="/apps/all">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/apps/all" ? "text-primary" : ""}`}>
                <i className="fas fa-mobile-alt mr-1"></i>
                <span className="hidden md:inline">{t('nav.apps')}</span>
              </div>
            </Link>
            <Link href="/categories/games">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/categories/games" ? "text-primary" : ""}`}>
                <i className="fas fa-gamepad mr-1"></i>
                <span className="hidden md:inline">{t('nav.games')}</span>
              </div>
            </Link>
            <Link href="/apps/add">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/apps/add" ? "text-primary" : ""}`}>
                <i className="fas fa-plus-circle mr-1"></i>
                <span className="hidden md:inline">{t('nav.addApp')}</span>
              </div>
            </Link>
          </nav>
        </div>

        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        {location === "/terms-of-service" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p>Last updated: May 19, 2025</p>
              
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing our website TopApps.store, you agree to be bound by these Terms and Conditions and all applicable 
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on TopApps.store for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
                under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on TopApps.store</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>
          </div>
        ) : location === "/privacy-policy" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p>Last updated: May 19, 2025</p>
              
              <p>
                At TopApps.store, we value your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you 
                visit our website.
              </p>
              
              <h2>1. Information We Collect</h2>
              <p>We may collect several types of information from and about users of our website, including:</p>
              <ul>
                <li>
                  <strong>Usage Data:</strong> Information about how you access and use our website, including your IP 
                  address, browser type, device information, pages visited, time spent on those pages, and referral sources.
                </li>
                <li>
                  <strong>Cookies and Tracking Data:</strong> We use cookies and similar tracking technologies to track 
                  activity on our website and hold certain information to improve your browsing experience.
                </li>
                <li>
                  <strong>App Usage Data:</strong> Information about which apps you view, download, or interact with on our platform.
                </li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>We may use the information we collect about you for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our website and services</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Analyze how users interact with our website to improve functionality and user experience</li>
                <li>Communicate with you about updates, promotions, or other information related to our services</li>
                <li>Detect, prevent, and address technical issues or security breaches</li>
              </ul>
            </div>
          </div>
        ) : location === "/disclaimer" ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
            <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
            
            <div className="prose max-w-none">
              <p>Last updated: May 19, 2025</p>
              
              <h2>1. Website Content</h2>
              <p>
                The information provided on TopApps.store is for general informational purposes only. All information on the site 
                is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding 
                the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
              
              <h2>2. External Links and Third Parties</h2>
              <p>
                TopApps.store may contain links to external websites, download sources, and third-party services that are not 
                provided, maintained by, or in any way affiliated with us. We do not guarantee the accuracy, relevance, 
                timeliness, or completeness of any information on these external websites or services.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-bold text-xl mb-2">IMPORTANT DISCLAIMER</p>
                <p className="mb-2">
                  TopApps.store is <span className="font-bold uppercase">NOT</span> responsible for the actions, content, privacy practices, or 
                  terms of service of any third-party applications, websites, or services linked from or featured on our website.
                </p>
                <p>
                  <span className="font-bold">We do not endorse, control, or assume responsibility for any app, service, or content hosted by third parties.</span> 
                  Users download and use third-party applications at their own risk and discretion.
                </p>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="bg-dark text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">TopApps.store</h3>
              <p className="text-gray-400 text-sm max-w-xl">
                Discover and download the best mobile applications all in one place. We aim to provide a simple way for you to find quality apps for your device.
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="space-x-4 mb-4 md:mb-0">
                  <a href="/terms-of-service" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    Terms of Service
                  </a>
                  <a href="/privacy-policy" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    Privacy Policy
                  </a>
                  <a href="/disclaimer" className="text-gray-400 hover:text-white cursor-pointer text-sm">
                    Disclaimer
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">© 2023 TopApps.store. All rights reserved.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-xs max-w-3xl mx-auto text-center">
                <strong>Affiliate Disclosure:</strong> TopApps.store is supported by our users. Some links on our site are affiliate links, which means we may earn a commission if you click on them and make a purchase. This helps us maintain and improve our service. All recommendations are based on genuine app quality and user experience.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
