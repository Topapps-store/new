import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { User, Search, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/use-auth';

// Logo component
const Logo = () => (
  <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className="w-6 h-6 fill-primary"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"/>
    </svg>
    <span>TopApps</span>
  </Link>
);

// Header component
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Logo (desktop) */}
        <div className="hidden md:block">
          <Logo />
        </div>
        
        {/* Search button and user menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/search')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          {user ? (
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label="Admin dashboard"
            >
              <User className="h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label="Login"
            >
              <User className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Sidebar component
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { translateText } = useLanguage();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(async data => {
        // Translate category names
        const translatedCategories = await Promise.all(
          data.map(async (cat: {id: string, name: string}) => ({
            ...cat,
            name: await translateText(cat.name)
          }))
        );
        setCategories(translatedCategories);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, [translateText]);
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 transform transition-transform 
          duration-200 ease-in-out md:translate-x-0 md:static md:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <Logo />
          <button 
            onClick={onClose}
            className="p-2 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <ul className="space-y-1">
            {categories.map(category => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.id}`}
                  className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <h2 className="text-lg font-semibold mt-6 mb-2">Legal</h2>
          <ul className="space-y-1">
            <li>
              <Link 
                href="/privacy-policy"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                href="/terms-of-service"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                href="/disclaimer"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Disclaimer
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

// Main Layout component
interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const [location] = useLocation();
  
  // Close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
      
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} TopApps - The best app discovery platform</p>
        </div>
      </footer>
    </div>
  );
}