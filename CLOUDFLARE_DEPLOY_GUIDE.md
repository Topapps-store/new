# Guía de Despliegue en Cloudflare Pages

Esta guía te ayudará a desplegar TopApps en Cloudflare Pages utilizando GitHub. Con la nueva estrategia, **el frontend se alojará en Cloudflare Pages pero la API seguirá funcionando desde Replit**.

## Estrategia de Despliegue

- **Frontend**: Alojado en Cloudflare Pages
- **API**: Alojada en Replit (https://topapps.replit.app/api)
- **Base de datos**: Neon PostgreSQL

Esta arquitectura tiene varias ventajas:
1. El frontend se beneficia de la red global CDN de Cloudflare
2. La API sigue usando la conexión estable a la base de datos en Replit
3. Separación clara de responsabilidades

## Requisitos Previos

1. Una cuenta en GitHub con el repositorio de TopApps
2. Una cuenta en Cloudflare
3. La instancia de Replit debe estar funcionando y accesible (https://topapps.replit.app)

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

7. En la sección "Environment variables", agrega la siguiente variable:
   - `NODE_VERSION`: `20`

8. Haz clic en "Save and Deploy"

## Paso 3: Configurar el Dominio Personalizado

1. Una vez que el despliegue se haya completado, ve a la pestaña "Custom domains"
2. Haz clic en "Set up a custom domain"
3. Ingresa `topapps.store` y sigue las instrucciones para verificar la propiedad del dominio
4. Configura los registros DNS según las instrucciones

## Paso 4: Verificar el Despliegue

1. Una vez completado el despliegue, visita tu sitio en el dominio Cloudflare Pages asignado (o tu dominio personalizado)
2. Verifica que:
   - El frontend carga correctamente
   - Las solicitudes a la API se redirigen correctamente a Replit
   - Los datos se muestran correctamente en la aplicación

## Cómo Funciona

1. Cuando un usuario visita tu sitio en Cloudflare Pages, se carga el frontend (React)
2. Cuando la aplicación hace solicitudes a `/api/...`, estas son interceptadas por la función `[[path]].js` en Cloudflare
3. La función reenvía estas solicitudes a la API alojada en Replit (https://topapps.replit.app/api/...)
4. Los datos se devuelven al frontend y se muestran al usuario

## Mantenimiento y Actualizaciones

### Actualizaciones del Frontend:

1. Realiza tus cambios en el código del frontend
2. Haz commit y push a GitHub
3. Cloudflare Pages desplegará automáticamente las actualizaciones

### Actualizaciones de la API:

1. Realiza tus cambios en el código de la API en Replit
2. La API se actualizará instantáneamente en Replit
3. No es necesario volver a desplegar Cloudflare Pages

## Notas Adicionales

- Esta arquitectura reduce la complejidad del despliegue en Cloudflare
- La instancia de Replit debe mantenerse en funcionamiento
- Si Replit cambia su URL, deberás actualizar la URL en `functions/[[path]].js`
- Se ha configurado CORS para permitir solicitudes entre dominios