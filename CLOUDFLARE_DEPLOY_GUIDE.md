# Guía de Despliegue en Cloudflare Pages

Esta guía explica cómo desplegar correctamente la aplicación TopApps en Cloudflare Pages mientras se mantiene la API funcionando en Replit.

## Problema actual

Actualmente, la aplicación desplegada en Cloudflare Pages no muestra las aplicaciones porque:
1. El frontend se despliega correctamente en Cloudflare
2. Pero las solicitudes API no se redirigen a la instancia de Replit donde está la API

## Solución: Configurar Headers y Redirects en Cloudflare Pages

### Paso 1: Crea los archivos de configuración necesarios

En la raíz de tu proyecto, crea los siguientes archivos:

#### Archivo `_headers` (para CORS)
```
/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
```

#### Archivo `_redirects` (para redireccionar la API)
```
/api/*  https://topapps.replit.app/api/:splat  200
/*      /index.html                            200
```

### Paso 2: Actualiza el script de construcción

Modifica `cloudflare-build.sh` para asegurarte de que estos archivos se copian al directorio de salida:

```bash
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
```

### Paso 3: Configuración en el Dashboard de Cloudflare Pages

1. Accede a tu dashboard de Cloudflare Pages
2. Selecciona tu proyecto TopApps
3. Ve a "Settings" > "Build & deploy"
4. Verifica que las siguientes configuraciones estén correctas:
   - Build command: `./cloudflare-build.sh`
   - Build output directory: `dist/public`
   - Root directory: `/` (o la raíz de tu repositorio)

5. **Importante:** En la sección "Environment variables", asegúrate de agregar:
   - Variable: `NODE_VERSION`
   - Value: `16` (o la versión que uses)

### Paso 4: Solución de problemas de CORS

Si después de implementar los pasos anteriores sigues teniendo problemas con CORS, puedes intentar:

1. Ir a tu dashboard de Cloudflare
2. Navegar a "Rules" > "Transform Rules"
3. Crear una nueva regla para agregar los headers CORS manualmente:
   - Nombre: "CORS Headers"
   - Campo: "Request URL"
   - Operador: "contains"
   - Valor: "api"
   - Acción: Add response headers
     - Agregar:
       - Access-Control-Allow-Origin: *
       - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
       - Access-Control-Allow-Headers: Content-Type, Authorization

## Mantenimiento

Una vez desplegado, cualquier cambio en el frontend requerirá un nuevo despliegue en Cloudflare Pages, pero los cambios en la API solo necesitarán ser actualizados en Replit.

Recuerda que este enfoque es temporal hasta que puedas migrar toda la aplicación (incluyendo la API) a Cloudflare completamente.