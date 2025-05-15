import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  onDismiss: (id: string) => void;
}

const Toast = ({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    // Wait for animation to complete
    setTimeout(() => onDismiss(id), 300);
  };

  const baseClasses = "rounded-lg shadow-lg p-4 max-w-xs w-full transition-all duration-300";
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
    destructive: "bg-red-600 text-white dark:bg-red-700",
    success: "bg-green-600 text-white dark:bg-green-700",
  }[variant];

  const visibilityClasses = visible
    ? "translate-y-0 opacity-100"
    : "translate-y-2 opacity-0 pointer-events-none";

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${visibilityClasses}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {title && <div className="font-bold mb-1">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}