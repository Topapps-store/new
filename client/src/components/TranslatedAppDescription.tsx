import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedAppDescriptionProps {
  text: string;
}

/**
 * Componente para mostrar una descripción de aplicación traducida
 */
const TranslatedAppDescription: React.FC<TranslatedAppDescriptionProps> = ({ text }) => {
  const { translatedText, isLoading } = useTranslation(text);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return <>{translatedText}</>;
};

export default TranslatedAppDescription;