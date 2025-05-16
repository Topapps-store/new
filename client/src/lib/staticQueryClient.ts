import { QueryClient, QueryFunction } from "@tanstack/react-query";
import * as staticDataService from '../services/staticDataService';

// Mapa de rutas de API a funciones de servicio estático
const apiRouteToServiceMap: Record<string, Function> = {
  '/api/categories': staticDataService.fetchCategories,
  '/api/apps': staticDataService.fetchAllApps,
  '/api/apps/popular': staticDataService.fetchPopularApps,
  '/api/apps/recent': staticDataService.fetchRecentApps,
  '/api/apps/just-in-time': staticDataService.fetchJustInTimeApps,
};

// Función para extraer parámetros de la ruta
const extractParam = (route: string, pattern: string): string | null => {
  const regex = new RegExp(pattern);
  const match = route.match(regex);
  return match ? match[1] : null;
};

// Función de consulta para datos estáticos
export const staticQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey[0] as string;
  
  // Manejo de rutas exactas
  if (apiRouteToServiceMap[url]) {
    return await apiRouteToServiceMap[url]();
  }
  
  // Manejar rutas con parámetros
  if (url.match(/^\/api\/apps\/[^/]+$/)) {
    const appId = extractParam(url, /^\/api\/apps\/([^/]+)$/);
    if (appId) {
      return await staticDataService.fetchAppById(appId);
    }
  }
  
  if (url.match(/^\/api\/categories\/[^/]+$/)) {
    const categoryId = extractParam(url, /^\/api\/categories\/([^/]+)$/);
    if (categoryId) {
      return await staticDataService.fetchCategoryById(categoryId);
    }
  }
  
  if (url.match(/^\/api\/categories\/[^/]+\/apps$/)) {
    const categoryId = extractParam(url, /^\/api\/categories\/([^/]+)\/apps$/);
    if (categoryId) {
      return await staticDataService.fetchAppsByCategory(categoryId);
    }
  }
  
  if (url.match(/^\/api\/apps\/[^/]+\/affiliate-links$/)) {
    const appId = extractParam(url, /^\/api\/apps\/([^/]+)\/affiliate-links$/);
    if (appId) {
      return await staticDataService.fetchAffiliateLinks(appId);
    }
  }
  
  if (url.match(/^\/api\/apps\/related\/[^/]+$/)) {
    const appId = extractParam(url, /^\/api\/apps\/related\/([^/]+)$/);
    if (appId) {
      return await staticDataService.fetchRelatedApps(appId);
    }
  }
  
  if (url.startsWith('/api/search') && queryKey.length > 1) {
    const query = queryKey[1];
    return await staticDataService.fetchSearchResults(query);
  }
  
  // Ruta no manejada
  console.warn(`Ruta no manejada en staticQueryFn: ${url}`);
  return [];
};

// Cliente de consulta estático
export const staticQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: staticQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Simulación de apiRequest para mantener compatibilidad
export async function staticApiRequest<T = any>(
  urlOrMethod: string,
  urlOrOptions?: string | any,
  data?: any
): Promise<T> {
  // Si es la forma apiRequest(method, url, data)
  if (typeof urlOrOptions === 'string') {
    const method = urlOrMethod;
    const url = urlOrOptions;
    
    if (method === 'GET') {
      // Extraer el query de la URL
      const query = url.match(/\?q=([^&]+)/)?.[1];
      
      // Rutas exactas
      if (url.startsWith('/api/apps')) return staticDataService.fetchAllApps() as unknown as T;
      if (url.startsWith('/api/categories')) return staticDataService.fetchCategories() as unknown as T;
      if (url.startsWith('/api/search') && query) return staticDataService.fetchSearchResults(decodeURIComponent(query)) as unknown as T;
      
      // Extracción de parámetros para rutas específicas
      const appIdMatch = url.match(/\/api\/apps\/([^/]+)$/);
      if (appIdMatch) return staticDataService.fetchAppById(appIdMatch[1]) as unknown as T;
      
      const categoryIdMatch = url.match(/\/api\/categories\/([^/]+)$/);
      if (categoryIdMatch) return staticDataService.fetchCategoryById(categoryIdMatch[1]) as unknown as T;
    }
    
    if (method === 'POST' && url.includes('/affiliate-links')) {
      // Simulación de incremento de contador de clics
      return { success: true, url: data?.url || 'https://example.com' } as unknown as T;
    }
  }
  
  console.warn('Operación no soportada en modo estático:', { urlOrMethod, urlOrOptions, data });
  return {} as T;
}