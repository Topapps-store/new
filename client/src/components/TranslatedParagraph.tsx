import React from 'react';

interface TranslatedParagraphProps {
  text: string;
  className?: string;
}

/**
 * Componente para mostrar un párrafo (sin traducción)
 */
const TranslatedParagraph: React.FC<TranslatedParagraphProps> = ({ text, className }) => {
  return <p className={className || ''}>{text}</p>;
};

export default TranslatedParagraph;