// Archivo para gestionar la configuración de entorno de la aplicación

// API URL base - Se utiliza para todas las solicitudes a la API
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname.includes('replit.dev') 
    ? '' // URL relativa en entorno de desarrollo
    : 'https://topapps.replit.app'); // URL de la API en producción

// Versión de la aplicación
export const APP_VERSION = '1.0.0';

// Configuración de entorno
export const IS_PRODUCTION = import.meta.env.PROD || false;
export const IS_DEVELOPMENT = !IS_PRODUCTION;

// Tiempo de caché para solicitudes (en milisegundos)
export const CACHE_TIME = {
  short: 1000 * 60 * 5, // 5 minutos
  medium: 1000 * 60 * 30, // 30 minutos
  long: 1000 * 60 * 60 * 6, // 6 horas
};