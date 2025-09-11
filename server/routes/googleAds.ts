import { Router } from 'express';
import { GoogleAdsService } from '../services/googleAdsService';
import { requireAdmin } from '../controllers/auth-controller';

const router = Router();

// Initialize Google Ads service
const googleAdsService = new GoogleAdsService();

// Check Google Ads API status
router.get('/status', async (req, res) => {
  try {
    const status = await googleAdsService.checkStatus();
    res.json(status);
  } catch (error) {
    console.error('Google Ads status check failed:', error);
    res.status(500).json({ 
      configured: false, 
      message: 'Error checking Google Ads configuration' 
    });
  }
});

// Create app download campaign
router.post('/campaigns/app-download', async (req, res) => {
  try {
    const { appId, appName, budget, targetLanguage, targetCountry } = req.body;
    
    if (!appId || !appName || !budget || !targetLanguage || !targetCountry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const campaign = await googleAdsService.createAppDownloadCampaign({
      appId,
      appName,
      budget,
      targetLanguage,
      targetCountry
    });

    res.json(campaign);
  } catch (error) {
    console.error('Campaign creation failed:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Create conversion action
router.post('/conversions', async (req, res) => {
  try {
    const { name, value, currency, category } = req.body;
    
    if (!name || !value || !currency || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const conversion = await googleAdsService.createConversionAction({
      name,
      value,
      currency,
      category
    });

    res.json(conversion);
  } catch (error) {
    console.error('Conversion creation failed:', error);
    res.status(500).json({ error: 'Failed to create conversion action' });
  }
});

// Get campaign performance
router.get('/campaigns/:campaignId/performance', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!campaignId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const performance = await googleAdsService.getCampaignPerformance(
      campaignId,
      startDate as string,
      endDate as string
    );

    res.json(performance);
  } catch (error) {
    console.error('Performance retrieval failed:', error);
    res.status(500).json({ error: 'Failed to get campaign performance' });
  }
});

// Optimize campaign bidding
router.put('/campaigns/:campaignId/optimize', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { targetCpa } = req.body;
    
    if (!campaignId || !targetCpa) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await googleAdsService.optimizeCampaignBidding(
      campaignId,
      targetCpa
    );

    res.json(result);
  } catch (error) {
    console.error('Campaign optimization failed:', error);
    res.status(500).json({ error: 'Failed to optimize campaign' });
  }
});

// POST /api/google-ads/uber-taxi-campaign - Create optimized "uber taxi" campaign for Quality Score 10/10
router.post('/uber-taxi-campaign', requireAdmin, async (req, res) => {
  try {
    const result = await googleAdsService.createUberTaxiOptimizedCampaign();
    res.json(result);
  } catch (error) {
    console.error('Error creating Uber Taxi optimized campaign:', error);
    res.status(500).json({ 
      error: 'Failed to create Uber Taxi optimized campaign',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as googleAdsRouter };