# Ejemplo de URLs con detección automática de idioma

El sistema ahora detecta automáticamente el parámetro `&hl=` en las URLs y crea aplicaciones separadas para cada idioma.

## Ejemplo de uso:

### URLs que se pueden añadir a pending-apps.json:

```json
{
  "pendingUrls": [
    "https://play.google.com/store/apps/details?id=com.ubercab&hl=en",
    "https://play.google.com/store/apps/details?id=com.ubercab&hl=fr",
    "https://play.google.com/store/apps/details?id=com.ubercab&hl=es",
    "https://play.google.com/store/apps/details?id=com.ubercab&hl=de",
    "https://apps.apple.com/us/app/uber/id368677368",
    "https://apps.apple.com/fr/app/uber/id368677368",
    "https://apps.apple.com/es/app/uber/id368677368"
  ],
  "processedUrls": []
}
```

### Resultado automático:

El sistema creará automáticamente estas aplicaciones:
- `uber` (inglés por defecto)
- `uber-fr` (francés)
- `uber-es` (español)
- `uber-de` (alemán)

### Características del sistema:

1. **Detección automática**: El sistema detecta automáticamente el parámetro `&hl=` en URLs de Google Play y los códigos de idioma en URLs de App Store
2. **IDs únicos**: Cada idioma genera un ID único (ej: "uber-fr", "uber-es")
3. **Sin conflictos**: Las aplicaciones con diferentes idiomas se tratan como aplicaciones distintas
4. **Contenido auténtico**: Cada aplicación obtiene el contenido en su idioma original desde la tienda

### Beneficios:

- No necesitas crear manualmente páginas para cada idioma
- El sistema evita duplicados basándose en el ID único por idioma
- Contenido auténtico en cada idioma desde las tiendas oficiales
- Optimización automática para SEO por idioma