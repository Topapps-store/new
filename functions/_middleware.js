/**
 * Middleware para manejar CORS y redirecciones para la API
 */
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Manejamos las solicitudes OPTIONS para CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // Para solicitudes a la API, les permitimos continuar al controlador [[path]].js
  if (url.pathname.startsWith('/api/')) {
    // El controlador de ruta se encargará de redireccionar
    const response = await next();
    
    // Aseguramos que CORS esté habilitado en todas las respuestas
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  // Para otras solicitudes, continuamos al siguiente handler
  return next();
}