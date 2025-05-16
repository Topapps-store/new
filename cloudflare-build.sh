#!/bin/bash

# Script de compilación para Cloudflare Pages
# Este script prepara el proyecto para despliegue en Cloudflare Pages

# Mostrar versión de Node.js
echo "🔍 Versión de Node.js: $(node -v)"
echo "🔍 Versión de npm: $(npm -v)"

# Establecer variables de entorno
export IS_STATIC=true
export CF_PAGES=true

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Ejecutar proceso de compilación
echo "🏗️ Compilando proyecto..."
npm run build

# Asegurar que las funciones de Cloudflare están en el lugar correcto
echo "🔄 Configurando funciones de Cloudflare..."
if [ ! -d "dist/functions" ]; then
  mkdir -p dist/functions
fi

# Copiar archivos de funciones si no están presentes en dist/
cp -r functions/* dist/functions/

# Asegurar que existe el archivo _redirects
if [ ! -f "dist/_redirects" ]; then
  echo "/* /index.html 200" > dist/_redirects
  echo "✅ Creado archivo de redirecciones para SPA"
fi

echo "✅ Compilación completada. Proyecto listo para despliegue en Cloudflare Pages."