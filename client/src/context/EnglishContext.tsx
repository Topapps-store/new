import React, { createContext, useContext } from 'react';
import { getText } from '../translations/english';

// Simple context type for English-only text
interface EnglishContextType {
  t: (key: string) => string;
}

// Create the context
const EnglishContext = createContext<EnglishContextType | undefined>(undefined);

// Provider props
interface EnglishProviderProps {
  children: React.ReactNode;
}

// English-only provider component
export const EnglishProvider: React.FC<EnglishProviderProps> = ({ children }) => {
  // Function to get text translation
  const t = (key: string): string => {
    return getText(key);
  };

  // Provide the context
  return (
    <EnglishContext.Provider value={{ t }}>
      {children}
    </EnglishContext.Provider>
  );
};

// Custom hook to use the English context
export const useText = (): EnglishContextType => {
  const context = useContext(EnglishContext);
  
  if (context === undefined) {
    throw new Error('useText must be used within an EnglishProvider');
  }
  
  return context;
};