#!/bin/bash

echo "Iniciando compilación de versión estática para Cloudflare Pages..."

# Crear directorios necesarios si no existen
mkdir -p dist

# Copiar archivo estático de entrada
echo "Preparando archivos para compilación..."
cp -f client/index.html client/static-index.html
sed -i 's/index.tsx/index-static.tsx/g' client/static-index.html

# Ejecutar compilación con configuración específica para Cloudflare
echo "Ejecutando compilación con Vite..."
npx vite build --config vite.cloudflare.config.ts --outDir ../dist

# Copiar archivos adicionales necesarios en Cloudflare
echo "Copiando archivos adicionales..."
cp -f public/_redirects dist/ || echo "No hay archivo _redirects para copiar"

# Eliminar archivo temporal
rm -f client/static-index.html

echo "Compilación completada. Los archivos se encuentran en la carpeta dist/"