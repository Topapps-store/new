import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";
import { getApps, getAppById, getPopularApps, getRecentApps, getRelatedApps, searchApps, getJustInTimeApps } from "./data/apps";
import { getCategories, getCategoryById, getAppsByCategory } from "./data/categories";
import session from "express-session";
import { login, logout, checkAuth, requireAuth, requireAdmin } from "./controllers/auth-controller";
import {
  getAppsForAdmin,
  getAppForAdmin,
  updateApp,
  syncApp,
  getAffiliateLinks,
  createAffiliateLink,
  updateAffiliateLink,
  deleteAffiliateLink,
  getAffiliateLinkAnalytics
} from "./controllers/admin-controller";
import { InsertAffiliateLink, insertAffiliateLinkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'topapps-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // API Routes
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.post("/auth/login", login);
  apiRouter.post("/auth/logout", logout);
  apiRouter.get("/auth/check", checkAuth);
  
  // Admin routes
  const adminRouter = express.Router();
  
  // Admin app routes
  adminRouter.get("/apps", requireAdmin, getAppsForAdmin);
  adminRouter.get("/apps/:id", requireAdmin, getAppForAdmin);
  adminRouter.put("/apps/:id", requireAdmin, updateApp);
  adminRouter.post("/apps/:id/sync", requireAdmin, syncApp);
  
  // Admin affiliate link routes
  adminRouter.get("/affiliate-links", requireAdmin, getAffiliateLinks);
  adminRouter.post("/affiliate-links", requireAdmin, (req, res, next) => {
    try {
      // Validate request body
      insertAffiliateLinkSchema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid affiliate link data", error });
    }
  }, createAffiliateLink);
  
  adminRouter.put("/affiliate-links/:id", requireAdmin, updateAffiliateLink);
  adminRouter.delete("/affiliate-links/:id", requireAdmin, deleteAffiliateLink);
  adminRouter.get("/affiliate-links/analytics", requireAdmin, getAffiliateLinkAnalytics);
  
  // Add admin router to API router
  apiRouter.use("/admin", adminRouter);
  
  // Public Apps endpoints
  apiRouter.get("/apps", async (req, res) => {
    try {
      const apps = await storage.getApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching apps" });
    }
  });
  
  apiRouter.get("/apps/popular", async (req, res) => {
    try {
      const apps = await storage.getPopularApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular apps" });
    }
  });
  
  apiRouter.get("/apps/recent", async (req, res) => {
    try {
      const apps = await storage.getRecentApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent apps" });
    }
  });
  
  apiRouter.get("/apps/just-in-time", async (req, res) => {
    try {
      const apps = await storage.getJustInTimeApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching just-in-time apps" });
    }
  });
  
  apiRouter.get("/apps/related/:id", async (req, res) => {
    try {
      const apps = await storage.getRelatedApps(req.params.id);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching related apps" });
    }
  });
  
  // This route must come after the more specific routes
  apiRouter.get("/apps/:id", async (req, res) => {
    try {
      const app = await storage.getAppById(req.params.id);
      if (app) {
        res.json(app);
      } else {
        res.status(404).json({ message: "App not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching app" });
    }
  });
  
  // Categories endpoints
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  
  apiRouter.get("/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategoryById(req.params.id);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });
  
  apiRouter.get("/categories/:id/apps", async (req, res) => {
    try {
      const apps = await storage.getAppsByCategory(req.params.id);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category apps" });
    }
  });
  
  // Search endpoint
  apiRouter.get("/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const apps = await storage.searchApps(query);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error searching apps" });
    }
  });
  
  // Affiliate link click tracking
  apiRouter.post("/affiliate-links/:id/click", async (req, res) => {
    try {
      const { id } = req.params;
      const link = await storage.incrementLinkClickCount(Number(id));
      if (link) {
        res.json({ success: true, url: link.url });
      } else {
        res.status(404).json({ message: "Affiliate link not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error tracking link click" });
    }
  });
  
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
