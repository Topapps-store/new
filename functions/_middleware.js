// Middleware global para Cloudflare Pages
export async function onRequest(context) {
  // Para solicitudes OPTIONS (preflight CORS)
  if (context.request.method === 'OPTIONS') {
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
  
  // Para todas las demás solicitudes
  const response = await context.next();
  
  // Modificar las cabeceras de la respuesta para agregar seguridad
  const newResponse = new Response(response.body, response);
  
  // Agregar cabeceras de seguridad
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return newResponse;
}