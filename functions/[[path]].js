export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Solo interceptamos las solicitudes a la API
  if (url.pathname.startsWith('/api/')) {
    // Construimos la URL de la API en Replit
    const apiUrl = new URL(url.pathname, 'https://topapps.replit.app');
    
    // Copiamos los parámetros de consulta
    apiUrl.search = url.search;
    
    // Copiamos todos los encabezados originales excepto host
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    }
    
    // Creamos una nueva solicitud para enviar a Replit
    const apiRequest = new Request(apiUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
      redirect: 'follow'
    });
    
    try {
      // Enviamos la solicitud a Replit
      const apiResponse = await fetch(apiRequest);
      
      // Creamos una respuesta con los mismos datos
      const response = new Response(apiResponse.body, {
        status: apiResponse.status,
        statusText: apiResponse.statusText
      });
      
      // Copiamos los encabezados de la respuesta
      for (const [key, value] of apiResponse.headers.entries()) {
        response.headers.set(key, value);
      }
      
      // Aseguramos que CORS esté habilitado
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    } catch (error) {
      // Si hay un error, devolvemos una respuesta de error
      return new Response(JSON.stringify({ error: 'Error al conectar con la API de Replit', details: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
  }
  
  // Si no es una solicitud a la API, dejamos que Cloudflare Pages maneje la solicitud
  return new Response(null, {
    status: 404,
    statusText: 'Not Found'
  });
}