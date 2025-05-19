import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedTextProps {
  text: string;
  className?: string;
}

/**
 * Componente para mostrar un texto traducido
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ text, className }) => {
  const { translatedText, isLoading } = useTranslation(text);

  if (isLoading) {
    return (
      <span className={`animate-pulse inline-block ${className || ''}`}>
        <span className="h-4 bg-gray-200 rounded w-full inline-block"></span>
      </span>
    );
  }

  return <span className={className || ''}>{translatedText}</span>;
};

export default TranslatedText;