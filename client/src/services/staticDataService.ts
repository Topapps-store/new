import appsJsonData from '../data/apps.json';
// Definición de tipos inline para evitar problemas de importación
// Estos tipos deben coincidir con los de server/types/legacy.ts

export interface AppLegacy {
  id: string;
  name: string;
  category?: string;
  categoryId: string;
  description: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  version: string;
  size: string;
  updated: string;
  requires?: string;
  developer?: string;
  developerEmail?: string;
  developerWebsite?: string;
  downloadUrl?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  screenshots?: string[];
  isAffiliate?: boolean;
}

export interface CategoryLegacy {
  id: string;
  name: string;
}

export interface AffiliateLink {
  id: number;
  appId: string;
  title: string;
  url: string;
  isAffiliate: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppVersionHistory {
  id: number;
  appId: string;
  version: string;
  releaseNotes?: string;
  releaseDate: Date;
  isNotified: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definir un tipo para los datos de aplicaciones
type AppData = {
  apps: AppLegacy[];
  categories: CategoryLegacy[];
  lastUpdated: string;
};

// Cargar datos desde el archivo JSON
let appData: AppData = appsJsonData as AppData;

/**
 * Obtener todas las aplicaciones
 */
export function getAllApps(): AppLegacy[] {
  return appData.apps;
}

/**
 * Obtener aplicaciones populares (ordenadas por rating)
 */
export function getPopularApps(): AppLegacy[] {
  return [...appData.apps]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
}

/**
 * Obtener aplicaciones recientes (ordenadas por fecha de actualización)
 */
export function getRecentApps(): AppLegacy[] {
  return [...appData.apps]
    .sort((a, b) => {
      const dateA = new Date(a.updated || '');
      const dateB = new Date(b.updated || '');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10);
}

/**
 * Obtener aplicaciones just-in-time (una selección aleatoria)
 */
export function getJustInTimeApps(): AppLegacy[] {
  const shuffled = [...appData.apps].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

/**
 * Obtener una aplicación por su ID
 */
export function getAppById(id: string): AppLegacy | undefined {
  return appData.apps.find(app => app.id === id);
}

/**
 * Buscar aplicaciones por término de búsqueda
 */
export function searchApps(query: string): AppLegacy[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }
  
  return appData.apps.filter(app => {
    return (
      app.name.toLowerCase().includes(normalizedQuery) ||
      app.description.toLowerCase().includes(normalizedQuery) ||
      app.developer?.toLowerCase().includes(normalizedQuery) ||
      app.category?.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Obtener todas las categorías
 */
export function getCategories(): CategoryLegacy[] {
  return appData.categories;
}

/**
 * Obtener una categoría por su ID
 */
export function getCategoryById(id: string): CategoryLegacy | undefined {
  return appData.categories.find(category => category.id === id);
}

/**
 * Obtener aplicaciones por categoría
 */
export function getAppsByCategory(categoryId: string): AppLegacy[] {
  if (!categoryId) {
    return [];
  }
  
  return appData.apps.filter(app => app.categoryId === categoryId);
}

/**
 * Obtener aplicaciones relacionadas (del mismo desarrollador o categoría)
 */
export function getRelatedApps(appId: string): AppLegacy[] {
  const app = getAppById(appId);
  
  if (!app) {
    return [];
  }
  
  // Primero intentamos obtener apps del mismo desarrollador
  const sameDeveloper = appData.apps.filter(
    a => a.id !== appId && a.developer === app.developer
  );
  
  // Si no hay suficientes, añadimos de la misma categoría
  if (sameDeveloper.length >= 5) {
    return sameDeveloper.slice(0, 5);
  }
  
  const sameCategory = appData.apps.filter(
    a => a.id !== appId && a.categoryId === app.categoryId && a.developer !== app.developer
  );
  
  // Combinar y devolver hasta 5 apps
  return [...sameDeveloper, ...sameCategory].slice(0, 5);
}

/**
 * Obtener enlaces de afiliado para una aplicación
 * (Simulado - no hay enlaces de afiliado en el JSON)
 */
export function getAffiliateLinks(appId: string): AffiliateLink[] {
  const app = getAppById(appId);
  
  if (!app) {
    return [];
  }
  
  // Si la app tiene un enlace de descarga, lo usamos como enlace de afiliado
  if (app.downloadUrl) {
    return [
      {
        id: 1,
        appId: appId,
        title: 'Descarga oficial',
        url: app.downloadUrl,
        isAffiliate: false,
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  return [];
}

// Métodos adicionales que no se implementan en la versión estática
// pero se incluyen para mantener compatibilidad con la interfaz IStorage

export function getUser(id: number): User | undefined {
  return undefined;
}

export function getUserByUsername(username: string): User | undefined {
  return undefined;
}

export function createUser(): User {
  throw new Error('No se puede crear usuario en la versión estática');
}

export function updateApp(): AppLegacy | undefined {
  throw new Error('No se puede actualizar aplicación en la versión estática');
}

export function deleteApp(): boolean {
  throw new Error('No se puede eliminar aplicación en la versión estática');
}

export function getAllAffiliateLinks(): AffiliateLink[] {
  return [];
}

export function getAffiliateLinkById(): AffiliateLink | undefined {
  return undefined;
}

export function createAffiliateLink(): AffiliateLink {
  throw new Error('No se puede crear enlace de afiliado en la versión estática');
}

export function updateAffiliateLink(): AffiliateLink | undefined {
  throw new Error('No se puede actualizar enlace de afiliado en la versión estática');
}

export function deleteAffiliateLink(): boolean {
  throw new Error('No se puede eliminar enlace de afiliado en la versión estática');
}

export function incrementLinkClickCount(): AffiliateLink | undefined {
  return undefined;
}

export function getAffiliateLinkAnalytics(): {appId: string, appName: string, totalClicks: number}[] {
  return [];
}

export function getAppVersionHistory(): AppVersionHistory[] {
  return [];
}

export function getLatestAppVersion(): AppVersionHistory | undefined {
  return undefined;
}

export function addAppVersionHistory(): AppVersionHistory {
  throw new Error('No se puede añadir versión de aplicación en la versión estática');
}

export function markVersionNotified(): AppVersionHistory | undefined {
  return undefined;
}

export function getRecentAppUpdates(): {app: AppLegacy, versionHistory: AppVersionHistory}[] {
  return [];
}

export function getUnnotifiedUpdates(): {app: AppLegacy, versionHistory: AppVersionHistory}[] {
  return [];
}