#!/bin/bash

echo "Creando archivos para despliegue a Cloudflare..."

# Configurar variables de entorno
echo "VITE_API_BASE_URL=https://topapps-store.replit.app/api" > .env.production

# Crear directorio para archivos estáticos
mkdir -p dist

# Copiar el archivo apps_data.json a la carpeta dist
cp apps_data.json dist/

# Crear archivo _redirects para Cloudflare Pages
echo "/* /index.html 200" > dist/_redirects

# Crear archivo _routes.json para manejo de rutas en Cloudflare
cat > dist/_routes.json << EOF
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
EOF

echo "Archivos para despliegue generados en la carpeta 'dist'."
echo "Para completar el despliegue, sube los archivos a Cloudflare Pages."
echo "Importante: Configurar las siguientes variables de entorno en Cloudflare Pages:"
echo "- NODE_VERSION: 20"
echo "- VITE_API_BASE_URL: https://topapps-store.replit.app/api"