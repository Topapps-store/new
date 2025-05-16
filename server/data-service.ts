/**
 * Servicio unificado de datos
 * 
 * Este archivo proporciona una capa de abstracción que funciona tanto
 * en entornos con base de datos como en entornos estáticos.
 */

import { db, pool } from './db';
import { AppLegacy, CategoryLegacy, AffiliateLink } from '@shared/schema';

// Importamos el servicio de datos estáticos
import * as staticDataService from '../client/src/services/staticDataService';

// Variable para detectar si estamos en entorno estático
const isStaticEnvironment = !db || 
                          process.env.IS_STATIC === 'true' || 
                          process.env.CF_PAGES === 'true';

/**
 * Interfaz unificada para acceder a los datos
 * Utiliza el servicio estático o el servicio de base de datos según el entorno
 */
export const dataService = {
  // Métodos de aplicaciones
  getApps: async (): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getAllApps();
    }
    
    try {
      // Aquí iría la implementación con base de datos
      // Está comentada para evitar errores en entorno estático
      return staticDataService.getAllApps();
    } catch (error) {
      console.error('Error getting apps:', error);
      return staticDataService.getAllApps();
    }
  },
  
  getPopularApps: async (): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getPopularApps();
    }
    
    try {
      return staticDataService.getPopularApps();
    } catch (error) {
      console.error('Error getting popular apps:', error);
      return staticDataService.getPopularApps();
    }
  },

  getRecentApps: async (): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getRecentApps();
    }
    
    try {
      return staticDataService.getRecentApps();
    } catch (error) {
      console.error('Error getting recent apps:', error);
      return staticDataService.getRecentApps();
    }
  },

  getJustInTimeApps: async (): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getJustInTimeApps();
    }
    
    try {
      return staticDataService.getJustInTimeApps();
    } catch (error) {
      console.error('Error getting just-in-time apps:', error);
      return staticDataService.getJustInTimeApps();
    }
  },
  
  getAppById: async (id: string): Promise<AppLegacy | undefined> => {
    if (isStaticEnvironment) {
      return staticDataService.getAppById(id);
    }
    
    try {
      return staticDataService.getAppById(id);
    } catch (error) {
      console.error(`Error getting app by id ${id}:`, error);
      return staticDataService.getAppById(id);
    }
  },
  
  searchApps: async (query: string): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.searchApps(query);
    }
    
    try {
      return staticDataService.searchApps(query);
    } catch (error) {
      console.error(`Error searching apps with query ${query}:`, error);
      return staticDataService.searchApps(query);
    }
  },
  
  getRelatedApps: async (id: string): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getRelatedApps(id);
    }
    
    try {
      return staticDataService.getRelatedApps(id);
    } catch (error) {
      console.error(`Error getting related apps for ${id}:`, error);
      return staticDataService.getRelatedApps(id);
    }
  },
  
  // Métodos de categorías
  getCategories: async (): Promise<CategoryLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getAllCategories();
    }
    
    try {
      return staticDataService.getAllCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      return staticDataService.getAllCategories();
    }
  },
  
  getCategoryById: async (id: string): Promise<CategoryLegacy | undefined> => {
    if (isStaticEnvironment) {
      return staticDataService.getCategoryById(id);
    }
    
    try {
      return staticDataService.getCategoryById(id);
    } catch (error) {
      console.error(`Error getting category by id ${id}:`, error);
      return staticDataService.getCategoryById(id);
    }
  },
  
  getAppsByCategory: async (categoryId: string): Promise<AppLegacy[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getAppsByCategory(categoryId);
    }
    
    try {
      return staticDataService.getAppsByCategory(categoryId);
    } catch (error) {
      console.error(`Error getting apps by category ${categoryId}:`, error);
      return staticDataService.getAppsByCategory(categoryId);
    }
  },
  
  // Métodos de enlaces de afiliados
  getAffiliateLinks: async (appId: string): Promise<AffiliateLink[]> => {
    if (isStaticEnvironment) {
      return staticDataService.getAffiliateLinks(appId);
    }
    
    try {
      return staticDataService.getAffiliateLinks(appId);
    } catch (error) {
      console.error(`Error getting affiliate links for ${appId}:`, error);
      return staticDataService.getAffiliateLinks(appId);
    }
  },
  
  // Método de análisis (tracking)
  incrementLinkClickCount: async (id: number): Promise<any> => {
    if (isStaticEnvironment) {
      console.log(`[Static Mode] Simulating increment click for link ${id}`);
      return { id, clicks: 1, url: "#" };
    }
    
    try {
      // En producción, implementar este método con la base de datos
      console.log(`[Static Mode] Simulating increment click for link ${id}`);
      return { id, clicks: 1, url: "#" };
    } catch (error) {
      console.error(`Error incrementing link click count for ${id}:`, error);
      return null;
    }
  }
};