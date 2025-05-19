#!/bin/bash

echo "Iniciando proceso de build estático para Cloudflare..."

# Configurar variables de entorno para el build
echo "Configurando variables de entorno..."
echo "VITE_API_BASE_URL=https://topapps-store.replit.app/api" > .env.production

# Crear archivo _redirects para Cloudflare Pages
echo "Creando archivo _redirects..."
mkdir -p public
echo "/* /index.html 200" > public/_redirects

# Crear archivo _routes.json para manejo de rutas en Cloudflare
echo "Creando archivo _routes.json..."
cat > public/_routes.json << EOF
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
EOF

# Ejecutar build de Vite con la configuración específica para Cloudflare
echo "Ejecutando build estático con Vite..."
npx vite build --config vite.cloudflare.config.ts

echo "Proceso de build estático completado."
echo "Los archivos para despliegue se encuentran en la carpeta 'dist'."
echo "Puedes subir estos archivos a Cloudflare Pages para el despliegue."