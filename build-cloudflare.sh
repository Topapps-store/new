#!/bin/bash
set -e

# Configurar para producción
echo "🔧 Configurando para despliegue en Cloudflare..."
export NODE_ENV=production

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir el frontend
echo "🏗️ Construyendo aplicación frontend..."
npm run build

# Crear directorio para funciones
echo "🔧 Preparando funciones de Cloudflare..."
mkdir -p functions

# Crear una función simple para verificar que Cloudflare Functions funciona
echo "✨ Creando función de prueba..."
cat > functions/hello.js << EOL
// Función de prueba para verificar que Cloudflare Functions está funcionando
export function onRequest(context) {
  return new Response(JSON.stringify({
    message: "Hello from Cloudflare Functions!",
    timestamp: new Date().toISOString()
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
EOL

# Crear una función para redirigir solicitudes API
echo "🔄 Creando función de redirección API..."
cat > functions/api/[[route]].js << EOL
// Función para redirigir solicitudes API a la instancia de Replit
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // URL de la API en Replit
  const apiBaseUrl = "https://topapps.replit.app";
  const apiUrl = \`\${apiBaseUrl}\${path}\${url.search}\`;
  
  try {
    // Preparar opciones para la solicitud
    const options = {
      method: context.request.method,
      headers: new Headers(context.request.headers),
      redirect: "follow"
    };
    
    // Agregar cuerpo para métodos que lo requieren
    if (!["GET", "HEAD"].includes(context.request.method)) {
      options.body = await context.request.arrayBuffer();
    }
    
    // Hacer la solicitud a Replit
    const response = await fetch(apiUrl, options);
    
    // Preparar la respuesta
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Error al conectar con la API",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
EOL

# Crear un archivo de rutas mínimo
echo "🗺️ Creando configuración de rutas..."
cat > functions/_routes.json << EOL
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
EOL

# Crear archivo para manejo CORS
echo "🔒 Configurando CORS..."
cat > functions/_middleware.js << EOL
export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  
  return context.next();
}
EOL

# Crear archivo _redirects para manejo SPA
echo "⚙️ Configurando redirecciones SPA..."
mkdir -p dist
cat > dist/_redirects << EOL
/*    /index.html   200
EOL

echo "✅ Build para Cloudflare completado con éxito!"