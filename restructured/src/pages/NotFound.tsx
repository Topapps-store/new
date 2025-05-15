import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { translateText } = useLanguage();
  const [translations, setTranslations] = useState({
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist or has been moved.',
    button: 'Return to Home'
  });

  useEffect(() => {
    async function translate() {
      setTranslations({
        title: await translateText('Page Not Found'),
        message: await translateText('The page you are looking for does not exist or has been moved.'),
        button: await translateText('Return to Home')
      });
    }

    translate();
  }, [translateText]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">{translations.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {translations.message}
      </p>
      <Link href="/">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          {translations.button}
        </button>
      </Link>
    </div>
  );
}