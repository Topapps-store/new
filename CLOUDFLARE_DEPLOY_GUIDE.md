# Guía de Despliegue en Cloudflare Pages

Esta guía te ayudará a desplegar TopApps en Cloudflare Pages utilizando GitHub.

## Requisitos Previos

1. Una cuenta en GitHub con el repositorio de TopApps
2. Una cuenta en Cloudflare
3. Una base de datos PostgreSQL en Neon (ya configurada)

## Paso 1: Preparar el Repositorio en GitHub

1. Crea un repositorio en GitHub (si aún no lo has hecho)
2. Conecta tu repositorio local a GitHub:

```bash
git init
git add .
git commit -m "Versión inicial de TopApps"
git branch -M main
git remote add origin https://github.com/tu-usuario/topapps.git
git push -u origin main
```

## Paso 2: Configurar el Proyecto en Cloudflare Pages

1. Inicia sesión en tu cuenta de Cloudflare
2. Ve a "Pages" en el panel lateral
3. Haz clic en "Create a project"
4. Selecciona "Connect to Git"
5. Elige tu repositorio de GitHub
6. Configura el proyecto:
   - Nombre del proyecto: `topapps`
   - Rama de producción: `main`
   - Framework preset: `None`
   - Build command: `./build.sh` 
   - Build output directory: `dist`
   - Root directory: `/` (dejar en blanco)

7. En la sección "Environment variables", agrega las siguientes variables:
   - `NODE_VERSION`: `20`
   - `DATABASE_URL`: Tu URL de conexión a Neon PostgreSQL
   - `SESSION_SECRET`: Una cadena segura para sesiones
   - `DEEPL_API_KEY`: Tu clave API de DeepL para traducciones

8. Haz clic en "Save and Deploy"

## Paso 3: Configurar el Dominio Personalizado

1. Una vez que el despliegue se haya completado, ve a la pestaña "Custom domains"
2. Haz clic en "Set up a custom domain"
3. Ingresa `topapps.store` y sigue las instrucciones para verificar la propiedad del dominio
4. Configura los registros DNS según las instrucciones

## Paso 4: Verificar el Despliegue

1. Una vez completado el despliegue, visita tu sitio en el dominio Cloudflare Pages asignado (o tu dominio personalizado)
2. Verifica que:
   - La aplicación carga correctamente
   - Las API funcionan (prueba cargar aplicaciones, categorías, etc.)
   - La base de datos está conectada (la aplicación muestra datos)

## Solución de Problemas

Si encuentras problemas con las funciones de Cloudflare:

1. Verifica los logs de despliegue en Cloudflare
2. Asegúrate de que tienes todas las variables de entorno configuradas
3. Verifica que la estructura de archivos en la carpeta `functions` es correcta:
   - `functions/api.js`
   - `functions/api/[[path]].js`
   - `functions/[[catchall]].js`
   - `functions/_middleware.js`
   - `functions/_routes.json`

## Mantenimiento

Para actualizaciones futuras:

1. Realiza tus cambios en el código
2. Haz commit y push a GitHub
3. Cloudflare Pages desplegará automáticamente las actualizaciones

## Notas Adicionales

- Las migraciones de base de datos se ejecutan automáticamente durante el despliegue gracias al script `build.sh`
- La aplicación está configurada para usar la base de datos Neon PostgreSQL
- Se ha configurado el archivo `_redirects` para manejar correctamente las rutas SPA
- La aplicación tiene configurado CORS para permitir solicitudes desde cualquier origen