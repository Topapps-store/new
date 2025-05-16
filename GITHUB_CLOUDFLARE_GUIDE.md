# Guía de despliegue en GitHub y Cloudflare Pages

Este documento contiene instrucciones detalladas para desplegar TopApps.store en GitHub y Cloudflare Pages, utilizando un enfoque "static-first" donde el frontend es completamente estático y la API sigue en Replit.

## Resumen de la arquitectura

- **Frontend**: Alojado en Cloudflare Pages (estático)
- **API**: Alojada en Replit (manteniendo la conexión a la base de datos)
- **Datos**: Archivos JSON para el frontend, PostgreSQL para la API

## Preparación del repositorio en GitHub

1. Crea un nuevo repositorio en GitHub
2. Clona el repositorio localmente
3. Copia todos los archivos de este proyecto al repositorio
4. Sube los cambios a GitHub:

```bash
git add .
git commit -m "Versión inicial para despliegue en Cloudflare Pages"
git push origin main
```

## Configuración en Cloudflare Pages

1. Accede a tu cuenta de Cloudflare
2. Navega a la sección "Pages"
3. Haz clic en "Create a project"
4. Conecta con GitHub y selecciona el repositorio
5. Configura el despliegue:
   - **Project name**: topapps-store
   - **Production branch**: main
   - **Build command**: `./build.sh`
   - **Build output directory**: `dist`
   - **Environment variables**:
     - NODE_VERSION: 20
     - DEEPL_API_KEY: Tu clave de API para traducciones

6. Haz clic en "Save and Deploy"

## Estructura de archivos importantes

- **functions/[[path]].js**: Maneja las solicitudes a la API y las redirige a Replit
- **functions/_middleware.js**: Configura CORS y otros middlewares
- **functions/_routes.json**: Define las rutas que deben ser manejadas por Cloudflare Functions
- **dist/_redirects**: Configura el enrutamiento del lado del cliente para SPA
- **dist/_headers**: Configura encabezados de seguridad HTTP

## Verificación del despliegue

Una vez completado el despliegue, deberías poder acceder a tu sitio a través de:
- `https://[project-name].pages.dev` (URL asignada por Cloudflare)

Prueba las siguientes funcionalidades:
1. Navegación entre páginas
2. Listado de aplicaciones
3. Detalle de aplicaciones con el botón verde de descarga
4. Búsqueda de aplicaciones
5. Cambio de idioma

## Configuración de dominio personalizado

1. En el dashboard de tu proyecto en Cloudflare Pages, navega a "Custom domains"
2. Haz clic en "Set up a custom domain"
3. Sigue las instrucciones para configurar `topapps.store` o el dominio que desees

## Actualización del sitio

Para actualizar el sitio, simplemente realiza cambios en tu repositorio y haz push a GitHub:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Cloudflare Pages automáticamente desplegará los cambios.

## Sincronización de datos

Para mantener actualizados los datos de las aplicaciones:

1. Ejecuta los scripts de sincronización en Replit
2. Las solicitudes a la API se redirigirán desde Cloudflare a Replit
3. El frontend obtendrá los datos actualizados a través de las redirecciones

## Solución de problemas

- **Problema con la redirección de API**: Verifica los archivos `functions/[[path]].js` y `functions/_middleware.js`
- **Problema con las rutas del frontend**: Verifica el archivo `dist/_redirects`
- **Problemas con CORS**: Asegúrate de que los encabezados CORS estén configurados correctamente en `functions/_middleware.js`

## Notas adicionales

- Esta configuración mantiene la API en Replit, lo que permite seguir utilizando la base de datos PostgreSQL
- El frontend es completamente estático, lo que mejora el rendimiento y la escalabilidad
- Las actualizaciones de datos se reflejan en tiempo real gracias a la redirección de la API