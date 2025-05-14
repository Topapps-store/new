# Inicialización de la Base de Datos D1 en Cloudflare

Una vez que hayas desplegado la aplicación en Cloudflare Pages, necesitarás inicializar la base de datos D1 con datos de prueba.

**URL de la aplicación desplegada**: https://fdb21035.topapps-store.pages.dev/

## Requisitos previos

1. Tener `wrangler` instalado:
   ```bash
   npm install -g wrangler
   ```

2. Haber iniciado sesión en Cloudflare:
   ```bash
   wrangler login
   ```

3. Tener el archivo `schema.sql` con las definiciones de tablas y datos de prueba

## Pasos para inicializar la base de datos D1

### 1. Ejecutar el script SQL en la base de datos D1

```bash
# Reemplaza 8252c0e2-972e-4994-b168-d9b8f9d6fddd con tu ID de base de datos D1
wrangler d1 execute topapps --file=./schema.sql
```

Este comando ejecutará el archivo `schema.sql` en tu base de datos D1, creando las tablas necesarias e insertando datos de prueba.

### 2. Verificar que los datos se han insertado correctamente

Puedes verificar que los datos se han insertado correctamente ejecutando consultas SQL:

```bash
# Ver todas las aplicaciones
wrangler d1 execute topapps --command="SELECT * FROM apps"

# Ver todas las categorías
wrangler d1 execute topapps --command="SELECT * FROM categories"

# Ver todos los usuarios
wrangler d1 execute topapps --command="SELECT id, username, is_admin FROM users"
```

### 3. Solución de problemas comunes

#### Error: Could not find D1 database "topapps" in your account

Asegúrate de que has creado la base de datos con el nombre correcto:

```bash
wrangler d1 create topapps
```

Y luego actualiza el ID en el comando para ejecutar el script SQL.

#### Error: SQL error: syntax error

Verifica el archivo SQL para asegurarte de que no hay errores de sintaxis. SQLite tiene algunas peculiaridades en su sintaxis SQL.

#### Error: database or disk is full

Este error puede ocurrir si intentas insertar demasiados datos a la vez. Intenta dividir el script SQL en partes más pequeñas.

## Uso local (para desarrollo)

Para desarrollo local, ya hemos configurado un almacenamiento en memoria que incluye datos de prueba. La base de datos D1 sólo es necesaria para el entorno de producción en Cloudflare Pages.