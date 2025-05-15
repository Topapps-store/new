#!/bin/bash

# Make script exit on first error
set -e

# Set Node.js version (ensure this matches with your project needs)
export NODE_VERSION=20

# Print status
echo "Starting build process for TopApps.store..."
echo "NODE_ENV: $NODE_ENV"

# Check for database environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL is not set. This might cause issues with database connections."
else
  echo "Database configuration detected."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations if needed (only in production)
if [ "$NODE_ENV" = "production" ] && [ ! -z "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  # Now we're actually running migrations in production
  npx drizzle-kit push:pg
fi

# Build frontend app
echo "Building frontend app..."
npm run build

# Preparar las funciones para Cloudflare
echo "Preparando funciones para Cloudflare Pages..."
mkdir -p functions

# Asegurar que los archivos de funciones tienen la estructura correcta
echo "Verificando estructura de funciones para Cloudflare Pages..."

# Verificar que existe el archivo principal de funciones
if [ ! -f functions/[[path]].js ]; then
  echo "Creando archivo principal de función para Cloudflare Pages..."
  
  # Crear archivo de ruta principal
  cat > functions/[[path]].js << EOL
// Función principal para Cloudflare Pages
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Para solicitudes a la API, redirigir a Replit
  if (path.startsWith('/api/')) {
    try {
      // URL de la API en Replit
      const apiBaseUrl = 'https://topapps.replit.app';
      const apiUrl = \`\${apiBaseUrl}\${path}\${url.search}\`;
      
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
EOL
fi

# Verificar que existe el archivo de middleware
if [ ! -f functions/_middleware.js ]; then
  echo "Creando archivo de middleware para Cloudflare Pages..."
  
  # Crear archivo de middleware
  cat > functions/_middleware.js << EOL
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
EOL
fi

# Create _routes.json file for Cloudflare Pages to properly route requests
echo "Creating Cloudflare routes configuration..."
cat > functions/_routes.json << EOL
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/assets/*",
    "/*.ico",
    "/*.svg",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.gif",
    "/*.css",
    "/*.js",
    "/*.woff",
    "/*.woff2"
  ]
}
EOL

# Create a _headers file for security
echo "Creating security headers file..."
mkdir -p dist/public
cat > dist/public/_headers << EOL

/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: upgrade-insecure-requests
EOL

# Copy _redirects file for client-side routing
echo "Copying _redirects file for SPA routing..."
cp public/_redirects dist/

echo "Build completed successfully!"