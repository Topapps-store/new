import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id);
    }, 5000);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md max-w-md animate-fade-in ${
              toast.variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium text-sm ${toast.variant === 'destructive' ? 'text-red-800' : 'text-gray-900'}`}>
                  {toast.title}
                </h3>
                {toast.description && (
                  <p className={`text-sm mt-1 ${toast.variant === 'destructive' ? 'text-red-700' : 'text-gray-500'}`}>
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className={`ml-4 text-sm ${toast.variant === 'destructive' ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};