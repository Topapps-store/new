import { GoogleAdsApi, services } from 'google-ads-api';

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  developerToken: string;
}

interface CampaignData {
  name: string;
  budget: number;
  targetCpa?: number;
  keywords: string[];
  landingPageUrl: string;
  adGroups: {
    name: string;
    keywords: string[];
    ads: {
      headlines: string[];
      descriptions: string[];
      finalUrl: string;
    }[];
  }[];
}

interface ConversionAction {
  name: string;
  category: string;
  value: number;
  currency: string;
}

class GoogleAdsService {
  private client: GoogleAdsApi | null = null;
  private customerId: string = '';

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const config: GoogleAdsConfig = {
      clientId: process.env.GOOGLE_ADS_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
      developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ''
    };

    if (!config.clientId || !config.clientSecret || !config.refreshToken || !config.customerId || !config.developerToken) {
      console.warn('Google Ads credentials not found. Service will not be available.');
      return;
    }

    this.customerId = config.customerId;
    this.client = new GoogleAdsApi({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      developer_token: config.developerToken
    });
  }

  async createSearchCampaign(campaignData: CampaignData): Promise<string | null> {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
      });

      // 1. Crear presupuesto de campaña
      const budgetOperation = {
        create: {
          name: `${campaignData.name} Budget`,
          amount_micros: campaignData.budget * 1000000, // Convertir a micros
          delivery_method: services.BudgetDeliveryMethod.STANDARD
        }
      };

      const budgetResponse = await customer.campaignBudgets.mutate([budgetOperation]);
      const budgetResourceName = budgetResponse.results[0].resource_name;

      // 2. Crear campaña de búsqueda
      const campaignOperation = {
        create: {
          name: campaignData.name,
          status: services.CampaignStatus.ENABLED,
          advertising_channel_type: services.AdvertisingChannelType.SEARCH,
          campaign_budget: budgetResourceName,
          network_settings: {
            target_google_search: true,
            target_search_network: true,
            target_content_network: false,
            target_partner_search_network: false
          },
          bidding_strategy_type: services.BiddingStrategyType.TARGET_CPA,
          target_cpa: {
            target_cpa_micros: (campaignData.targetCpa || 50) * 1000000
          },
          start_date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '')
        }
      };

      const campaignResponse = await customer.campaigns.mutate([campaignOperation]);
      const campaignResourceName = campaignResponse.results[0].resource_name;

      // 3. Crear grupos de anuncios y palabras clave
      for (const adGroup of campaignData.adGroups) {
        await this.createAdGroup(customer, campaignResourceName, adGroup, campaignData.landingPageUrl);
      }

      console.log(`Campaña creada exitosamente: ${campaignResourceName}`);
      return campaignResourceName;

    } catch (error) {
      console.error('Error creando campaña de Google Ads:', error);
      throw error;
    }
  }

  private async createAdGroup(customer: any, campaignResourceName: string, adGroupData: any, landingPageUrl: string) {
    // Crear grupo de anuncios
    const adGroupOperation = {
      create: {
        name: adGroupData.name,
        campaign: campaignResourceName,
        status: services.AdGroupStatus.ENABLED,
        type: services.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: 2000000 // $2.00 en micros
      }
    };

    const adGroupResponse = await customer.adGroups.mutate([adGroupOperation]);
    const adGroupResourceName = adGroupResponse.results[0].resource_name;

    // Agregar palabras clave
    const keywordOperations = adGroupData.keywords.map((keyword: string) => ({
      create: {
        ad_group: adGroupResourceName,
        status: services.AdGroupCriterionStatus.ENABLED,
        keyword: {
          text: keyword,
          match_type: services.KeywordMatchType.BROAD
        }
      }
    }));

    await customer.adGroupCriteria.mutate(keywordOperations);

    // Crear anuncios
    for (const ad of adGroupData.ads) {
      const adOperation = {
        create: {
          ad_group: adGroupResourceName,
          status: services.AdGroupAdStatus.ENABLED,
          ad: {
            type: services.AdType.RESPONSIVE_SEARCH_AD,
            responsive_search_ad: {
              headlines: ad.headlines.map((headline: string) => ({
                text: headline
              })),
              descriptions: ad.descriptions.map((description: string) => ({
                text: description
              })),
              path1: 'apps',
              path2: 'download'
            },
            final_urls: [ad.finalUrl || landingPageUrl]
          }
        }
      };

      await customer.adGroupAds.mutate([adOperation]);
    }
  }

  async createConversionAction(conversionData: ConversionAction): Promise<string | null> {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
      });

      const conversionOperation = {
        create: {
          name: conversionData.name,
          category: services.ConversionActionCategory.DOWNLOAD,
          type: services.ConversionActionType.WEBPAGE,
          status: services.ConversionActionStatus.ENABLED,
          view_through_lookback_window_days: 30,
          click_through_lookback_window_days: 30,
          value_settings: {
            default_value: conversionData.value * 1000000, // Convertir a micros
            default_currency_code: conversionData.currency,
            always_use_default_value: true
          },
          counting_type: services.ConversionActionCountingType.ONE_PER_CLICK
        }
      };

      const response = await customer.conversionActions.mutate([conversionOperation]);
      console.log(`Acción de conversión creada: ${response.results[0].resource_name}`);
      return response.results[0].resource_name;

    } catch (error) {
      console.error('Error creando acción de conversión:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string, startDate: string, endDate: string) {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
      });

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          metrics.impressions,
          metrics.clicks,
          metrics.ctr,
          metrics.average_cpc,
          metrics.cost_micros,
          metrics.conversions,
          metrics.cost_per_conversion,
          metrics.conversion_rate
        FROM campaign 
        WHERE campaign.id = ${campaignId}
          AND segments.date BETWEEN '${startDate}' AND '${endDate}'
        ORDER BY segments.date DESC
      `;

      const response = await customer.query(query);
      return response;

    } catch (error) {
      console.error('Error obteniendo performance de campaña:', error);
      throw error;
    }
  }

  async optimizeBidding(campaignId: string, targetCpa: number) {
    if (!this.client) {
      throw new Error('Google Ads client not initialized');
    }

    try {
      const customer = this.client.Customer({
        customer_id: this.customerId,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
      });

      const campaignOperation = {
        update: {
          resource_name: `customers/${this.customerId}/campaigns/${campaignId}`,
          target_cpa: {
            target_cpa_micros: targetCpa * 1000000
          }
        },
        update_mask: {
          paths: ['target_cpa']
        }
      };

      await customer.campaigns.mutate([campaignOperation]);
      console.log(`Target CPA actualizado para campaña ${campaignId}: $${targetCpa}`);

    } catch (error) {
      console.error('Error optimizando bidding:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}

export const googleAdsService = new GoogleAdsService();
export { GoogleAdsService, CampaignData, ConversionAction };