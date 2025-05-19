import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/StaticLanguageContext';

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

/**
 * Componente para mostrar texto traducido con DeepL
 * Usa el hook useLanguage para traducir dinámicamente el texto
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  as: Component = 'span',
  className = '',
  children,
  ...props 
}) => {
  const { translateDynamic, language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const translateText = async () => {
      setIsLoading(true);
      try {
        const result = await translateDynamic(text);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error('Error al traducir texto:', error);
        if (isMounted) {
          setTranslatedText(text); // Fallback al texto original en caso de error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Solo traducir si el texto ha cambiado o el idioma ha cambiado
    if (text) {
      translateText();
    } else {
      setTranslatedText('');
    }

    return () => {
      isMounted = false;
    };
  }, [text, language, translateDynamic]);

  // Si hay children, usarlos como contenido (para soporte JSX)
  const content = children || translatedText || text;

  return (
    <Component className={`${className} ${isLoading ? 'opacity-70' : ''}`} {...props}>
      {content}
    </Component>
  );
};

export default TranslatedText;