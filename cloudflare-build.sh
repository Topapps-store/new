#!/bin/bash
set -e

echo "🚀 Iniciando construcción para Cloudflare Pages..."

# Configurar entorno
export NODE_ENV=production

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir el frontend
echo "🏗️ Construyendo el frontend..."
npm run build

# Copiar archivos de configuración para Cloudflare Pages
echo "📋 Configurando redirecciones y headers..."
cp _redirects dist/public/
cp _headers dist/public/

# También crear los archivos directamente por si acaso
cat > dist/public/_redirects << EOL
/api/*  https://topapps.replit.app/api/:splat  200
/*      /index.html                            200
EOL

cat > dist/public/_headers << EOL
/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
EOL

# Crear un archivo nojekyll para evitar problemas con GitHub Pages
touch dist/public/.nojekyll

echo "✅ Construcción completada para Cloudflare Pages!"
echo "   Directorio de salida: dist/public"
echo ""
echo "Configuración recomendada para Cloudflare Pages:"
echo "- Build command: ./cloudflare-build.sh"
echo "- Build output directory: dist/public"
echo ""
echo "NOTA: Esta configuración redirigirá todas las solicitudes API a tu instancia de Replit."