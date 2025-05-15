// This file will be replaced during the build process
// The build process will generate this file from server/cloudflare.ts
// This is just a more informative placeholder

export default {
  async fetch(request, env, ctx) {
    try {
      // Check if this is a health check
      const url = new URL(request.url);
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: "ok",
          message: "API is running",
          version: "1.0.0",
          environment: env.NODE_ENV || "development"
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      return new Response("API placeholder - will be replaced during build.", { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message || "Unknown error",
        stack: env.NODE_ENV === 'development' ? error.stack : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}