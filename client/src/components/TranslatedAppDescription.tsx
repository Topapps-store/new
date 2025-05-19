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
      <span className="animate-pulse block">
        <span className="h-4 bg-gray-200 rounded w-full mb-2 block"></span>
        <span className="h-4 bg-gray-200 rounded w-3/4 mb-2 block"></span>
        <span className="h-4 bg-gray-200 rounded w-5/6 mb-2 block"></span>
        <span className="h-4 bg-gray-200 rounded w-2/3 block"></span>
      </span>
    );
  }

  return <>{translatedText}</>;
};

export default TranslatedAppDescription;