import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/StaticLanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Función para formatear el nombre del idioma actual
  const getCurrentLanguageName = () => {
    const currentLang = supportedLanguages.find(lang => lang.code === language);
    return currentLang ? currentLang.name : 'English';
  };

  // Cierra el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-gray-700 hover:text-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1 text-sm hidden md:inline">{getCurrentLanguageName()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                  language === lang.code ? 'bg-gray-100 font-medium text-primary' : ''
                }`}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;