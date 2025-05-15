/**
 * Authentication Routes
 * 
 * API endpoints for user authentication
 */

import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcrypt';
import { createDbClient } from '../db';
import { users, insertUserSchema } from '../../../shared/schema';
import type { ApiResponse, User } from '../../../shared/schema';

// In-memory session store (for Cloudflare workers which don't have persistent storage)
// Note: In a production environment with multiple workers, you'd use KV or D1
const sessions: Record<string, { userId: number; expiresAt: number }> = {};

// Authentication middleware
export function authMiddleware(req: any, res: any, next: () => void) {
  try {
    // Check for session token
    const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionToken || !sessions[sessionToken]) {
      req.user = null;
      return next();
    }
    
    // Check if session is expired
    if (sessions[sessionToken].expiresAt < Date.now()) {
      delete sessions[sessionToken];
      req.user = null;
      return next();
    }
    
    // Set user ID on request
    req.userId = sessions[sessionToken].userId;
    next();
  } catch (error) {
    console.error('[Auth] Middleware error:', error);
    req.user = null;
    next();
  }
}

// Generate a random session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function registerAuthRoutes(router: any) {
  // Register new user
  router.post('/auth/register', async (req: any, res: any) => {
    try {
      // Validate request body against schema
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user data',
          details: result.error.errors,
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { username, password } = result.data;
      const { db } = createDbClient();
      
      // Check if username already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Username already exists',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Hash password
      const hashedPassword = await hash(password, 10);
      
      // Create user
      const [user] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          isAdmin: false,
        })
        .returning();
      
      // Create session
      const sessionToken = generateSessionToken();
      sessions[sessionToken] = {
        userId: user.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token: sessionToken,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Login user
  router.post('/auth/login', async (req: any, res: any) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      const { db } = createDbClient();
      
      // Get user by username
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Compare passwords
      const passwordMatch = await compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password',
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
      }
      
      // Create session
      const sessionToken = generateSessionToken();
      sessions[sessionToken] = {
        userId: user.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token: sessionToken,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Auth] Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Logout user
  router.post('/auth/logout', async (req: any, res: any) => {
    try {
      const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '');
      
      if (sessionToken && sessions[sessionToken]) {
        delete sessions[sessionToken];
      }
      
      res.json({
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to logout',
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>);
    }
  });
  
  // Get current user
  router.get('/auth/check', async (req: any, res: any) => {
    try {
      const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!sessionToken || !sessions[sessionToken]) {
        return res.json({
          authenticated: false,
        });
      }
      
      // Check if session is expired
      if (sessions[sessionToken].expiresAt < Date.now()) {
        delete sessions[sessionToken];
        return res.json({
          authenticated: false,
        });
      }
      
      const { db } = createDbClient();
      
      // Get user by ID
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, sessions[sessionToken].userId));
      
      if (!user) {
        delete sessions[sessionToken];
        return res.json({
          authenticated: false,
        });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        authenticated: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('[Auth] Check error:', error);
      res.status(500).json({
        authenticated: false,
        error: 'Failed to check authentication',
      });
    }
  });
}