import express, { type Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";
import { getApps, getAppById, getPopularApps, getRecentApps, getRelatedApps, searchApps, getJustInTimeApps } from "./data/apps";
import { getCategories, getCategoryById, getAppsByCategory } from "./data/categories";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  
  // Apps endpoints
  apiRouter.get("/apps", (req, res) => {
    res.json(getApps());
  });
  
  apiRouter.get("/apps/popular", (req, res) => {
    res.json(getPopularApps());
  });
  
  apiRouter.get("/apps/recent", (req, res) => {
    res.json(getRecentApps());
  });
  
  apiRouter.get("/apps/just-in-time", (req, res) => {
    res.json(getJustInTimeApps());
  });
  
  apiRouter.get("/apps/related/:id", (req, res) => {
    res.json(getRelatedApps(req.params.id));
  });
  
  // This route must come after the more specific routes
  apiRouter.get("/apps/:id", (req, res) => {
    const app = getAppById(req.params.id);
    if (app) {
      res.json(app);
    } else {
      res.status(404).json({ message: "App not found" });
    }
  });
  
  // Categories endpoints
  apiRouter.get("/categories", (req, res) => {
    res.json(getCategories());
  });
  
  apiRouter.get("/categories/:id", (req, res) => {
    const category = getCategoryById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  });
  
  apiRouter.get("/categories/:id/apps", (req, res) => {
    res.json(getAppsByCategory(req.params.id));
  });
  
  // Search endpoint
  apiRouter.get("/search", (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    res.json(searchApps(query));
  });
  
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
