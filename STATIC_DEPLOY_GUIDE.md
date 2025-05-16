# Guía de Despliegue de TopApps.store (Versión Estática)

Esta guía explica cómo desplegar la versión estática de TopApps.store en Cloudflare Pages u otro servicio de hosting estático.

## Preparación

La aplicación ha sido convertida a una versión completamente estática que no requiere una base de datos. Todos los datos de aplicaciones y categorías se encuentran en archivos JSON dentro del código fuente.

## Pasos para el Despliegue

### 1. Construir la Aplicación Estática

Para construir la versión estática, ejecuta el siguiente comando:

```bash
./build-static.sh
```

Este script realizará las siguientes acciones:
- Limpiar la carpeta `dist`
- Construir la aplicación usando la configuración específica para Cloudflare
- Crear un archivo `_redirects` para el manejo correcto de rutas

### 2. Desplegar en Cloudflare Pages

#### Opción 1: Despliegue Manual

1. Inicia sesión en [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Ve a la sección "Pages"
3. Haz clic en "Create a project" y selecciona "Direct Upload"
4. Arrastra y suelta la carpeta `dist` generada o selecciónala desde tu computadora
5. Haz clic en "Deploy site"

#### Opción 2: Despliegue desde GitHub

1. Sube tu código a un repositorio GitHub
2. Inicia sesión en [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Ve a la sección "Pages"
4. Haz clic en "Create a project" y selecciona "Connect to Git"
5. Selecciona tu repositorio
6. En la configuración de build, usa la siguiente configuración:
   - Framework preset: None
   - Build command: `./build-static.sh`
   - Build output directory: `dist`
7. Haz clic en "Save and Deploy"

### 3. Configurar Dominio Personalizado (Opcional)

1. Una vez desplegado, ve a la sección "Custom domains" de tu proyecto en Cloudflare Pages
2. Haz clic en "Set up a custom domain"
3. Sigue las instrucciones para configurar tu dominio personalizado

## Actualizaciones Posteriores

Para actualizar la información de aplicaciones mostrada en el sitio:

1. Modifica los archivos en `client/src/data/apps.ts` y `client/src/data/categories.ts`
2. Vuelve a construir la aplicación con `./build-static.sh`
3. Despliega la nueva versión

## Ventajas de la Versión Estática

- **Rendimiento mejorado**: Al ser completamente estática, la aplicación carga más rápido
- **Costos reducidos**: No requiere un servidor de base de datos
- **Mayor fiabilidad**: Menos puntos de fallo potenciales
- **Despliegue simplificado**: Fácil de desplegar en cualquier servicio de hosting estático
- **Seguridad mejorada**: No hay conexiones de base de datos que puedan ser comprometidas

## Limitaciones

- Las funciones de administración no están disponibles en la versión estática
- Para actualizar los datos de las aplicaciones, es necesario modificar los archivos de código fuente y volver a desplegar