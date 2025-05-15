// Función principal para Cloudflare Pages
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Para solicitudes a la API, redirigir a Replit
  if (path.startsWith('/api/')) {
    try {
      // URL de la API en Replit
      const apiBaseUrl = 'https://topapps.replit.app';
      const apiUrl = `${apiBaseUrl}${path}${url.search}`;
      
      // Hacer la solicitud a la API en Replit
      const response = await fetch(apiUrl, {
        method: context.request.method,
        headers: context.request.headers,
        body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : await context.request.arrayBuffer(),
        redirect: 'follow'
      });
      
      // Crear la respuesta para Cloudflare
      const responseHeaders = new Headers(response.headers);
      
      // Agregar cabeceras CORS
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return new Response(await response.arrayBuffer(), {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });
    } catch (error) {
      // Manejar errores
      return new Response(JSON.stringify({
        error: 'Error al conectar con la API',
        message: error.message,
        path
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Para todas las demás solicitudes, dejar que Cloudflare Pages las maneje
  return context.next();
}