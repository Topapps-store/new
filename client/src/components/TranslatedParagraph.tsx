import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedParagraphProps {
  text: string;
  className?: string;
}

/**
 * Componente para mostrar un párrafo traducido
 */
const TranslatedParagraph: React.FC<TranslatedParagraphProps> = ({ text, className }) => {
  const { translatedText, isLoading } = useTranslation(text);

  if (isLoading) {
    return (
      <p className={`animate-pulse ${className || ''}`}>
        <span className="h-4 bg-gray-200 rounded w-full mb-2 block"></span>
        <span className="h-4 bg-gray-200 rounded w-3/4 mb-2 block"></span>
        <span className="h-4 bg-gray-200 rounded w-5/6 block"></span>
      </p>
    );
  }

  return <p className={className || ''}>{translatedText}</p>;
};

export default TranslatedParagraph;