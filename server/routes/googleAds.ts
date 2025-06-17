import { Router } from 'express';
import { googleAdsService, CampaignData, ConversionAction } from '../services/googleAdsService.js';

const router = Router();

// Verificar configuración de Google Ads
router.get('/status', (req, res) => {
  try {
    const isConfigured = googleAdsService.isConfigured();
    res.json({
      configured: isConfigured,
      message: isConfigured 
        ? 'Google Ads API está configurada correctamente' 
        : 'Faltan credenciales de Google Ads. Configura las variables de entorno.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error verificando configuración de Google Ads' });
  }
});

// Crear campaña de búsqueda optimizada
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData: CampaignData = req.body;
    
    // Validar datos de entrada
    if (!campaignData.name || !campaignData.budget || !campaignData.keywords || !campaignData.landingPageUrl) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: name, budget, keywords, landingPageUrl' 
      });
    }

    const campaignResourceName = await googleAdsService.createSearchCampaign(campaignData);
    
    if (campaignResourceName) {
      res.json({
        success: true,
        campaignId: campaignResourceName,
        message: 'Campaña creada exitosamente'
      });
    } else {
      res.status(500).json({ error: 'Error creando campaña' });
    }
  } catch (error: any) {
    console.error('Error en /campaigns:', error);
    res.status(500).json({ 
      error: 'Error creando campaña de Google Ads',
      details: error.message 
    });
  }
});

// Crear campaña específica para apps (template optimizado)
router.post('/campaigns/app-download', async (req, res) => {
  try {
    const { appId, appName, budget, targetLanguage = 'es', targetCountry = 'ES' } = req.body;
    
    if (!appId || !appName || !budget) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: appId, appName, budget' 
      });
    }

    // Generar palabras clave optimizadas según el idioma
    const keywords = generateAppKeywords(appName, targetLanguage);
    
    // Crear titulares y descripciones optimizados
    const headlines = generateHeadlines(appName, targetLanguage);
    const descriptions = generateDescriptions(appName, targetLanguage);
    
    const campaignData: CampaignData = {
      name: `${appName} - Descarga App ${targetCountry}`,
      budget: budget,
      targetCpa: 15, // CPA objetivo optimizado para descargas
      keywords: keywords,
      landingPageUrl: `${process.env.BASE_URL || 'https://topapps.store'}/app/${appId}`,
      adGroups: [
        {
          name: `${appName} - Grupo Principal`,
          keywords: keywords.slice(0, 10), // Primeras 10 keywords más relevantes
          ads: [
            {
              headlines: headlines,
              descriptions: descriptions,
              finalUrl: `${process.env.BASE_URL || 'https://topapps.store'}/app/${appId}`
            }
          ]
        }
      ]
    };

    const campaignResourceName = await googleAdsService.createSearchCampaign(campaignData);
    
    if (campaignResourceName) {
      res.json({
        success: true,
        campaignId: campaignResourceName,
        message: `Campaña creada para ${appName}`,
        keywords: keywords,
        landingPage: campaignData.landingPageUrl
      });
    } else {
      res.status(500).json({ error: 'Error creando campaña para app' });
    }
  } catch (error: any) {
    console.error('Error en /campaigns/app-download:', error);
    res.status(500).json({ 
      error: 'Error creando campaña para app',
      details: error.message 
    });
  }
});

// Crear acción de conversión para descargas
router.post('/conversions', async (req, res) => {
  try {
    const conversionData: ConversionAction = req.body;
    
    if (!conversionData.name || !conversionData.value) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: name, value' 
      });
    }

    // Valores por defecto optimizados
    const optimizedConversion: ConversionAction = {
      ...conversionData,
      category: conversionData.category || 'DOWNLOAD',
      currency: conversionData.currency || 'EUR'
    };

    const conversionResourceName = await googleAdsService.createConversionAction(optimizedConversion);
    
    if (conversionResourceName) {
      res.json({
        success: true,
        conversionId: conversionResourceName,
        message: 'Acción de conversión creada exitosamente'
      });
    } else {
      res.status(500).json({ error: 'Error creando acción de conversión' });
    }
  } catch (error: any) {
    console.error('Error en /conversions:', error);
    res.status(500).json({ 
      error: 'Error creando acción de conversión',
      details: error.message 
    });
  }
});

// Obtener performance de campaña
router.get('/campaigns/:campaignId/performance', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Parámetros requeridos: startDate, endDate (formato YYYY-MM-DD)' 
      });
    }

    const performance = await googleAdsService.getCampaignPerformance(
      campaignId, 
      startDate as string, 
      endDate as string
    );
    
    res.json({
      success: true,
      performance: performance,
      period: { startDate, endDate }
    });
  } catch (error: any) {
    console.error('Error en /performance:', error);
    res.status(500).json({ 
      error: 'Error obteniendo performance de campaña',
      details: error.message 
    });
  }
});

// Optimizar bidding automáticamente
router.put('/campaigns/:campaignId/optimize', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { targetCpa } = req.body;
    
    if (!targetCpa || targetCpa <= 0) {
      return res.status(400).json({ 
        error: 'targetCpa debe ser un número positivo' 
      });
    }

    await googleAdsService.optimizeBidding(campaignId, targetCpa);
    
    res.json({
      success: true,
      message: `Target CPA actualizado a €${targetCpa}`,
      campaignId: campaignId
    });
  } catch (error: any) {
    console.error('Error en /optimize:', error);
    res.status(500).json({ 
      error: 'Error optimizando campaña',
      details: error.message 
    });
  }
});

// Generar palabras clave optimizadas para apps
function generateAppKeywords(appName: string, language: string): string[] {
  const cleanAppName = appName.toLowerCase();
  
  const templates = {
    es: [
      `descargar ${cleanAppName}`,
      `${cleanAppName} app`,
      `aplicación ${cleanAppName}`,
      `instalar ${cleanAppName}`,
      `${cleanAppName} gratis`,
      `download ${cleanAppName}`,
      `${cleanAppName} oficial`,
      `app ${cleanAppName}`,
      `${cleanAppName} móvil`,
      `${cleanAppName} android`,
      `${cleanAppName} iphone`,
      `${cleanAppName} ios`,
      `bajar ${cleanAppName}`,
      `${cleanAppName} aplicacion`,
      `conseguir ${cleanAppName}`
    ],
    en: [
      `download ${cleanAppName}`,
      `${cleanAppName} app`,
      `install ${cleanAppName}`,
      `${cleanAppName} free`,
      `${cleanAppName} official`,
      `get ${cleanAppName}`,
      `${cleanAppName} mobile`,
      `${cleanAppName} android`,
      `${cleanAppName} iphone`,
      `${cleanAppName} ios`,
      `${cleanAppName} application`,
      `free ${cleanAppName}`,
      `${cleanAppName} download free`
    ],
    fr: [
      `télécharger ${cleanAppName}`,
      `${cleanAppName} app`,
      `installer ${cleanAppName}`,
      `application ${cleanAppName}`,
      `${cleanAppName} gratuit`,
      `${cleanAppName} officiel`,
      `app ${cleanAppName}`,
      `${cleanAppName} mobile`,
      `${cleanAppName} android`,
      `${cleanAppName} iphone`,
      `obtenir ${cleanAppName}`
    ]
  };

  return templates[language as keyof typeof templates] || templates.es;
}

// Generar titulares optimizados
function generateHeadlines(appName: string, language: string): string[] {
  const templates = {
    es: [
      `Descargar ${appName} - App Oficial`,
      `${appName} Gratis - Instalar Ahora`,
      `App ${appName} - Descarga Oficial`,
      `${appName} - Aplicación Gratuita`,
      `Instalar ${appName} - Seguro y Rápido`
    ],
    en: [
      `Download ${appName} - Official App`,
      `${appName} Free - Install Now`,
      `${appName} App - Official Download`,
      `Get ${appName} - Free Application`,
      `Install ${appName} - Safe & Fast`
    ],
    fr: [
      `Télécharger ${appName} - App Officielle`,
      `${appName} Gratuit - Installer`,
      `App ${appName} - Téléchargement Officiel`,
      `${appName} - Application Gratuite`,
      `Installer ${appName} - Sûr et Rapide`
    ]
  };

  return templates[language as keyof typeof templates] || templates.es;
}

// Generar descripciones optimizadas
function generateDescriptions(appName: string, language: string): string[] {
  const templates = {
    es: [
      `Descarga la app oficial de ${appName}. Gratis, segura y fácil de usar.`,
      `${appName} - La mejor aplicación móvil. Instálala ahora gratis.`,
      `App ${appName} oficial disponible. Descarga segura garantizada.`,
      `Consigue ${appName} gratis. Aplicación verificada y actualizada.`
    ],
    en: [
      `Download the official ${appName} app. Free, safe and easy to use.`,
      `${appName} - The best mobile application. Install now for free.`,
      `Official ${appName} app available. Guaranteed safe download.`,
      `Get ${appName} free. Verified and updated application.`
    ],
    fr: [
      `Téléchargez l'app officielle ${appName}. Gratuite, sûre et facile.`,
      `${appName} - La meilleure application mobile. Installez gratuitement.`,
      `App officielle ${appName} disponible. Téléchargement sûr garanti.`,
      `Obtenez ${appName} gratuit. Application vérifiée et mise à jour.`
    ]
  };

  return templates[language as keyof typeof templates] || templates.es;
}

export default router;