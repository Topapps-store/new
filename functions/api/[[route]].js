// Manejador específico para rutas API
export function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // URL de la API en Replit
  const apiBaseUrl = 'https://topapps.replit.app';
  const apiUrl = `${apiBaseUrl}${path}${url.search}`;
  
  return proxyRequest(context, apiUrl);
}

async function proxyRequest(context, targetUrl) {
  try {
    // Preparar el cuerpo de la solicitud
    let body = null;
    if (!['GET', 'HEAD'].includes(context.request.method)) {
      try {
        body = await context.request.arrayBuffer();
      } catch (e) {
        console.error('Error al leer el cuerpo de la solicitud:', e);
      }
    }
    
    // Hacer la solicitud a la API en Replit
    const response = await fetch(targetUrl, {
      method: context.request.method,
      headers: context.request.headers,
      body,
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
    console.error('Error al procesar la solicitud API:', error);
    
    // Devolver respuesta de error
    return new Response(JSON.stringify({
      error: 'Error al conectar con la API',
      message: error.message,
      path: new URL(context.request.url).pathname
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}