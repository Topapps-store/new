import { 
  QueryClient, 
  QueryFunction,
  DefaultOptions 
} from '@tanstack/react-query';
import * as staticDataService from '../services/staticDataService';

// Funciones para obtener datos estáticos
const staticDataQueries = {
  // Usamos los mismos nombres que se esperan en la interfaz pero 
  // internamente llamamos a los métodos correctos del servicio estático
  fetchCategories: () => staticDataService.getCategories(),
  fetchAllApps: () => staticDataService.getAllApps(),
  fetchPopularApps: () => staticDataService.getPopularApps(),
  fetchRecentApps: () => staticDataService.getRecentApps(),
  fetchJustInTimeApps: () => staticDataService.getJustInTimeApps(),
  fetchSearchResults: (query: string) => staticDataService.searchApps(query),
  fetchAppById: (id: string) => staticDataService.getAppById(id),
  fetchCategoryById: (id: string) => staticDataService.getCategoryById(id),
  fetchAppsByCategory: (categoryId: string) => staticDataService.getAppsByCategory(categoryId),
  fetchAffiliateLinks: (appId: string) => staticDataService.getAffiliateLinks(appId),
  fetchRelatedApps: (appId: string) => staticDataService.getRelatedApps(appId)
};

// Cliente de consultas predeterminado
const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  // Extraer la ruta de la clave de consulta
  const [path, ...params] = queryKey as [string, ...any[]];
  
  // Mapeo de rutas de API a consultas estáticas
  if (path === '/api/apps') {
    return staticDataQueries.fetchAppById(params[0]);
  } else if (path === '/api/categories') {
    return staticDataQueries.fetchCategoryById(params[0]);
  } else if (path === '/api/categories/{categoryId}/apps') {
    return staticDataQueries.fetchAppsByCategory(params[0]);
  } else if (path === '/api/apps/{appId}/affiliate-links') {
    return staticDataQueries.fetchAffiliateLinks(params[0]);
  } else if (path === '/api/apps/{appId}/related') {
    return staticDataQueries.fetchRelatedApps(params[0]);
  } else if (path === '/api/search') {
    return staticDataQueries.fetchSearchResults(params[0]);
  } else if (path === '/api/apps/popular') {
    return staticDataQueries.fetchPopularApps();
  } else if (path === '/api/apps/recent') {
    return staticDataQueries.fetchRecentApps();
  } else if (path === '/api/apps/jit') {
    return staticDataQueries.fetchJustInTimeApps();
  } else if (path === '/api/apps/all') {
    return staticDataQueries.fetchAllApps();
  } else if (path === '/api/categories/all') {
    return staticDataQueries.fetchCategories();
  }
  
  // Si no hay una consulta estática correspondiente, devolver un error
  throw new Error(`No static data available for query key: ${path}`);
};

// Función para realizar solicitudes a la API (actualizaciones)
// En la versión estática, esta función lanza un error ya que no hay actualizaciones
export const apiRequest = async () => {
  throw new Error('Las actualizaciones no están disponibles en la versión estática');
};

// Opciones predeterminadas para el cliente de consultas
const defaultOptions: DefaultOptions = {
  queries: {
    queryFn: defaultQueryFn,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  },
};

// Cliente de consultas para la aplicación
export const queryClient = new QueryClient({
  defaultOptions,
});

// Función para precargar los datos comunes
export const prefetchCommonData = async () => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['/api/apps/all'],
      queryFn: staticDataQueries.fetchAllApps
    }),
    queryClient.prefetchQuery({
      queryKey: ['/api/categories/all'],
      queryFn: staticDataQueries.fetchCategories
    }),
  ]);
};

// Exportar todas las consultas estáticas para usarlas directamente
export const staticQueries = staticDataQueries;