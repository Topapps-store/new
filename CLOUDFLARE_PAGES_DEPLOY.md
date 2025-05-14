# Despliegue en Cloudflare Pages

Este documento explica el proceso de despliegue de TopApps en Cloudflare Pages con D1 como base de datos.

## Requisitos Previos

1. Cuenta en Cloudflare
2. Base de datos D1 creada (ver [CLOUDFLARE_D1_SETUP.md](./CLOUDFLARE_D1_SETUP.md))
3. Node.js y npm instalados localmente

## Pasos para el Despliegue

### 1. Configuración en Cloudflare Dashboard

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona "Pages" en el menú lateral
3. Haz clic en "Create a project" y luego en "Connect to Git"
4. Selecciona el repositorio donde está tu proyecto TopApps
5. Configura los siguientes ajustes de despliegue:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/public`
   - **Root directory**: `/` (déjalo vacío)
   - **Environment variables**: Asegúrate de añadir las siguientes:
     - `NODE_VERSION`: `16` (o superior)
     - `DEEPL_API_KEY`: Tu clave API de DeepL

6. En la sección "Functions", asegúrate de que:
   - Está habilitado "Functions"
   - Está seleccionado "D1 database binding"
   - En "D1 database" selecciona la base de datos "topapps" que creaste anteriormente

7. Haz clic en "Save and Deploy"

### 2. Configuración Local (Opcional)

Para probar el despliegue localmente antes de enviar a Cloudflare:

1. Asegúrate de que tienes `wrangler` instalado globalmente:
   ```bash
   npm install -g wrangler
   ```

2. Accede con tu cuenta de Cloudflare:
   ```bash
   wrangler login
   ```

3. Prueba tu aplicación localmente:
   ```bash
   wrangler pages dev dist/public --binding DB=<database-id>
   ```

### 3. Solución de Problemas Comunes

#### Error: Permission denied en build.sh

Si encuentras un error como:
```
/bin/sh: 1: ./build.sh: Permission denied
```

Asegúrate de que el script de construcción es ejecutable:
```bash
chmod +x build-cloudflare.sh
```

Y verifica que el `wrangler.toml` apunta correctamente a este script:
```toml
[build]
command = "./build-cloudflare.sh"
```

#### Error: binding DB of type d1 must have an `id` specified

Este error indica que no has especificado correctamente el ID de tu base de datos D1 en `wrangler.toml`.

Asegúrate de que tanto la sección principal como la sección `[env.production]` tienen un ID de base de datos válido:

```toml
[[d1_databases]]
binding = "DB"
database_name = "topapps"
database_id = "TU_ID_DE_BASE_DE_DATOS" # Reemplaza con tu ID real

[env.production]
# ...

[[env.production.d1_databases]]
binding = "DB"
database_name = "topapps"
database_id = "TU_ID_DE_BASE_DE_DATOS" # El mismo ID
```

## Verificación del Despliegue

Una vez completado el despliegue, Cloudflare Pages te proporcionará una URL para tu aplicación (algo como `https://tu-proyecto.pages.dev`).

Visita esta URL y verifica que:
1. La página principal se carga correctamente
2. Las aplicaciones se muestran (si hay datos en la base de datos)
3. Las traducciones funcionan si estás usando un navegador en otro idioma