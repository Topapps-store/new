import React from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

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
                <span className="hidden md:inline">Apps</span>
              </div>
            </Link>
            <Link href="/categories/games">
              <div className={`text-gray-600 hover:text-primary flex items-center cursor-pointer ${location === "/categories/games" ? "text-primary" : ""}`}>
                <i className="fas fa-gamepad mr-1"></i>
                <span className="hidden md:inline">Games</span>
              </div>
            </Link>
            <div className="relative">
              <button className="text-gray-600 hover:text-primary flex items-center border border-gray-200 rounded px-2 py-1">
                <span>English</span>
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TopApps.store</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for Android apps and games. Download the latest versions of popular applications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/apps/all">
                    <span className="text-gray-400 hover:text-white cursor-pointer">All Apps</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/games">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Games</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Categories</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Disclaimer</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-youtube"></i></a>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Stay updated with the latest apps and promotions.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} TopApps.store. All rights reserved.</p>
            <p className="mt-2">
              Android is a trademark of Google LLC. All app names, logos, and brands are property of their respective owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
