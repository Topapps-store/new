# Configuración de Cloudflare D1 para TopApps

Este documento detalla cómo configurar la base de datos D1 de Cloudflare para el proyecto TopApps.

## Creación de la base de datos D1

1. Asegúrate de tener `wrangler` instalado globalmente:
   ```bash
   npm install -g wrangler
   ```

2. Accede con tu cuenta de Cloudflare:
   ```bash
   wrangler login
   ```

3. Crea una nueva base de datos D1:
   ```bash
   wrangler d1 create topapps
   ```

   Después de crear la base de datos, Wrangler mostrará un mensaje similar a este:
   ```
   ✅ Successfully created DB 'topapps'
   Created D1 database 'topapps' (5d1ce3d2-8fb2-45e5-ad39-98d5efbc9e00)
   ```

   Copia el ID (en este ejemplo: `5d1ce3d2-8fb2-45e5-ad39-98d5efbc9e00`).

4. Actualiza el archivo `wrangler.toml` con el ID de la base de datos:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "topapps"
   database_id = "5d1ce3d2-8fb2-45e5-ad39-98d5efbc9e00" # Reemplaza con tu ID
   ```

   También asegúrate de actualizar la configuración de producción:
   ```toml
   [env.production]
   workers_dev = false

   [[env.production.d1_databases]]
   binding = "DB"
   database_name = "topapps"
   database_id = "5d1ce3d2-8fb2-45e5-ad39-98d5efbc9e00" # El mismo ID
   ```

## Configuración del esquema de la base de datos

1. Para crear las tablas necesarias, puedes usar el siguiente comando:
   ```bash
   wrangler d1 execute topapps --file=./schema.sql
   ```

   Donde `schema.sql` es un archivo que contiene las instrucciones SQL para crear las tablas.

## Migración de datos (si es necesario)

Si necesitas migrar datos desde otra base de datos, puedes crear un script personalizado o usar el siguiente enfoque:

1. Exporta tus datos en formato JSON o CSV
2. Crea un script para insertar estos datos en D1
3. Ejecuta el script usando Wrangler:
   ```bash
   wrangler d1 execute topapps --file=./migrate-data.sql
   ```

## Despliegue

Cuando despliegues tu aplicación, asegúrate de que:

1. Tu `wrangler.toml` tiene la configuración correcta de D1
2. El ID de la base de datos está correctamente configurado
3. Estás usando la misma cuenta de Cloudflare para el despliegue y la base de datos

Para desplegar la aplicación:
```bash
wrangler deploy
```

## Acceso a la base de datos desde Cloudflare Workers

En tu código de Worker, puedes acceder a la base de datos D1 a través del binding:

```javascript
export default {
  async fetch(request, env, ctx) {
    // env.DB es tu base de datos D1
    const result = await env.DB.prepare("SELECT * FROM apps LIMIT 10").all();
    return new Response(JSON.stringify(result));
  }
}
```