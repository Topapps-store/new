#!/bin/bash

echo "=== TopApps.store - Sincronizador automático de aplicaciones ==="
echo ""

# Paso 1: Procesar nuevas aplicaciones desde enlaces pendientes
echo "Paso 1: Procesando nuevas aplicaciones desde enlaces pendientes..."
node scripts/process-pending-apps.js

echo ""
echo "Paso 2: Actualizando aplicaciones existentes con datos nuevos de Google Play..."
node scripts/sync-existing-apps.js

echo ""
echo "=== Sincronización Completa ==="
echo "Para añadir más aplicaciones:"
echo "1. Edita el archivo client/src/data/pending-apps.json"
echo "2. Añade nuevas URLs de Google Play en el array 'pendingUrls'"
echo "3. Ejecuta este script nuevamente"