import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Helper function to make API requests
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'same-origin',
  };
  
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }
  
  return fetch(url, options);
}

/**
 * Default query function for React Query
 */
export function getQueryFn<T = any>(options?: { on401?: 'throw' | 'returnNull' }) {
  return async ({ queryKey }: { queryKey: string[] }): Promise<T | undefined> => {
    const [url] = queryKey;
    
    const res = await apiRequest('GET', url);
    
    if (res.status === 401 && options?.on401 === 'returnNull') {
      return undefined;
    }
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `API error: ${res.status}`);
    }
    
    return res.json();
  };
}