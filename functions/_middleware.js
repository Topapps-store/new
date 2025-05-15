// Cloudflare Pages middleware function
export async function onRequest(context) {
  try {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // Skip middleware for static assets
    const skipExtensions = ['.css', '.js', '.ico', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.woff', '.woff2'];
    if (skipExtensions.some(ext => url.pathname.endsWith(ext))) {
      return next();
    }
    
    // Add CORS headers for API requests
    if (url.pathname.startsWith('/api/')) {
      const response = await next();
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return newResponse;
    }
    
    // Handle pre-flight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // 24 hours
        }
      });
    }

    // Metrics and logging
    const requestStartTime = Date.now();
    
    // Continue to the next middleware/function
    const response = await next();
    
    // Log request details
    const responseTime = Date.now() - requestStartTime;
    console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname} - ${response.status} (${responseTime}ms)`);
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message,
      path: new URL(context.request.url).pathname
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}