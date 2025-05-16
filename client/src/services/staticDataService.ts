import appsData from '../data/apps.json';
import categoriesData from '../data/categories.json';
import { App, AppLegacy, Category } from '@shared/schema';

/**
 * Servicio para acceder a los datos estáticos de la aplicación
 * Esta versión reemplaza las llamadas a la API con datos locales
 */

// Convertir datos JSON a tipos App/AppLegacy para compatibilidad
const apps: AppLegacy[] = appsData.apps.map(app => ({
  ...app,
  category: app.category || 'Unknown'
})) as AppLegacy[];

// Convertir datos JSON a tipos Category para compatibilidad
const categories: Category[] = categoriesData.categories.map(category => ({
  ...category
})) as Category[];

/**
 * Obtener todas las aplicaciones
 */
export const getAllApps = async (): Promise<AppLegacy[]> => {
  return apps;
};

/**
 * Obtener aplicaciones populares
 */
export const getPopularApps = async (): Promise<AppLegacy[]> => {
  // Ordenar por calificación descendente y tomar las primeras 8
  return [...apps].sort((a, b) => b.rating - a.rating).slice(0, 8);
};

/**
 * Obtener aplicaciones recientes
 */
export const getRecentApps = async (): Promise<AppLegacy[]> => {
  // Obtener apps únicas (evitar duplicados como Uber)
  const seen = new Set();
  const uniqueApps = apps.filter(app => {
    if (seen.has(app.id)) {
      return false;
    }
    seen.add(app.id);
    return true;
  });
  
  // Ordenar por fecha de actualización y tomar las primeras 6
  return uniqueApps
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 6);
};

/**
 * Obtener aplicaciones "Just In Time"
 */
export const getJustInTimeApps = async (): Promise<AppLegacy[]> => {
  // Simplemente devolver algunas apps mezcladas
  return [...apps].sort(() => Math.random() - 0.5).slice(0, 4);
};

/**
 * Obtener todas las categorías
 */
export const getAllCategories = async (): Promise<Category[]> => {
  return categories;
};

/**
 * Obtener una aplicación por su ID
 */
export const getAppById = async (id: string): Promise<AppLegacy | undefined> => {
  return apps.find(app => app.id === id);
};

/**
 * Obtener aplicaciones relacionadas a una app
 * Devuelve todas las apps de la misma categoría
 */
export const getRelatedApps = async (id: string): Promise<AppLegacy[]> => {
  const app = apps.find(app => app.id === id);
  if (!app) return [];
  
  // Buscar todas las apps en la misma categoría, excluyendo la app actual
  return apps
    .filter(a => a.categoryId === app.categoryId && a.id !== id);
};

/**
 * Buscar aplicaciones por término
 */
export const searchApps = async (query: string): Promise<AppLegacy[]> => {
  const searchTerm = query.toLowerCase();
  return apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm) || 
    app.description.toLowerCase().includes(searchTerm) ||
    app.category.toLowerCase().includes(searchTerm)
  );
};

/**
 * Obtener apps por categoría
 */
export const getAppsByCategory = async (categoryId: string): Promise<AppLegacy[]> => {
  return apps.filter(app => app.categoryId === categoryId);
};

/**
 * Obtener enlaces de afiliados para una app específica
 * En la versión estática, simplemente devolvemos un array vacío
 */
export const getAffiliateLinks = async (appId: string): Promise<any[]> => {
  return [];
};