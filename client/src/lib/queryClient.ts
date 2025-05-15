import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "../env";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: RequestCredentials;
}

// Función auxiliar para crear la URL completa de la API
function getFullApiUrl(url: string): string {
  // Si la URL ya es absoluta, la devolvemos tal cual
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si la URL comienza con /, asumimos que es una ruta API
  if (url.startsWith('/api/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Para otras rutas, simplemente las devolvemos tal cual
  return url;
}

// Función principal de API
export async function apiRequest<T = any>(
  urlOrMethod: string,
  urlOrOptions?: string | RequestOptions,
  data?: any
): Promise<T> {
  // Detectar si se está usando la forma antigua o la nueva
  if (urlOrOptions && typeof urlOrOptions === 'object') {
    // Forma antigua: apiRequest(url, options)
    const url = urlOrMethod;
    const options = urlOrOptions as RequestOptions;
    const fullUrl = getFullApiUrl(url);
    
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body,
      credentials: 'include',
    };

    const res = await fetch(fullUrl, fetchOptions);
    await throwIfResNotOk(res);
    return await res.json();
  } else {
    // Forma nueva: apiRequest(method, url, data)
    const method = urlOrMethod;
    const url = urlOrOptions as string;
    const fullUrl = getFullApiUrl(url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };
    
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body = JSON.stringify(data);
    }

    const res = await fetch(fullUrl, fetchOptions);
    await throwIfResNotOk(res);
    return await res.json();
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Obtenemos la URL de la API
    const url = getFullApiUrl(queryKey[0] as string);
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
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
