import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq, gte, lte, desc, count, sql } from 'drizzle-orm';
import { 
  blockedIps, 
  clickEvents, 
  fraudDetectionRules, 
  googleAdsExclusions,
  type InsertBlockedIp,
  type InsertClickEvent,
  type InsertFraudDetectionRule,
  type InsertGoogleAdsExclusion
} from '@shared/schema';
import { GoogleAdsApi } from 'google-ads-api';
import postgres from 'postgres';
import axios from 'axios';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

// Initialize database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/topapps';
const sql_connection = postgres(DATABASE_URL);
const db = drizzle(sql_connection);

// Simple IP analysis interface
interface IPAnalysis {
  isVpn: boolean;
  isProxy: boolean;
  isBot: boolean;
  country: string;
  city: string;
  fraudScore: number;
  suspiciousFactors: string[];
}

interface FraudAnalysisResult {
  isBot: boolean;
  isVpn: boolean;
  isProxy: boolean;
  riskScore: number;
  country: string;
  city: string;
  shouldBlock: boolean;
  fraudReason?: string;
}

interface ClickAnalysis {
  clicksPerMinute: number;
  clicksPerHour: number;
  clicksPerDay: number;
  averageClickDuration: number;
  hasMouseMovements: boolean;
  hasKeyboardEvents: boolean;
  hasScrollEvents: boolean;
  suspiciousPatterns: string[];
}

export class FraudDetectionService {
  private googleAdsClient: GoogleAdsApi;
  private knownVpnRanges: string[] = [];
  private knownBotUserAgents: string[] = [];

  constructor() {
    // Initialize Google Ads client
    this.googleAdsClient = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    });

    // Initialize known VPN ranges and bot user agents
    this.initializeKnownThreats();
  }

  private initializeKnownThreats() {
    // Common VPN service IP ranges (simplified)
    this.knownVpnRanges = [
      '188.166.', '134.209.', '159.65.', '167.99.', '178.128.', // DigitalOcean
      '35.', '34.', '104.', '146.148.', // Google Cloud
      '54.', '52.', '18.', '13.', // AWS
      '157.230.', '68.183.', '206.189.', // Common VPN ranges
    ];

    // Common bot user agents patterns
    this.knownBotUserAgents = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'selenium',
      'headless', 'phantom', 'nightmare', 'puppeteer', 'playwright'
    ];
  }

  /**
   * Analyze IP address for fraud indicators
   */
  async analyzeIpAddress(ipAddress: string): Promise<FraudAnalysisResult> {
    try {
      // Check if IP is already blocked
      const blockedIp = await db
        .select()
        .from(blockedIps)
        .where(and(
          eq(blockedIps.ipAddress, ipAddress),
          eq(blockedIps.isActive, true)
        ))
        .limit(1);

      if (blockedIp.length > 0) {
        return {
          isBot: true,
          isVpn: blockedIp[0].isVpn,
          isProxy: blockedIp[0].isProxy,
          riskScore: blockedIp[0].riskScore,
          country: blockedIp[0].country || '',
          city: blockedIp[0].city || '',
          shouldBlock: true,
          fraudReason: `IP already blocked: ${blockedIp[0].reason}`
        };
      }

      // Perform basic IP analysis
      const ipAnalysis = await this.performBasicIpAnalysis(ipAddress);
      
      // Calculate risk score based on multiple factors
      let riskScore = 0;
      const suspiciousFactors = [];

      if (ipAnalysis.isProxy) {
        riskScore += 30;
        suspiciousFactors.push('Proxy detected');
      }

      if (ipAnalysis.isVpn) {
        riskScore += 25;
        suspiciousFactors.push('VPN detected');
      }

      if (ipAnalysis.isBot) {
        riskScore += 35;
        suspiciousFactors.push('Bot detected');
      }

      // Additional behavioral analysis
      const behaviorAnalysis = await this.analyzeBehavioralPatterns(ipAddress);
      riskScore += behaviorAnalysis.riskScore;
      suspiciousFactors.push(...behaviorAnalysis.suspiciousPatterns);

      const shouldBlock = riskScore >= 70; // Block if risk score is 70 or higher

      return {
        isBot: ipAnalysis.isBot,
        isVpn: ipAnalysis.isVpn,
        isProxy: ipAnalysis.isProxy,
        riskScore,
        country: ipAnalysis.country,
        city: ipAnalysis.city,
        shouldBlock,
        fraudReason: suspiciousFactors.join(', ')
      };

    } catch (error) {
      console.error('Error analyzing IP address:', error);
      return {
        isBot: false,
        isVpn: false,
        isProxy: false,
        riskScore: 0,
        country: '',
        city: '',
        shouldBlock: false
      };
    }
  }

  /**
   * Perform basic IP analysis using available tools
   */
  private async performBasicIpAnalysis(ipAddress: string): Promise<IPAnalysis> {
    let isVpn = false;
    let isProxy = false;
    let isBot = false;
    let country = '';
    let city = '';
    let fraudScore = 0;
    const suspiciousFactors = [];

    try {
      // Use geoip-lite for basic location lookup
      const geoInfo = geoip.lookup(ipAddress);
      if (geoInfo) {
        country = geoInfo.country;
        city = geoInfo.city;
      }

      // Check against known VPN ranges
      for (const range of this.knownVpnRanges) {
        if (ipAddress.startsWith(range)) {
          isVpn = true;
          fraudScore += 25;
          suspiciousFactors.push('Known VPN range');
          break;
        }
      }

      // Check for data center IPs (often used by VPNs/proxies)
      if (this.isDataCenterIp(ipAddress)) {
        isProxy = true;
        fraudScore += 20;
        suspiciousFactors.push('Data center IP');
      }

      // Additional checks for suspicious patterns
      if (this.isSuspiciousIpPattern(ipAddress)) {
        fraudScore += 15;
        suspiciousFactors.push('Suspicious IP pattern');
      }

    } catch (error) {
      console.error('Error in basic IP analysis:', error);
    }

    return {
      isVpn,
      isProxy,
      isBot,
      country,
      city,
      fraudScore,
      suspiciousFactors
    };
  }

  /**
   * Check if IP belongs to a data center
   */
  private isDataCenterIp(ipAddress: string): boolean {
    // Simple check for common data center ranges
    const dataCenterRanges = [
      '199.', '208.', '216.', '69.', '8.8.', '1.1.', '1.0.', 
      '185.', '178.', '176.', '77.', '46.', '37.', '31.'
    ];

    return dataCenterRanges.some(range => ipAddress.startsWith(range));
  }

  /**
   * Check for suspicious IP patterns
   */
  private isSuspiciousIpPattern(ipAddress: string): boolean {
    // Check for private IP ranges being used publicly (suspicious)
    if (ipAddress.startsWith('192.168.') || 
        ipAddress.startsWith('10.') || 
        ipAddress.startsWith('172.16.') ||
        ipAddress.startsWith('127.')) {
      return true;
    }

    // Check for sequential IPs (often bots)
    const parts = ipAddress.split('.');
    if (parts.length === 4) {
      const lastOctet = parseInt(parts[3]);
      if (lastOctet === 1 || lastOctet === 255) {
        return true;
      }
    }

    return false;
  }

  /**
   * Analyze user agent for bot detection
   */
  private analyzeUserAgent(userAgent: string): { isBot: boolean; suspiciousFactors: string[] } {
    const suspiciousFactors = [];
    let isBot = false;

    if (!userAgent) {
      isBot = true;
      suspiciousFactors.push('Missing user agent');
      return { isBot, suspiciousFactors };
    }

    // Check against known bot patterns
    const lowerUserAgent = userAgent.toLowerCase();
    for (const botPattern of this.knownBotUserAgents) {
      if (lowerUserAgent.includes(botPattern)) {
        isBot = true;
        suspiciousFactors.push(`Bot pattern detected: ${botPattern}`);
        break;
      }
    }

    // Use ua-parser-js for detailed analysis
    try {
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      // Check for headless browsers
      if (result.browser.name?.toLowerCase().includes('headless')) {
        isBot = true;
        suspiciousFactors.push('Headless browser detected');
      }

      // Check for unusual browser/OS combinations
      if (result.os.name === undefined || result.browser.name === undefined) {
        suspiciousFactors.push('Incomplete browser information');
      }

      // Check for very old browsers (often bots)
      if (result.browser.version && parseFloat(result.browser.version) < 50) {
        suspiciousFactors.push('Very old browser version');
      }

    } catch (error) {
      console.error('User agent analysis error:', error);
      suspiciousFactors.push('User agent analysis failed');
    }

    return { isBot, suspiciousFactors };
  }

  /**
   * Analyze behavioral patterns for fraud detection
   */
  private async analyzeBehavioralPatterns(ipAddress: string): Promise<{
    riskScore: number;
    suspiciousPatterns: string[];
  }> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      // Get recent clicks from this IP
      const recentClicks = await db
        .select()
        .from(clickEvents)
        .where(and(
          eq(clickEvents.ipAddress, ipAddress),
          gte(clickEvents.clickTimestamp, oneDayAgo)
        ))
        .orderBy(desc(clickEvents.clickTimestamp));

      const analysis = this.analyzeClickPatterns(recentClicks);
      let riskScore = 0;
      const suspiciousPatterns = [];

      // High click frequency
      if (analysis.clicksPerMinute > 10) {
        riskScore += 40;
        suspiciousPatterns.push('Extremely high click frequency');
      } else if (analysis.clicksPerMinute > 5) {
        riskScore += 25;
        suspiciousPatterns.push('High click frequency');
      }

      // Fast clicking (less than 800ms)
      if (analysis.averageClickDuration < 800) {
        riskScore += 30;
        suspiciousPatterns.push('Suspiciously fast clicking');
      }

      // No human interaction indicators
      if (!analysis.hasMouseMovements && recentClicks.length > 3) {
        riskScore += 20;
        suspiciousPatterns.push('No mouse movements detected');
      }

      if (!analysis.hasKeyboardEvents && !analysis.hasScrollEvents && recentClicks.length > 5) {
        riskScore += 15;
        suspiciousPatterns.push('No user interaction detected');
      }

      // Pattern analysis
      if (analysis.suspiciousPatterns.length > 0) {
        riskScore += 10 * analysis.suspiciousPatterns.length;
        suspiciousPatterns.push(...analysis.suspiciousPatterns);
      }

      return { riskScore, suspiciousPatterns };
    } catch (error) {
      console.error('Error analyzing behavioral patterns:', error);
      return { riskScore: 0, suspiciousPatterns: [] };
    }
  }

  /**
   * Analyze click patterns for suspicious behavior
   */
  private analyzeClickPatterns(clicks: any[]): ClickAnalysis {
    if (clicks.length === 0) {
      return {
        clicksPerMinute: 0,
        clicksPerHour: 0,
        clicksPerDay: clicks.length,
        averageClickDuration: 0,
        hasMouseMovements: false,
        hasKeyboardEvents: false,
        hasScrollEvents: false,
        suspiciousPatterns: []
      };
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    const clicksLastMinute = clicks.filter(c => new Date(c.clickTimestamp) >= oneMinuteAgo).length;
    const clicksLastHour = clicks.filter(c => new Date(c.clickTimestamp) >= oneHourAgo).length;
    
    const averageClickDuration = clicks.reduce((sum, c) => sum + (c.clickDuration || 0), 0) / clicks.length;
    const hasMouseMovements = clicks.some(c => c.mouseMovements > 0);
    const hasKeyboardEvents = clicks.some(c => c.keyboardEvents > 0);
    const hasScrollEvents = clicks.some(c => c.scrollEvents > 0);

    const suspiciousPatterns = [];

    // Check for regular intervals (bot-like behavior)
    if (clicks.length >= 3) {
      const intervals = [];
      for (let i = 1; i < clicks.length; i++) {
        const interval = new Date(clicks[i-1].clickTimestamp).getTime() - new Date(clicks[i].clickTimestamp).getTime();
        intervals.push(interval);
      }

      // Check if intervals are too regular (variance < 10% of mean)
      const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length;
      const standardDeviation = Math.sqrt(variance);

      if (standardDeviation / meanInterval < 0.1) {
        suspiciousPatterns.push('Regular click intervals detected');
      }
    }

    // Check for identical user agents
    const userAgents = clicks.map(c => c.userAgent).filter(Boolean);
    if (userAgents.length > 1 && new Set(userAgents).size === 1) {
      suspiciousPatterns.push('Identical user agents');
    }

    // Check for same screen resolution and timezone
    const screenResolutions = clicks.map(c => c.screenResolution).filter(Boolean);
    const timezones = clicks.map(c => c.timezone).filter(Boolean);
    
    if (screenResolutions.length > 1 && new Set(screenResolutions).size === 1 &&
        timezones.length > 1 && new Set(timezones).size === 1) {
      suspiciousPatterns.push('Identical device fingerprint');
    }

    return {
      clicksPerMinute: clicksLastMinute,
      clicksPerHour: clicksLastHour,
      clicksPerDay: clicks.length,
      averageClickDuration,
      hasMouseMovements,
      hasKeyboardEvents,
      hasScrollEvents,
      suspiciousPatterns
    };
  }

  /**
   * Record click event and perform real-time fraud analysis
   */
  async recordClickEvent(clickData: InsertClickEvent): Promise<{
    allowed: boolean;
    reason?: string;
    riskScore: number;
  }> {
    try {
      // Analyze the IP address
      const fraudAnalysis = await this.analyzeIpAddress(clickData.ipAddress);

      // Create click event record
      const clickEvent = {
        ...clickData,
        isVpn: fraudAnalysis.isVpn,
        isProxy: fraudAnalysis.isProxy,
        isBot: fraudAnalysis.isBot,
        riskScore: fraudAnalysis.riskScore,
        country: fraudAnalysis.country,
        city: fraudAnalysis.city,
        isFraudulent: fraudAnalysis.shouldBlock,
        fraudReason: fraudAnalysis.fraudReason
      };

      // Insert click event
      await db.insert(clickEvents).values(clickEvent);

      // Block IP if fraud detected
      if (fraudAnalysis.shouldBlock) {
        await this.blockIpAddress({
          ipAddress: clickData.ipAddress,
          reason: fraudAnalysis.fraudReason || 'Fraud detected',
          riskScore: fraudAnalysis.riskScore,
          isVpn: fraudAnalysis.isVpn,
          isProxy: fraudAnalysis.isProxy,
          country: fraudAnalysis.country,
          city: fraudAnalysis.city,
          userAgent: clickData.userAgent,
          isActive: true
        });

        // Add to Google Ads exclusions
        await this.addGoogleAdsExclusion(clickData.ipAddress, fraudAnalysis.fraudReason || 'Fraud detected');
      }

      return {
        allowed: !fraudAnalysis.shouldBlock,
        reason: fraudAnalysis.fraudReason,
        riskScore: fraudAnalysis.riskScore
      };

    } catch (error) {
      console.error('Error recording click event:', error);
      return {
        allowed: true,
        reason: 'Analysis failed',
        riskScore: 0
      };
    }
  }

  /**
   * Block IP address
   */
  async blockIpAddress(blockData: InsertBlockedIp): Promise<void> {
    try {
      await db.insert(blockedIps).values(blockData).onConflictDoUpdate({
        target: blockedIps.ipAddress,
        set: {
          reason: blockData.reason,
          riskScore: blockData.riskScore,
          isVpn: blockData.isVpn,
          isProxy: blockData.isProxy,
          country: blockData.country,
          city: blockData.city,
          userAgent: blockData.userAgent,
          isActive: true,
          lastClickAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error blocking IP address:', error);
    }
  }

  /**
   * Add IP to Google Ads exclusions
   */
  async addGoogleAdsExclusion(ipAddress: string, reason: string): Promise<void> {
    try {
      // Get all active campaigns (this would need to be configured)
      const campaignIds = process.env.GOOGLE_ADS_CAMPAIGN_IDS?.split(',') || [];
      
      for (const campaignId of campaignIds) {
        // Record the exclusion attempt
        await db.insert(googleAdsExclusions).values({
          campaignId: campaignId.trim(),
          campaignName: `Campaign ${campaignId}`,
          excludedIpAddress: ipAddress,
          exclusionReason: reason,
          status: 'pending',
          isActive: true
        });

        // TODO: Implement Google Ads API integration to actually exclude the IP
        // This would require proper Google Ads API setup and authentication
      }
    } catch (error) {
      console.error('Error adding Google Ads exclusion:', error);
    }
  }

  /**
   * Get fraud detection statistics
   */
  async getFraudStats(): Promise<{
    totalClicks: number;
    fraudulentClicks: number;
    blockedIps: number;
    topFraudReasons: Array<{ reason: string; count: number }>;
    clicksByCountry: Array<{ country: string; clicks: number; fraudulent: number }>;
  }> {
    try {
      const [totalClicks] = await db
        .select({ count: count() })
        .from(clickEvents);

      const [fraudulentClicks] = await db
        .select({ count: count() })
        .from(clickEvents)
        .where(eq(clickEvents.isFraudulent, true));

      const [blockedIpsCount] = await db
        .select({ count: count() })
        .from(blockedIps)
        .where(eq(blockedIps.isActive, true));

      const topFraudReasons = await db
        .select({
          reason: blockedIps.reason,
          count: count()
        })
        .from(blockedIps)
        .where(eq(blockedIps.isActive, true))
        .groupBy(blockedIps.reason)
        .orderBy(desc(count()))
        .limit(10);

      const clicksByCountry = await db
        .select({
          country: clickEvents.country,
          clicks: count(),
          fraudulent: sql<number>`COUNT(CASE WHEN ${clickEvents.isFraudulent} = true THEN 1 END)`
        })
        .from(clickEvents)
        .where(sql`${clickEvents.country} IS NOT NULL`)
        .groupBy(clickEvents.country)
        .orderBy(desc(count()))
        .limit(20);

      return {
        totalClicks: totalClicks.count,
        fraudulentClicks: fraudulentClicks.count,
        blockedIps: blockedIpsCount.count,
        topFraudReasons,
        clicksByCountry
      };
    } catch (error) {
      console.error('Error getting fraud stats:', error);
      return {
        totalClicks: 0,
        fraudulentClicks: 0,
        blockedIps: 0,
        topFraudReasons: [],
        clicksByCountry: []
      };
    }
  }

  /**
   * Initialize default fraud detection rules
   */
  async initializeDefaultRules(): Promise<void> {
    const defaultRules = [
      {
        ruleName: 'High Click Frequency',
        description: 'Detect IPs with more than 10 clicks per minute',
        ruleType: 'behavioral',
        conditions: {
          clicksPerMinute: { min: 10 },
          action: 'block'
        },
        action: 'block',
        severity: 8
      },
      {
        ruleName: 'VPN Detection',
        description: 'Block traffic from VPN services',
        ruleType: 'ip_based',
        conditions: {
          isVpn: true,
          action: 'flag'
        },
        action: 'flag',
        severity: 6
      },
      {
        ruleName: 'Bot Detection',
        description: 'Block identified bot traffic',
        ruleType: 'behavioral',
        conditions: {
          isBot: true,
          action: 'block'
        },
        action: 'block',
        severity: 9
      },
      {
        ruleName: 'Fast Click Pattern',
        description: 'Detect clicks faster than 800ms',
        ruleType: 'behavioral',
        conditions: {
          clickDuration: { max: 800 },
          action: 'flag'
        },
        action: 'flag',
        severity: 7
      }
    ];

    for (const rule of defaultRules) {
      try {
        await db.insert(fraudDetectionRules).values({
          ...rule,
          isActive: true
        }).onConflictDoNothing();
      } catch (error) {
        console.error('Error inserting default rule:', error);
      }
    }
  }
}

export const fraudDetectionService = new FraudDetectionService();