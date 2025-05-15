// Middleware para Cloudflare Pages Functions
export async function onRequest(context) {
  // Procesamiento de CORS para solicitudes OPTIONS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
  
  // Continuar con el siguiente middleware o función
  return context.next();
}