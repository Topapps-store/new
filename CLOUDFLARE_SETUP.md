# Configuración de Cloudflare Pages + API en Replit

Este documento explica el proceso completo para desplegar TopApps en Cloudflare Pages mientras mantienes la API funcionando en Replit.

## 1. Preparación del Repositorio

Hemos creado los siguientes archivos para facilitar el despliegue:

- `_redirects`: Define las reglas de redirección para Cloudflare Pages
- `_headers`: Define los headers HTTP para habilitar CORS
- `cloudflare-build.sh`: Script de construcción para Cloudflare Pages
- `functions/[[path]].js`: Maneja las solicitudes a la API y las redirige a Replit
- `functions/_middleware.js`: Middleware para manejar CORS y preflight OPTIONS

## 2. Flujo de Trabajo para el Despliegue

### A. Repositorio de Git

1. Crea un repositorio en GitHub o GitLab
2. Sube tu código incluyendo todos los archivos de configuración

### B. Configuración en Cloudflare Pages

1. Accede a tu dashboard de Cloudflare
2. Ve a "Pages" y haz clic en "Create a project"
3. Selecciona "Connect to Git"
4. Elige tu repositorio y configura:
   - **Framework preset**: None
   - **Build command**: `./cloudflare-build.sh`
   - **Build output directory**: `dist/public`
   - **Root directory**: `/` (o la raíz de tu repositorio)
   - **Environment variables**:
     - `NODE_VERSION`: `16` (o la versión que uses)

5. Haz clic en "Save and Deploy"

## 3. Cómo Funciona

El sistema funciona en dos niveles:

### Nivel 1: Redirección Estática (Para el frontend)

El archivo `_redirects` proporciona redirecciones estáticas:
```
/api/*  https://topapps.replit.app/api/:splat  200
/*      /index.html                            200
```

Esto redirige todas las solicitudes API a Replit y envía todas las demás solicitudes al frontend.

### Nivel 2: Función Serverless (Para mejorar la API)

Si las redirecciones estáticas no son suficientes, usamos Cloudflare Functions:

- `functions/[[path]].js`: Captura las solicitudes a `/api/*` y las reenvía a Replit
- `functions/_middleware.js`: Garantiza que las respuestas tengan los headers CORS correctos

## 4. Verificación y Solución de Problemas

### Verificar Redirecciones

Puedes verificar si las redirecciones funcionan visitando estas URLs:
- `https://tu-proyecto.pages.dev/api/apps/popular`
- `https://tu-proyecto.pages.dev/api/categories`

Deberías ver los mismos datos JSON que en tu API de Replit.

### Problemas Comunes y Soluciones

#### CORS

Si tienes errores de CORS:

1. Verifica que los archivos `_headers` y `functions/_middleware.js` estén correctamente configurados
2. Añade una regla Transform en el dashboard de Cloudflare:
   - Nombre: "CORS Headers"
   - Cuando: "URL Path" contiene "api"
   - Acción: Add response headers
     - Access-Control-Allow-Origin: *
     - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
     - Access-Control-Allow-Headers: Content-Type, Authorization

#### API no responde

Si la API no responde:

1. Verifica que tu aplicación en Replit esté funcionando
2. Revisa los logs de Cloudflare Pages para buscar errores
3. Intenta acceder directamente a tu API de Replit: `https://topapps.replit.app/api/apps/popular`

## 5. Próximos Pasos

Este enfoque es una solución intermedia hasta que migres completamente a Cloudflare Pages + Workers. Para una solución definitiva, considera:

1. Migrar la API a Cloudflare Workers
2. Configurar Cloudflare D1 para la base de datos
3. Unificar todo en un solo despliegue de Cloudflare

Con estos pasos, tendrás una arquitectura más sólida y sin dependencias de Replit.

## 6. Comandos Útiles

Aquí hay algunos comandos útiles para depurar y mantener el despliegue:

```bash
# Probar la redirección de API localmente
curl -H "Origin: http://localhost:5000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS --verbose \
  https://tu-proyecto.pages.dev/api/apps/popular

# Verificar los headers de respuesta de la API
curl -I https://tu-proyecto.pages.dev/api/apps/popular
```

---

Con esta configuración, tu aplicación TopApps estará desplegada en Cloudflare Pages mientras mantiene la funcionalidad de la API alojada en Replit.