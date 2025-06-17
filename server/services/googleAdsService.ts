import { GoogleAdsApi, Campaign, AdGroup, Ad, Keyword, ConversionAction } from 'google-ads-api';

interface CampaignConfig {
  appId: string;
  appName: string;
  budget: number;
  targetLanguage: string;
  targetCountry: string;
}

interface ConversionConfig {
  name: string;
  value: number;
  currency: string;
  category: string;
}

interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  averageCpc: number;
  cost: number;
  conversions: number;
  costPerConversion: number;
  conversionRate: number;
}

export class GoogleAdsService {
  private client: GoogleAdsApi | null = null;
  private customerId: string;
  private baseUrl: string;

  constructor() {
    this.customerId = process.env.GOOGLE_ADS_CUSTOMER_ID || '';
    this.baseUrl = process.env.BASE_URL || 'https://topapps.store';
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
      const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

      if (!clientId || !clientSecret || !refreshToken || !developerToken || !this.customerId) {
        console.warn('Google Ads credentials not fully configured');
        return;
      }

      this.client = new GoogleAdsApi({
        client_id: clientId,
        client_secret: clientSecret,
        developer_token: developerToken,
      });

    } catch (error) {
      console.error('Failed to initialize Google Ads client:', error);
      this.client = null;
    }
  }

  async checkStatus() {
    if (!this.client) {
      return {
        configured: false,
        message: 'Google Ads API credentials not configured. Please add GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID, and GOOGLE_ADS_DEVELOPER_TOKEN to environment variables.'
      };
    }

    try {
      // Test API connection by fetching customer info
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      await customer.query(`
        SELECT customer.id, customer.descriptive_name 
        FROM customer 
        LIMIT 1
      `);

      return {
        configured: true,
        message: 'Google Ads API successfully connected and ready to create campaigns.'
      };
    } catch (error) {
      console.error('Google Ads API test failed:', error);
      return {
        configured: false,
        message: 'Google Ads API connection failed. Please verify your credentials and account access.'
      };
    }
  }

  private generateKeywords(appName: string, language: string): string[] {
    const baseKeywords = [
      appName.toLowerCase(),
      `${appName.toLowerCase()} app`,
      `download ${appName.toLowerCase()}`,
      `install ${appName.toLowerCase()}`,
      `${appName.toLowerCase()} application`
    ];

    const languageKeywords: Record<string, string[]> = {
      'es': [
        `descargar ${appName.toLowerCase()}`,
        `${appName.toLowerCase()} aplicacion`,
        `instalar ${appName.toLowerCase()}`,
        `${appName.toLowerCase()} gratis`,
        `bajar ${appName.toLowerCase()}`,
        `app ${appName.toLowerCase()}`,
        `aplicacion ${appName.toLowerCase()}`
      ],
      'fr': [
        `télécharger ${appName.toLowerCase()}`,
        `${appName.toLowerCase()} application`,
        `installer ${appName.toLowerCase()}`,
        `${appName.toLowerCase()} gratuit`,
        `app ${appName.toLowerCase()}`,
        `application ${appName.toLowerCase()}`
      ],
      'en': [
        `${appName.toLowerCase()} free`,
        `get ${appName.toLowerCase()}`,
        `${appName.toLowerCase()} download`,
        `${appName.toLowerCase()} mobile app`,
        `official ${appName.toLowerCase()}`
      ]
    };

    return [...baseKeywords, ...(languageKeywords[language] || languageKeywords['en'])];
  }

  private generateAdContent(appName: string, language: string) {
    const content: Record<string, any> = {
      'es': {
        headlines: [
          `Descarga ${appName} Gratis`,
          `${appName} - App Oficial`,
          `Instala ${appName} Ahora`,
          `${appName} - Descarga Ya`,
          `App ${appName} Gratuita`,
          `${appName} - Fácil y Rápido`,
          `Obtén ${appName} Gratis`,
          `${appName} - La Mejor App`,
          `Descarga ${appName} Hoy`,
          `${appName} - App Premium`
        ],
        descriptions: [
          `Descarga ${appName} gratis. Fácil de usar y completamente seguro.`,
          `${appName} oficial. Miles de usuarios satisfechos. ¡Descarga ya!`,
          `Instala ${appName} en segundos. Compatible con todos los dispositivos.`,
          `${appName} - La aplicación que necesitas. Descarga gratuita y rápida.`
        ]
      },
      'fr': {
        headlines: [
          `Télécharger ${appName} Gratuit`,
          `${appName} - App Officielle`,
          `Installer ${appName} Maintenant`,
          `${appName} - Téléchargement`,
          `App ${appName} Gratuite`,
          `${appName} - Facile et Rapide`,
          `Obtenir ${appName} Gratuit`,
          `${appName} - Meilleure App`,
          `Télécharger ${appName} Aujourd'hui`,
          `${appName} - App Premium`
        ],
        descriptions: [
          `Téléchargez ${appName} gratuitement. Facile à utiliser et sécurisé.`,
          `${appName} officiel. Des milliers d'utilisateurs satisfaits.`,
          `Installez ${appName} en quelques secondes. Compatible partout.`,
          `${appName} - L'application dont vous avez besoin. Gratuit.`
        ]
      },
      'en': {
        headlines: [
          `Download ${appName} Free`,
          `${appName} - Official App`,
          `Install ${appName} Now`,
          `${appName} - Free Download`,
          `Get ${appName} App`,
          `${appName} - Easy & Fast`,
          `${appName} Free App`,
          `${appName} - Best App`,
          `Download ${appName} Today`,
          `${appName} - Premium App`
        ],
        descriptions: [
          `Download ${appName} for free. Easy to use and completely secure.`,
          `Official ${appName} app. Thousands of satisfied users worldwide.`,
          `Install ${appName} in seconds. Compatible with all devices.`,
          `${appName} - The app you need. Free and fast download.`
        ]
      }
    };

    return content[language] || content['en'];
  }

  async createAppDownloadCampaign(config: CampaignConfig) {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      const landingPageUrl = `${this.baseUrl}/app/${config.appId}`;
      const keywords = this.generateKeywords(config.appName, config.targetLanguage);
      const adContent = this.generateAdContent(config.appName, config.targetLanguage);

      // Create campaign
      const campaignOperation = {
        create: {
          name: `${config.appName} - Download Campaign ${config.targetCountry}`,
          status: 'ENABLED',
          advertising_channel_type: 'SEARCH',
          campaign_budget: {
            amount_micros: config.budget * 1000000, // Convert to micros
            delivery_method: 'STANDARD'
          },
          target_cpa: {
            target_cpa_micros: 15000000 // €15 target CPA
          },
          geo_target_type_setting: {
            positive_geo_target_type: 'PRESENCE_OR_INTEREST',
            negative_geo_target_type: 'PRESENCE'
          },
          network_settings: {
            target_google_search: true,
            target_search_network: true,
            target_content_network: false,
            target_partner_search_network: false
          }
        }
      };

      const campaignResponse = await customer.campaigns.create([campaignOperation]);
      const campaignId = campaignResponse.results[0].resource_name.split('/')[3];

      // Create ad group
      const adGroupOperation = {
        create: {
          name: `${config.appName} - Ad Group`,
          status: 'ENABLED',
          campaign: campaignResponse.results[0].resource_name,
          type: 'SEARCH_STANDARD',
          cpc_bid_micros: 2000000 // €2 max CPC
        }
      };

      const adGroupResponse = await customer.adGroups.create([adGroupOperation]);
      const adGroupId = adGroupResponse.results[0].resource_name.split('/')[5];

      // Create keywords
      const keywordOperations = keywords.map(keyword => ({
        create: {
          ad_group: adGroupResponse.results[0].resource_name,
          keyword: {
            text: keyword,
            match_type: 'EXACT'
          },
          status: 'ENABLED',
          cpc_bid_micros: 1500000 // €1.50 keyword bid
        }
      }));

      await customer.adGroupCriteria.create(keywordOperations);

      // Create responsive search ad
      const adOperation = {
        create: {
          ad_group: adGroupResponse.results[0].resource_name,
          status: 'ENABLED',
          ad: {
            type: 'RESPONSIVE_SEARCH_AD',
            responsive_search_ad: {
              headlines: adContent.headlines.slice(0, 10).map((text: string) => ({ text })),
              descriptions: adContent.descriptions.map((text: string) => ({ text })),
              final_urls: [landingPageUrl]
            }
          }
        }
      };

      await customer.ads.create([adOperation]);

      return {
        success: true,
        campaignId,
        adGroupId,
        message: `Campaign created successfully for ${config.appName}`,
        landingPageUrl,
        keywordsCount: keywords.length,
        budget: config.budget,
        targetCpa: 15
      };

    } catch (error) {
      console.error('Campaign creation error:', error);
      throw new Error(`Failed to create campaign: ${error}`);
    }
  }

  async createConversionAction(config: ConversionConfig) {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      const conversionOperation = {
        create: {
          name: config.name,
          category: 'DOWNLOAD',
          status: 'ENABLED',
          type: 'WEBPAGE',
          value_settings: {
            default_value: config.value * 1000000, // Convert to micros
            default_currency_code: config.currency,
            always_use_default_value: true
          },
          attribution_model_settings: {
            attribution_model: 'LAST_CLICK',
            data_driven_model_status: 'ELIGIBLE'
          },
          click_through_lookback_window_days: 30,
          view_through_lookback_window_days: 1
        }
      };

      const response = await customer.conversionActions.create([conversionOperation]);
      const conversionId = response.results[0].resource_name.split('/')[3];

      return {
        success: true,
        conversionId,
        name: config.name,
        value: config.value,
        currency: config.currency,
        message: 'Conversion action created successfully'
      };

    } catch (error) {
      console.error('Conversion action creation error:', error);
      throw new Error(`Failed to create conversion action: ${error}`);
    }
  }

  async getCampaignPerformance(campaignId: string, startDate: string, endDate: string): Promise<PerformanceMetrics> {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      const query = `
        SELECT 
          metrics.impressions,
          metrics.clicks,
          metrics.ctr,
          metrics.average_cpc,
          metrics.cost_micros,
          metrics.conversions,
          metrics.cost_per_conversion,
          metrics.conversions_from_interactions_rate
        FROM campaign 
        WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${startDate}' AND '${endDate}'
      `;

      const results = await customer.query(query);
      
      if (results.length === 0) {
        throw new Error('No performance data found for the specified campaign and date range');
      }

      const metrics = results[0].metrics;

      return {
        impressions: metrics.impressions || 0,
        clicks: metrics.clicks || 0,
        ctr: metrics.ctr || 0,
        averageCpc: (metrics.average_cpc || 0) / 1000000, // Convert from micros
        cost: (metrics.cost_micros || 0) / 1000000, // Convert from micros
        conversions: metrics.conversions || 0,
        costPerConversion: (metrics.cost_per_conversion || 0) / 1000000, // Convert from micros
        conversionRate: metrics.conversions_from_interactions_rate || 0
      };

    } catch (error) {
      console.error('Performance retrieval error:', error);
      throw new Error(`Failed to get campaign performance: ${error}`);
    }
  }

  async optimizeCampaignBidding(campaignId: string, targetCpa: number) {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      });

      const campaignOperation = {
        update: {
          resource_name: `customers/${this.customerId}/campaigns/${campaignId}`,
          target_cpa: {
            target_cpa_micros: targetCpa * 1000000 // Convert to micros
          }
        },
        update_mask: {
          paths: ['target_cpa']
        }
      };

      await customer.campaigns.update([campaignOperation]);

      return {
        success: true,
        campaignId,
        newTargetCpa: targetCpa,
        message: 'Campaign bidding optimization completed successfully'
      };

    } catch (error) {
      console.error('Bidding optimization error:', error);
      throw new Error(`Failed to optimize campaign bidding: ${error}`);
    }
  }
}