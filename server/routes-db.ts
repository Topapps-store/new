import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  
  // Apps endpoints
  apiRouter.get("/apps", async (req, res) => {
    try {
      const apps = await storage.getApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });
  
  apiRouter.get("/apps/popular", async (req, res) => {
    try {
      const apps = await storage.getPopularApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching popular apps:", error);
      res.status(500).json({ message: "Failed to fetch popular apps" });
    }
  });
  
  apiRouter.get("/apps/recent", async (req, res) => {
    try {
      const apps = await storage.getRecentApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching recent apps:", error);
      res.status(500).json({ message: "Failed to fetch recent apps" });
    }
  });
  
  apiRouter.get("/apps/related/:id", async (req, res) => {
    try {
      const apps = await storage.getRelatedApps(req.params.id);
      res.json(apps);
    } catch (error) {
      console.error(`Error fetching related apps for ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch related apps" });
    }
  });
  
  // This route must come after the more specific routes like /apps/popular, /apps/recent, and /apps/related/:id
  apiRouter.get("/apps/:id", async (req, res) => {
    try {
      const app = await storage.getAppById(req.params.id);
      if (app) {
        res.json(app);
      } else {
        res.status(404).json({ message: "App not found" });
      }
    } catch (error) {
      console.error(`Error fetching app ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });
  
  // Categories endpoints
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
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
      console.error(`Error fetching category ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  apiRouter.get("/categories/:id/apps", async (req, res) => {
    try {
      const apps = await storage.getAppsByCategory(req.params.id);
      res.json(apps);
    } catch (error) {
      console.error(`Error fetching apps for category ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch category apps" });
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
      console.error(`Error searching for apps with query ${req.query.q}:`, error);
      res.status(500).json({ message: "Failed to search apps" });
    }
  });
  
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}