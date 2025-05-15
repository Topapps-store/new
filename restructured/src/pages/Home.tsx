import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';

// Tipos
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  rating: number;
  reviews: number;
  developer: string;
  category: string;
  price: number;
}

// Componente para mostrar la calificación en estrellas
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < fullStars ? (
            '★'
          ) : i === fullStars && hasHalfStar ? (
            '★'
          ) : (
            '☆'
          )}
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

// Componente de tarjeta de aplicación
const AppCard = ({ app, translated }: { app: App, translated: boolean }) => {
  return (
    <Link href={`/app/${app.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
        <div className="p-4 flex">
          <img 
            src={app.icon} 
            alt={app.name} 
            className="w-16 h-16 rounded-xl mr-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{app.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{app.developer}</p>
            <StarRating rating={app.rating} />
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {app.description}
          </p>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {app.category}
            </span>
            
            <span className="font-medium">
              {app.price > 0 ? `$${app.price.toFixed(2)}` : 'Free'}
            </span>
          </div>
          
          <button className="w-full mt-3 bg-primary text-white py-2 px-4 rounded-full hover:bg-primary/90 transition-colors">
            Download
          </button>
          
          {!translated && (
            <div className="mt-2 text-xs text-center text-gray-500">
              Translation in progress...
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Componente de esqueleto para carga
const SkeletonAppCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full animate-pulse">
    <div className="p-4 flex">
      <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 mr-3" />
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2" />
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-1" />
          ))}
        </div>
      </div>
    </div>
    
    <div className="px-4 pb-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-3" />
      
      <div className="flex justify-between items-center mb-3">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
      
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  </div>
);

// Componente de sección de aplicaciones
const AppsSection = ({ 
  title, 
  endpoint,
  subtitle
}: { 
  title: string, 
  endpoint: string,
  subtitle?: string
}) => {
  const { translateText } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedSubtitle, setTranslatedSubtitle] = useState(subtitle || '');
  const [translatedApps, setTranslatedApps] = useState<Record<string, App>>({});
  
  // Consultar datos
  const { data: apps, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error fetching apps');
      return res.json() as Promise<App[]>;
    }
  });
  
  // Traducir título
  useEffect(() => {
    async function translate() {
      setTranslatedTitle(await translateText(title));
      if (subtitle) {
        setTranslatedSubtitle(await translateText(subtitle));
      }
    }
    
    translate();
  }, [title, subtitle, translateText]);
  
  // Traducir descripciones de apps
  useEffect(() => {
    if (!apps) return;
    
    async function translateApps() {
      const translated: Record<string, App> = {};
      
      for (const app of apps) {
        translated[app.id] = {
          ...app,
          name: await translateText(app.name),
          description: await translateText(app.description),
          developer: await translateText(app.developer),
          category: await translateText(app.category)
        };
      }
      
      setTranslatedApps(translated);
    }
    
    translateApps();
  }, [apps, translateText]);
  
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{translatedTitle}</h2>
        {translatedSubtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{translatedSubtitle}</p>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonAppCard key={i} />
          ))}
        </div>
      ) : apps && apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map(app => (
            <AppCard 
              key={app.id} 
              app={translatedApps[app.id] || app} 
              translated={!!translatedApps[app.id]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No apps found</p>
        </div>
      )}
    </section>
  );
};

// Componente principal
export default function Home() {
  const { translateText } = useLanguage();
  const [translatedHero, setTranslatedHero] = useState({
    title: 'Discover the Best Apps',
    subtitle: 'Find the perfect applications for your needs with our curated recommendations.'
  });
  
  // Traducir hero section
  useEffect(() => {
    async function translateHero() {
      setTranslatedHero({
        title: await translateText('Discover the Best Apps'),
        subtitle: await translateText('Find the perfect applications for your needs with our curated recommendations.')
      });
    }
    
    translateHero();
  }, [translateText]);
  
  return (
    <div>
      {/* Hero section */}
      <section className="py-8 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {translatedHero.title}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {translatedHero.subtitle}
          </p>
        </div>
      </section>
      
      {/* Apps sections */}
      <AppsSection 
        title="Popular Apps" 
        endpoint="/api/apps/popular"
        subtitle="The most downloaded applications by our users" 
      />
      
      <AppsSection 
        title="Recently Added" 
        endpoint="/api/apps/recent"
        subtitle="The latest additions to our collection" 
      />
      
      <AppsSection 
        title="Just for You" 
        endpoint="/api/apps/just-in-time"
        subtitle="Personalized recommendations based on your interests" 
      />
    </div>
  );
}