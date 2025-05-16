#!/bin/bash

# Script para automatizar la sincronización de aplicaciones
# Este script procesa nuevas aplicaciones desde pending-apps.json
# y actualiza la información de las aplicaciones existentes

echo "🚀 Iniciando sincronización de aplicaciones..."

# Instalación de dependencias (si no están instaladas)
if ! npm list google-play-scraper >/dev/null 2>&1; then
  echo "📦 Instalando dependencias necesarias..."
  npm install google-play-scraper
fi

# Procesar nuevas aplicaciones
echo "🔍 Procesando nuevas aplicaciones..."
node scripts/process-pending-apps.js

# Sincronizar aplicaciones existentes
echo "🔄 Sincronizando aplicaciones existentes..."
node scripts/sync-existing-apps.js

echo "✅ Sincronización completada."