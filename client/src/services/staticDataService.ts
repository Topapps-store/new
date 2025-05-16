// Servicio para manejar los datos estáticos en lugar de llamadas a la API
import { apps, getPopularApps, getRecentApps, getJustInTimeApps, getAppById, 
  getAppsByCategory, getRelatedApps, searchApps } from '../data/apps';
import { categories } from '../data/categories';

// Definimos los tipos para esta versión estática
export interface App {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  version: string;
  size: string;
  updated: string;
  requires: string;
  developer: string;
  installs: string;
  downloadUrl: string;
  googlePlayUrl: string;
  iosAppStoreUrl?: string;
  originalAppId?: string;
  screenshots: string[];
  isAffiliate: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface AffiliateLink {
  id: number;
  appId: string;
  label: string;
  url: string;
  buttonText: string;
  buttonColor: string;
  isActive: boolean;
  displayOrder: number;
}

// Simulación de tiempo de respuesta para que la UI no se vea brusca
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Funciones que reemplazan las llamadas a la API
export const fetchCategories = async () => {
  await simulateDelay();
  return categories;
};

export const fetchAllApps = async () => {
  await simulateDelay();
  return apps;
};

export const fetchPopularApps = async () => {
  await simulateDelay();
  return getPopularApps();
};

export const fetchRecentApps = async () => {
  await simulateDelay();
  return getRecentApps();
};

export const fetchJustInTimeApps = async () => {
  await simulateDelay();
  return getJustInTimeApps();
};

export const fetchAppById = async (id) => {
  await simulateDelay();
  return getAppById(id);
};

export const fetchAppsByCategory = async (categoryId) => {
  await simulateDelay();
  return getAppsByCategory(categoryId);
};

export const fetchRelatedApps = async (appId) => {
  await simulateDelay();
  return getRelatedApps(appId);
};

export const fetchSearchResults = async (query) => {
  await simulateDelay();
  return searchApps(query);
};

export const fetchCategoryById = async (id) => {
  await simulateDelay();
  return categories.find(category => category.id === id);
};

// Simulación de enlaces de afiliados - en la versión estática solo devolveremos datos fijos
export const fetchAffiliateLinks = async (appId) => {
  await simulateDelay();
  
  const app = getAppById(appId);
  if (!app || !app.isAffiliate) return [];
  
  return [
    {
      id: 1,
      appId: app.id,
      label: "Descarga Oficial",
      url: app.googlePlayUrl || app.downloadUrl,
      buttonText: "Descargar Ahora",
      buttonColor: "#4CAF50",
      isActive: true,
      displayOrder: 1
    }
  ];
};

// No hay operaciones de escritura en esta versión estática
export const incrementLinkClickCount = async (id) => {
  await simulateDelay();
  // En la versión estática, simplemente devolvemos un objeto simulado
  return {
    success: true,
    url: "https://play.google.com/store/apps"
  };
};