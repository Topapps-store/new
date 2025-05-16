# Guía de Despliegue en Cloudflare Pages

Esta guía proporciona instrucciones paso a paso para desplegar TopApps en Cloudflare Pages, utilizando un enfoque estático sin base de datos.

## Requisitos Previos

1. Cuenta en Cloudflare (gratuita)
2. Repositorio del proyecto en GitHub
3. Node.js instalado en tu máquina local

## Paso 1: Preparar el proyecto para el despliegue

1. Asegúrate de que el proyecto utiliza la versión estática (sin base de datos)
2. Actualiza los archivos JSON (apps.json, categories.json) con los datos más recientes:
   ```bash
   # Primero, instala las dependencias si no lo has hecho
   npm install
   
   # Ejecuta el script de sincronización
   bash sync-apps.sh
   ```

## Paso 2: Compilación local (opcional pero recomendado)

Es buena práctica verificar que la compilación funciona correctamente antes de configurar el despliegue:

```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build
```

Esto generará una carpeta `dist` con los archivos estáticos listos para ser desplegados.

## Paso 3: Configurar el despliegue en Cloudflare Pages

1. Inicia sesión en el [Dashboard de Cloudflare](https://dash.cloudflare.com/)
2. Ve a "Pages" en el menú lateral
3. Haz clic en "Crear un proyecto"
4. Selecciona "Conectar a Git"
5. Autoriza a Cloudflare para acceder a tu repositorio en GitHub
6. Selecciona el repositorio que contiene tu proyecto

## Paso 4: Configurar las opciones de compilación

Configura las siguientes opciones de compilación:

- **Nombre del proyecto**: topapps (o el nombre que prefieras)
- **Framework preestablecido**: None
- **Comando de compilación**: `npm run build`
- **Directorio de salida**: `dist`
- **Variables de entorno**: 
  - `IS_STATIC`: `true`
  - `NODE_VERSION`: `16` (o la versión que uses)

## Paso 5: Iniciar el despliegue

1. Haz clic en "Guardar y desplegar"
2. Espera a que Cloudflare complete el proceso de compilación y despliegue

## Paso 6: Configurar dominio personalizado (opcional)

Si deseas usar un dominio personalizado:

1. En el panel de control de tu proyecto en Cloudflare Pages, haz clic en "Configuración personalizada de dominio"
2. Sigue las instrucciones para agregar tu dominio personalizado

## Solución de problemas comunes

### Error 404 en rutas distintas a la página principal

Si recibes errores 404 al acceder directamente a rutas como `/app/whatsapp`, asegúrate de que:

1. Los archivos en `functions/_middleware.js` y `functions/[[path]].js` estén correctamente configurados
2. La configuración de redirecciones en `_redirects` sea adecuada

### Problemas con la API

Si experimentas problemas con las llamadas a la API:

1. Verifica que los archivos JSON en `client/src/data` contengan datos válidos
2. Asegúrate de que el servicio de datos estático esté correctamente implementado

## Actualización de Datos

Para actualizar los datos de las aplicaciones:

1. Añade URLs de Google Play Store al archivo `client/src/data/pending-apps.json`
2. Ejecuta `bash sync-apps.sh` para procesar las nuevas apps y actualizar las existentes
3. Haz commit de los cambios y envíalos al repositorio
4. Cloudflare Pages se actualizará automáticamente con los nuevos datos

## Recursos Adicionales

- [Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Guía de Functions de Cloudflare Pages](https://developers.cloudflare.com/pages/platform/functions/)