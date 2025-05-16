// Configuración de entorno para la versión estática

// Indica que estamos usando datos estáticos
export const USE_STATIC_DATA = true;

// Versión de la aplicación
export const APP_VERSION = '1.0.0';

// Configuración de entorno
export const IS_PRODUCTION = import.meta.env.PROD || false;
export const IS_DEVELOPMENT = !IS_PRODUCTION;

// Tiempo de simulación de retraso para peticiones (ms)
export const STATIC_DELAY = 300;