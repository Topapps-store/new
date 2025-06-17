# Guía Completa: Conectar Google Ads con Replit

Esta guía te explica cómo conectar Google Ads con tu aplicación Replit para crear campañas automatizadas y optimizadas que generen descargas de apps con Quality Score 10/10.

## 🚀 Resumen de la Integración

La integración de Google Ads con Replit te permite:
- **Crear campañas automáticamente** desde el dashboard de administración
- **Generar palabras clave optimizadas** según el idioma y región
- **Configurar seguimiento de conversiones** para medir descargas
- **Monitorear performance** en tiempo real
- **Optimizar bidding automáticamente** basado en resultados

## 📋 Requisitos Previos

### 1. Cuenta de Google Ads
- Cuenta activa de Google Ads con método de pago configurado
- Acceso a la configuración de API de Google Ads
- Permisos de administrador en la cuenta

### 2. Credenciales de API de Google Ads
Necesitas obtener estas 5 credenciales:

#### A. Developer Token
1. Ve a [Google Ads API Center](https://ads.google.com/home/tools/manager-accounts/)
2. Haz clic en "API Center" en el menú
3. Solicita acceso al Developer Token
4. Guarda el token (formato: `XXXXXXXX-XXXXXXXX-XXXXXXXX`)

#### B. Client ID y Client Secret
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "Google Ads API"
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
5. Configura como "Aplicación web"
6. Guarda Client ID y Client Secret

#### C. Refresh Token
1. Usa [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. En "Step 1", selecciona "Google Ads API v15"
3. Haz clic en "Authorize APIs"
4. En "Step 2", haz clic en "Exchange authorization code for tokens"
5. Copia el `refresh_token`

#### D. Customer ID
1. Ve a tu cuenta de Google Ads
2. En la esquina superior derecha, verás un número de 10 dígitos
3. Cópialo sin guiones (formato: `1234567890`)

## ⚙️ Configuración en Replit

### 1. Configurar Variables de Entorno

En tu proyecto Replit, ve a la pestaña "Secrets" y agrega:

```
GOOGLE_ADS_CLIENT_ID=tu_client_id_aqui
GOOGLE_ADS_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_ADS_REFRESH_TOKEN=tu_refresh_token_aqui
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_DEVELOPER_TOKEN=tu_developer_token_aqui
```

### 2. Variables Adicionales (Opcionales)

Para seguimiento de conversiones avanzado:

```
VITE_GOOGLE_ADS_CONVERSION_ID=AW-1234567890
VITE_GOOGLE_ADS_APP_DOWNLOAD_CONVERSION_ID=app_download
BASE_URL=https://tu-replit-url.replit.app
```

## 🎯 Usar el Google Ads Manager

### 1. Acceder al Dashboard

1. Inicia sesión como administrador en `/admin/login`
2. Ve a `/admin/google-ads` para acceder al Google Ads Manager
3. Verifica que el estado muestre "Configurado" en verde

### 2. Crear Campaña para una App

#### Configuración Automática:
- **Palabras clave**: Generadas automáticamente según idioma
- **Anuncios**: Titulares y descripciones optimizados
- **Target CPA**: €15 (optimizado para descargas)
- **Landing Page**: URL específica de la app
- **Quality Score**: Configurado para obtener 10/10

#### Pasos:
1. Selecciona la aplicación del dropdown
2. Configura presupuesto diario (mínimo €50 recomendado)
3. Elige idioma objetivo (español, inglés, francés)
4. Selecciona país objetivo
5. Haz clic en "Crear Campaña Optimizada"

### 3. Configurar Seguimiento de Conversiones

1. Ve a la pestaña "Conversiones"
2. Selecciona la misma aplicación
3. Haz clic en "Configurar Seguimiento de Conversiones"
4. El sistema creará automáticamente:
   - Acción de conversión en Google Ads
   - Seguimiento de clics en botones de descarga
   - Métricas de performance en tiempo real

### 4. Monitorear Performance

1. Ve a la pestaña "Performance"
2. Ingresa el ID de campaña (se proporciona al crear la campaña)
3. Selecciona rango de fechas
4. Visualiza métricas clave:
   - Impresiones y clics
   - CTR (Click Through Rate)
   - Costo total y CPC promedio
   - Conversiones y tasa de conversión

## 📊 Ejemplos de Campañas Optimizadas

### Campaña para Bolt (Francés)
```
Nombre: Bolt - Descarga App FR
Presupuesto: €100/día
Target CPA: €15
Idioma: Francés
País: Francia

Palabras clave generadas:
- télécharger bolt app
- bolt app paris
- installer bolt
- bolt taxi
- application bolt
- bolt transport
- commander bolt
- réserver bolt

Landing Page: https://topapps.store/app/bolt-request-a-ride
```

### Campaña para WhatsApp (Español)
```
Nombre: WhatsApp - Descarga App ES
Presupuesto: €75/día
Target CPA: €15
Idioma: Español
País: España

Palabras clave generadas:
- descargar whatsapp
- whatsapp app
- instalar whatsapp
- whatsapp gratis
- aplicación whatsapp
- whatsapp oficial
- bajar whatsapp

Landing Page: https://topapps.store/app/whatsapp-messenger
```

## 🔧 API Endpoints Disponibles

### Verificar Estado
```
GET /api/google-ads/status
```

### Crear Campaña
```
POST /api/google-ads/campaigns/app-download
{
  "appId": "bolt-request-a-ride",
  "appName": "Bolt",
  "budget": 100,
  "targetLanguage": "fr",
  "targetCountry": "FR"
}
```

### Crear Conversión
```
POST /api/google-ads/conversions
{
  "name": "Descarga Bolt",
  "value": 5.0,
  "currency": "EUR",
  "category": "DOWNLOAD"
}
```

### Obtener Performance
```
GET /api/google-ads/campaigns/{campaignId}/performance?startDate=2024-01-01&endDate=2024-01-31
```

### Optimizar Bidding
```
PUT /api/google-ads/campaigns/{campaignId}/optimize
{
  "targetCpa": 12.0
}
```

## 🎨 Seguimiento de Conversiones en Frontend

El sistema incluye componentes React para rastrear automáticamente las conversiones:

### Implementación Automática
```jsx
import { GoogleAdsConversionTracker, TrackedDownloadButton } from '@/components/GoogleAdsConversionTracker';

// En tu componente App
<GoogleAdsConversionTracker />

// Para botones de descarga
<TrackedDownloadButton
  appId="bolt-request-a-ride"
  appName="Bolt"
  source="google_play"
  url="https://play.google.com/store/apps/details?id=ee.mtakso.client&hl=fr"
  className="download-button"
>
  Descargar en Google Play
</TrackedDownloadButton>
```

## 📈 Optimización para Quality Score 10/10

### Factores Clave Implementados:

1. **Relevancia de Anuncios**:
   - Titulares con palabras clave exactas
   - Descripciones que coinciden con la búsqueda
   - URLs de destino específicas por app

2. **Experiencia de Landing Page**:
   - Páginas optimizadas con SEO completo
   - Contenido en idioma nativo auténtico
   - Botones de descarga prominentes
   - Tiempo de carga rápido

3. **CTR Esperado**:
   - Palabras clave de alta intención
   - Anuncios responsivos de búsqueda
   - Extensiones de anuncios automáticas

4. **Configuración Técnica**:
   - Target CPA optimizado
   - Segmentación geográfica precisa
   - Horarios de publicación optimizados
   - Seguimiento de conversiones configurado

## 🚨 Solución de Problemas

### Error: "Google Ads client not initialized"
- Verifica que todas las 5 variables de entorno estén configuradas
- Asegúrate que el Developer Token esté aprobado
- Confirma que el Customer ID sea correcto

### Error: "Invalid refresh token"
- Regenera el refresh token usando OAuth 2.0 Playground
- Verifica que los scopes incluyan Google Ads API

### Campaña no aparece en Google Ads
- Espera 5-10 minutos para la sincronización
- Verifica que el presupuesto sea suficiente (mínimo €50/día)
- Confirma que la cuenta de Google Ads esté activa

### Conversiones no se registran
- Verifica que `VITE_GOOGLE_ADS_CONVERSION_ID` esté configurado
- Asegúrate que los botones usen `TrackedDownloadButton`
- Confirma que la acción de conversión esté creada en Google Ads

## 💡 Mejores Prácticas

### 1. Presupuestos Recomendados
- **Apps populares**: €100-200/día
- **Apps nicho**: €50-100/día
- **Pruebas iniciales**: €30-50/día

### 2. Optimización Continua
- Revisa performance semanalmente
- Ajusta Target CPA según resultados
- Pausa palabras clave con bajo rendimiento
- Expande campañas exitosas a más idiomas

### 3. Segmentación Efectiva
- Usa un idioma por campaña
- Segmenta por país para mejor control
- Considera horarios locales para cada región

### 4. Testing A/B
- Prueba diferentes titulares
- Experimenta con distintos Target CPA
- Compara performance entre idiomas
- Optimiza páginas de destino basado en datos

## 📞 Soporte

Para problemas técnicos:
1. Verifica la documentación de [Google Ads API](https://developers.google.com/google-ads/api/docs)
2. Consulta logs en la consola de Replit
3. Usa el endpoint `/api/google-ads/status` para diagnosticar

¡Tu integración de Google Ads con Replit está lista para generar descargas optimizadas!