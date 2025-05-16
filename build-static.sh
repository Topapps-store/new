#!/bin/bash

# Script para construir la versión estática de la aplicación TopApps
echo "Iniciando construcción de la versión estática..."

# Asegurarse de que la carpeta dist existe y está vacía
rm -rf dist
mkdir -p dist

# Construir la aplicación usando la configuración de Cloudflare
echo "Ejecutando construcción con Vite..."
npx vite build --config vite.cloudflare.config.ts

# Copiar el archivo _redirects para manejar rutas en Cloudflare Pages
echo "/* /index.html 200" > dist/_redirects

# Verificar si la construcción fue exitosa
if [ $? -eq 0 ]; then
  echo "✅ ¡Construcción completada con éxito!"
  echo "Los archivos estáticos están disponibles en la carpeta 'dist'."
  echo "Puedes desplegar esta carpeta en Cloudflare Pages u otro servicio de hosting estático."
else
  echo "❌ Error durante la construcción. Por favor revisa los mensajes de error."
  exit 1
fi