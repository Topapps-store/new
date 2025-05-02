import { Request, Response } from 'express';
import { storage } from '../storage';
import { compareSync, hashSync } from 'bcrypt';
import session from 'express-session';

// Add session support to Express Request
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

/**
 * Login a user
 */
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = compareSync(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Set user in session
    req.session.userId = user.id;
    req.session.isAdmin = user.isAdmin;
    
    // Return user info (omitting password)
    return res.status(200).json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
}

/**
 * Check if user is logged in
 */
export async function checkAuth(req: Request, res: Response) {
  if (!req.session.userId) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ authenticated: false });
    }
    
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ message: 'Server error during auth check' });
  }
}

/**
 * Logout user
 */
export function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

/**
 * Auth middleware
 */
export function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

/**
 * Admin middleware
 */
export function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}