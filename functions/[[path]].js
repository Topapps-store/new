// Cloudflare Pages Function - API handler
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check endpoint
  if (path === '/api/health') {
    return new Response(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: 'cloudflare'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  // Proxy a nuestro backend
  try {
    // Configurar URL de la API en Replit
    const apiUrl = 'https://topapps.replit.app' + path + url.search;
    
    // Pasar la mayoría de los headers originales
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      // Filtrar algunos headers que pueden causar problemas
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    
    // Si es una solicitud POST/PUT, obtenemos el cuerpo
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      body = await request.text();
    }
    
    // Hacer la solicitud a la API
    const response = await fetch(apiUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'follow'
    });
    
    // Construir la respuesta para Cloudflare
    const responseHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      responseHeaders.set(key, value);
    }
    
    // Agregar cabeceras CORS
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Devolver la respuesta
    return new Response(await response.text(), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    // Manejar errores
    return new Response(JSON.stringify({
      error: error.message || 'Error del servidor',
      path: url.pathname,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}