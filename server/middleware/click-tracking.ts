import { Request, Response, NextFunction } from 'express';
import { fraudDetectionService } from '../services/fraud-detection';
import { InsertClickEvent } from '@shared/schema';

// Extend Request interface to include click tracking data
declare global {
  namespace Express {
    interface Request {
      clickData?: {
        ipAddress: string;
        userAgent: string;
        referrer: string;
        sessionId: string;
        country?: string;
        city?: string;
        screenResolution?: string;
        timezone?: string;
        language?: string;
      };
    }
  }
}

/**
 * Middleware to extract client information for click tracking
 */
export function extractClickData(req: Request, res: Response, next: NextFunction) {
  try {
    // Get real IP address (handle proxy headers)
    const ipAddress = getClientIpAddress(req);
    
    // Extract browser information
    const userAgent = req.get('User-Agent') || '';
    const referrer = req.get('Referer') || '';
    
    // Generate or extract session ID
    const sessionId = req.sessionID || generateSessionId();
    
    // Extract additional data from headers or request
    const acceptLanguage = req.get('Accept-Language') || '';
    const language = acceptLanguage.split(',')[0]?.split('-')[0] || 'en';
    
    // Store click data in request object
    req.clickData = {
      ipAddress,
      userAgent,
      referrer,
      sessionId,
      language
    };
    
    next();
  } catch (error) {
    console.error('Error extracting click data:', error);
    next();
  }
}

/**
 * Middleware to track click events and perform fraud detection
 */
export async function trackClickEvent(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.clickData) {
      return next();
    }

    const appId = req.params.appId || req.body.appId;
    if (!appId) {
      return next();
    }

    // Prepare click event data
    const clickEventData: InsertClickEvent = {
      appId,
      ipAddress: req.clickData.ipAddress,
      userAgent: req.clickData.userAgent,
      referrer: req.clickData.referrer,
      sessionId: req.clickData.sessionId,
      language: req.clickData.language,
      screenResolution: req.body.screenResolution,
      timezone: req.body.timezone,
      clickDuration: req.body.clickDuration,
      mouseMovements: req.body.mouseMovements || 0,
      keyboardEvents: req.body.keyboardEvents || 0,
      scrollEvents: req.body.scrollEvents || 0,
      conversionTracked: false
    };

    // Perform fraud detection
    const fraudResult = await fraudDetectionService.recordClickEvent(clickEventData);

    if (!fraudResult.allowed) {
      // Block the request if fraud is detected
      return res.status(403).json({
        error: 'Access denied',
        reason: 'Suspicious activity detected',
        riskScore: fraudResult.riskScore
      });
    }

    // Add fraud result to request for further processing
    req.fraudResult = {
      allowed: fraudResult.allowed,
      riskScore: fraudResult.riskScore,
      reason: fraudResult.reason
    };

    next();
  } catch (error) {
    console.error('Error tracking click event:', error);
    next();
  }
}

/**
 * Middleware to block requests from known fraudulent IPs
 */
export async function blockFraudulentIps(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.clickData) {
      return next();
    }

    const ipAddress = req.clickData.ipAddress;
    
    // Quick check against blocked IPs
    const fraudAnalysis = await fraudDetectionService.analyzeIpAddress(ipAddress);
    
    if (fraudAnalysis.shouldBlock) {
      return res.status(403).json({
        error: 'Access denied',
        reason: 'IP address blocked due to suspicious activity',
        riskScore: fraudAnalysis.riskScore
      });
    }

    next();
  } catch (error) {
    console.error('Error checking blocked IPs:', error);
    next();
  }
}

/**
 * Get client IP address, handling various proxy scenarios
 */
function getClientIpAddress(req: Request): string {
  const forwarded = req.get('X-Forwarded-For');
  const real = req.get('X-Real-IP');
  const cloudflare = req.get('CF-Connecting-IP');
  
  if (cloudflare) {
    return cloudflare;
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Generate a session ID if not available
 */
function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Rate limiting middleware to prevent excessive requests
 */
export function rateLimitClicks(windowMs: number = 60000, maxClicks: number = 10) {
  const clickCounts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.clickData) {
        return next();
      }

      const ipAddress = req.clickData.ipAddress;
      const now = Date.now();
      const resetTime = now + windowMs;

      // Clean up old entries
      for (const [ip, data] of clickCounts.entries()) {
        if (now > data.resetTime) {
          clickCounts.delete(ip);
        }
      }

      // Check current IP
      const currentData = clickCounts.get(ipAddress);
      
      if (!currentData) {
        clickCounts.set(ipAddress, { count: 1, resetTime });
        return next();
      }

      if (currentData.count >= maxClicks) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many clicks from this IP address',
          retryAfter: Math.ceil((currentData.resetTime - now) / 1000)
        });
      }

      currentData.count++;
      clickCounts.set(ipAddress, currentData);
      
      next();
    } catch (error) {
      console.error('Error in rate limiting:', error);
      next();
    }
  };
}

// Extend Request interface for fraud result
declare global {
  namespace Express {
    interface Request {
      fraudResult?: {
        allowed: boolean;
        riskScore: number;
        reason?: string;
      };
    }
  }
}