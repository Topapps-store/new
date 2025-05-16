#!/bin/bash

echo "Procesando aplicaciones pendientes de Google Play..."
node scripts/process-pending-apps.js

echo ""
echo "Proceso completo. Para añadir más aplicaciones:"
echo "1. Edita el archivo client/src/data/pending-apps.json"
echo "2. Añade las nuevas URLs de Google Play en el array 'pendingUrls'"
echo "3. Ejecuta este script nuevamente"