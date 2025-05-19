import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente para traducir bloques grandes de texto
 * Extrae el texto plano de los children y lo traduce
 */
const TranslatedBlock: React.FC<TranslatedBlockProps> = ({ children, className }) => {
  const [textToTranslate, setTextToTranslate] = useState('');
  const { translatedText, isLoading } = useTranslation(textToTranslate);
  
  // Extraer el texto plano de los children
  useEffect(() => {
    if (children && typeof children === 'string') {
      setTextToTranslate(children);
    } else if (children && React.isValidElement(children)) {
      // Si es un elemento React, intentamos extraer el texto
      const extractTextFromElement = (element: React.ReactNode): string => {
        if (typeof element === 'string') {
          return element;
        }
        
        if (Array.isArray(element)) {
          return element.map(extractTextFromElement).join(' ');
        }
        
        if (React.isValidElement(element) && element.props.children) {
          return extractTextFromElement(element.props.children);
        }
        
        return '';
      };
      
      setTextToTranslate(extractTextFromElement(children));
    }
  }, [children]);
  
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className || ''}`}>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }
  
  // Si el children era una string simple, solo devolvemos el texto traducido
  if (typeof children === 'string') {
    return <div className={className || ''}>{translatedText}</div>;
  }
  
  // Si no pudimos traducir (porque children es complejo), devolvemos el original
  return <div className={className || ''}>{children}</div>;
};

export default TranslatedBlock;