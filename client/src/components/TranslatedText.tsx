import React from 'react';

interface TranslatedTextProps {
  text: string;
  className?: string;
}

/**
 * Componente para mostrar texto (sin traducción)
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ text, className }) => {
  return <span className={className || ''}>{text}</span>;
};

export default TranslatedText;