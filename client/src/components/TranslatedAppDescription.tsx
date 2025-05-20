import React from 'react';

interface TranslatedAppDescriptionProps {
  text: string;
}

/**
 * Componente para mostrar una descripción de aplicación (sin traducción)
 */
const TranslatedAppDescription: React.FC<TranslatedAppDescriptionProps> = ({ text }) => {
  return <>{text}</>;
};

export default TranslatedAppDescription;