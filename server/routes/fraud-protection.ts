import express from 'express';
import { fraudDetectionService } from '../services/fraud-detection';
import { extractClickData, trackClickEvent, blockFraudulentIps, rateLimitClicks } from '../middleware/click-tracking';
import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq, gte, lte, desc, count } from 'drizzle-orm';
import { blockedIps, clickEvents, fraudDetectionRules, googleAdsExclusions } from '@shared/schema';
import postgres from 'postgres';

const router = express.Router();

// Initialize database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/topapps';
const sql = postgres(DATABASE_URL);
const db = drizzle(sql);

// Apply click tracking middleware to all routes
router.use(extractClickData);

/**
 * Track app click with fraud detection
 * POST /api/fraud-protection/track-click
 */
router.post('/track-click', 
  rateLimitClicks(60000, 15), // 15 clicks per minute max
  trackClickEvent,
  async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Click tracked successfully',
        riskScore: req.fraudResult?.riskScore || 0,
        allowed: req.fraudResult?.allowed !== false
      });
    } catch (error) {
      console.error('Error in track-click route:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * Get fraud detection statistics
 * GET /api/fraud-protection/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await fraudDetectionService.getFraudStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting fraud stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fraud statistics'
    });
  }
});

/**
 * Get blocked IPs list
 * GET /api/fraud-protection/blocked-ips
 */
router.get('/blocked-ips', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const blockedIpsList = await db
      .select()
      .from(blockedIps)
      .where(eq(blockedIps.isActive, true))
      .orderBy(desc(blockedIps.blockedAt))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(blockedIps)
      .where(eq(blockedIps.isActive, true));

    res.json({
      success: true,
      data: {
        blockedIps: blockedIpsList,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting blocked IPs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get blocked IPs'
    });
  }
});

/**
 * Manually block IP address
 * POST /api/fraud-protection/block-ip
 */
router.post('/block-ip', async (req, res) => {
  try {
    const { ipAddress, reason, notes } = req.body;

    if (!ipAddress || !reason) {
      return res.status(400).json({
        success: false,
        error: 'IP address and reason are required'
      });
    }

    // Analyze the IP first
    const analysis = await fraudDetectionService.analyzeIpAddress(ipAddress);

    await fraudDetectionService.blockIpAddress({
      ipAddress,
      reason,
      riskScore: analysis.riskScore,
      isVpn: analysis.isVpn,
      isProxy: analysis.isProxy,
      country: analysis.country,
      city: analysis.city,
      userAgent: null,
      isActive: true,
      notes
    });

    res.json({
      success: true,
      message: 'IP address blocked successfully',
      analysis
    });
  } catch (error) {
    console.error('Error blocking IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to block IP address'
    });
  }
});

/**
 * Unblock IP address
 * POST /api/fraud-protection/unblock-ip
 */
router.post('/unblock-ip', async (req, res) => {
  try {
    const { ipAddress } = req.body;

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        error: 'IP address is required'
      });
    }

    await db
      .update(blockedIps)
      .set({ isActive: false })
      .where(eq(blockedIps.ipAddress, ipAddress));

    res.json({
      success: true,
      message: 'IP address unblocked successfully'
    });
  } catch (error) {
    console.error('Error unblocking IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unblock IP address'
    });
  }
});

/**
 * Get recent click events
 * GET /api/fraud-protection/click-events
 */
router.get('/click-events', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const fraudulent = req.query.fraudulent === 'true';

    let query = db
      .select()
      .from(clickEvents);

    if (fraudulent) {
      query = query.where(eq(clickEvents.isFraudulent, true));
    }

    const events = await query
      .orderBy(desc(clickEvents.clickTimestamp))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(clickEvents)
      .where(fraudulent ? eq(clickEvents.isFraudulent, true) : undefined);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting click events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get click events'
    });
  }
});

/**
 * Analyze IP address
 * POST /api/fraud-protection/analyze-ip
 */
router.post('/analyze-ip', async (req, res) => {
  try {
    const { ipAddress } = req.body;

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        error: 'IP address is required'
      });
    }

    const analysis = await fraudDetectionService.analyzeIpAddress(ipAddress);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze IP address'
    });
  }
});

/**
 * Get fraud detection rules
 * GET /api/fraud-protection/rules
 */
router.get('/rules', async (req, res) => {
  try {
    const rules = await db
      .select()
      .from(fraudDetectionRules)
      .orderBy(desc(fraudDetectionRules.severity));

    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    console.error('Error getting fraud rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fraud detection rules'
    });
  }
});

/**
 * Update fraud detection rule
 * PUT /api/fraud-protection/rules/:id
 */
router.put('/rules/:id', async (req, res) => {
  try {
    const ruleId = parseInt(req.params.id);
    const { ruleName, description, ruleType, conditions, action, severity, isActive } = req.body;

    await db
      .update(fraudDetectionRules)
      .set({
        ruleName,
        description,
        ruleType,
        conditions,
        action,
        severity,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(fraudDetectionRules.id, ruleId));

    res.json({
      success: true,
      message: 'Rule updated successfully'
    });
  } catch (error) {
    console.error('Error updating fraud rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update fraud detection rule'
    });
  }
});

/**
 * Get Google Ads exclusions
 * GET /api/fraud-protection/google-ads-exclusions
 */
router.get('/google-ads-exclusions', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const exclusions = await db
      .select()
      .from(googleAdsExclusions)
      .where(eq(googleAdsExclusions.isActive, true))
      .orderBy(desc(googleAdsExclusions.excludedAt))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(googleAdsExclusions)
      .where(eq(googleAdsExclusions.isActive, true));

    res.json({
      success: true,
      data: {
        exclusions,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting Google Ads exclusions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Google Ads exclusions'
    });
  }
});

/**
 * Get fraud detection dashboard data
 * GET /api/fraud-protection/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get basic stats
    const stats = await fraudDetectionService.getFraudStats();

    // Get recent activity
    const [recentFraudulent] = await db
      .select({ count: count() })
      .from(clickEvents)
      .where(and(
        eq(clickEvents.isFraudulent, true),
        gte(clickEvents.clickTimestamp, oneHourAgo)
      ));

    const [recentBlocked] = await db
      .select({ count: count() })
      .from(blockedIps)
      .where(and(
        eq(blockedIps.isActive, true),
        gte(blockedIps.blockedAt, oneHourAgo)
      ));

    // Get trend data
    const dailyStats = await db
      .select({
        date: db.sql`DATE(${clickEvents.clickTimestamp})`,
        totalClicks: count(),
        fraudulentClicks: db.sql`COUNT(CASE WHEN ${clickEvents.isFraudulent} = true THEN 1 END)`
      })
      .from(clickEvents)
      .where(gte(clickEvents.clickTimestamp, oneWeekAgo))
      .groupBy(db.sql`DATE(${clickEvents.clickTimestamp})`)
      .orderBy(db.sql`DATE(${clickEvents.clickTimestamp})`);

    res.json({
      success: true,
      data: {
        ...stats,
        recentActivity: {
          fraudulentClicksLastHour: recentFraudulent.count,
          newBlockedIpsLastHour: recentBlocked.count
        },
        trends: {
          dailyStats
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data'
    });
  }
});

/**
 * Initialize fraud detection system
 * POST /api/fraud-protection/initialize
 */
router.post('/initialize', async (req, res) => {
  try {
    await fraudDetectionService.initializeDefaultRules();
    
    res.json({
      success: true,
      message: 'Fraud detection system initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing fraud detection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize fraud detection system'
    });
  }
});

export default router;