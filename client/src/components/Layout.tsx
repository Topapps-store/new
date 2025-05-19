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
        {children}
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
