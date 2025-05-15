/**
 * Simple API Router for Cloudflare Pages Functions
 * 
 * A lightweight router for handling API requests in a Cloudflare Pages Functions environment.
 * Provides middleware support, error handling, and route registration.
 */

type Request = {
  method: string;
  url: string;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Headers;
  body: any;
};

type Response = {
  status: (code: number) => Response;
  headers: Headers;
  json: (data: any) => void;
  send: (data: any) => void;
  text: (data: string) => void;
};

type Handler = (req: Request, res: Response, next?: () => void) => void | Promise<void>;
type ErrorHandler = (err: Error, req: Request, res: Response) => void | Promise<void>;

export function createRouter() {
  const routes: { method: string; path: string; handlers: Handler[] }[] = [];
  const middlewares: Handler[] = [];
  let errorHandler: ErrorHandler = (err, req, res) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };

  // Helper to match route patterns (with params)
  function matchRoute(pattern: string, path: string) {
    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);
    
    if (patternSegments.length !== pathSegments.length) {
      return null;
    }
    
    const params: Record<string, string> = {};
    
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];
      
      if (patternSegment.startsWith(':')) {
        // This is a parameter
        const paramName = patternSegment.slice(1);
        params[paramName] = pathSegment;
      } else if (patternSegment !== pathSegment) {
        // Static segment doesn't match
        return null;
      }
    }
    
    return params;
  }

  // Parse request body based on content type
  async function parseBody(request: Request) {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        const text = await request.headers.get('content-length') ? request.body : '{}';
        return text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Error parsing JSON body:', err);
        return {};
      }
    }
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await request.body;
        const params = new URLSearchParams(formData);
        const result: Record<string, string> = {};
        
        for (const [key, value] of params.entries()) {
          result[key] = value;
        }
        
        return result;
      } catch (err) {
        console.error('Error parsing form data:', err);
        return {};
      }
    }
    
    return null;
  }
  
  return {
    // Register middleware that runs before routes
    use(handler: Handler) {
      middlewares.push(handler);
      return this;
    },
    
    // Register route handlers
    get(path: string, ...handlers: Handler[]) {
      routes.push({ method: 'GET', path, handlers });
      return this;
    },
    
    post(path: string, ...handlers: Handler[]) {
      routes.push({ method: 'POST', path, handlers });
      return this;
    },
    
    put(path: string, ...handlers: Handler[]) {
      routes.push({ method: 'PUT', path, handlers });
      return this;
    },
    
    patch(path: string, ...handlers: Handler[]) {
      routes.push({ method: 'PATCH', path, handlers });
      return this;
    },
    
    delete(path: string, ...handlers: Handler[]) {
      routes.push({ method: 'DELETE', path, handlers });
      return this;
    },
    
    // Register error handler
    onError(handler: ErrorHandler) {
      errorHandler = handler;
      return this;
    },
    
    // Main handler for Cloudflare Pages Functions
    async handle(context: any) {
      const { request, env } = context;
      
      try {
        // Add environment variables to global scope for compatibility
        if (env) {
          Object.keys(env).forEach(key => {
            // @ts-ignore
            globalThis.process = globalThis.process || { env: {} };
            // @ts-ignore
            globalThis.process.env[key] = env[key];
          });
        }
        
        // Parse URL and query params
        const url = new URL(request.url);
        const path = url.pathname.replace(/^\/api/, '');
        const query: Record<string, string> = {};
        
        for (const [key, value] of url.searchParams.entries()) {
          query[key] = value;
        }
        
        // Create request and response objects
        const req: Request = {
          method: request.method,
          url: request.url,
          params: {},
          query,
          headers: request.headers,
          body: await parseBody(request as any)
        };
        
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        
        let statusCode = 200;
        let responseBody: any = null;
        let responseSent = false;
        
        const res: Response = {
          status(code) {
            statusCode = code;
            return this;
          },
          headers,
          json(data) {
            responseBody = JSON.stringify(data);
            responseSent = true;
          },
          send(data) {
            if (typeof data === 'object') {
              return this.json(data);
            }
            responseBody = String(data);
            responseSent = true;
          },
          text(data) {
            headers.set('Content-Type', 'text/plain');
            responseBody = data;
            responseSent = true;
          }
        };
        
        // Match route
        let matchedRoute = null;
        for (const route of routes) {
          if (route.method !== request.method) {
            continue;
          }
          
          const params = matchRoute(route.path, path);
          if (params) {
            req.params = params;
            matchedRoute = route;
            break;
          }
        }
        
        // Run middleware first
        if (middlewares.length > 0) {
          let currentMiddlewareIndex = 0;
          
          const runMiddleware = async () => {
            if (currentMiddlewareIndex < middlewares.length && !responseSent) {
              const middleware = middlewares[currentMiddlewareIndex++];
              await middleware(req, res, runMiddleware);
            }
            
            // If middleware chain completes and no response sent, continue to route handlers
            if (currentMiddlewareIndex >= middlewares.length && !responseSent && matchedRoute) {
              await runHandlers(matchedRoute.handlers);
            }
          };
          
          await runMiddleware();
        } else if (matchedRoute) {
          await runHandlers(matchedRoute.handlers);
        }
        
        // Run route handlers in sequence
        async function runHandlers(handlers: Handler[]) {
          let currentHandlerIndex = 0;
          
          const next = async () => {
            if (currentHandlerIndex < handlers.length && !responseSent) {
              const handler = handlers[currentHandlerIndex++];
              await handler(req, res, next);
            }
          };
          
          await next();
        }
        
        // No matched route
        if (!matchedRoute && !responseSent) {
          return new Response(JSON.stringify({
            error: 'Not Found',
            status: 'error',
            path
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Return response if sent
        if (responseSent) {
          return new Response(responseBody, {
            status: statusCode,
            headers
          });
        }
        
        // Default response
        return new Response(JSON.stringify({
          status: 'ok',
          message: 'No content returned from handler'
        }), {
          status: 204,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        try {
          // Create minimal req/res for error handler
          const req = {
            method: request.method,
            url: request.url,
            params: {},
            query: {},
            headers: request.headers,
            body: null
          };
          
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          
          let statusCode = 500;
          let responseBody = null;
          let responseSent = false;
          
          const res = {
            status(code: number) {
              statusCode = code;
              return this;
            },
            headers,
            json(data: any) {
              responseBody = JSON.stringify(data);
              responseSent = true;
            },
            send(data: any) {
              if (typeof data === 'object') {
                return this.json(data);
              }
              responseBody = String(data);
              responseSent = true;
            },
            text(data: string) {
              headers.set('Content-Type', 'text/plain');
              responseBody = data;
              responseSent = true;
            }
          };
          
          // Call error handler
          await errorHandler(err instanceof Error ? err : new Error(String(err)), req as Request, res as Response);
          
          if (responseSent) {
            return new Response(responseBody, {
              status: statusCode,
              headers
            });
          }
        } catch (handlerError) {
          console.error('Error in error handler:', handlerError);
        }
        
        // Fallback error response
        return new Response(JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal Server Error',
          status: 'error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  };
}