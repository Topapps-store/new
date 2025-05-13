import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; // Using routes with auth endpoints
import { setupVite, serveStatic, log } from "./vite";
import { setupAcmeChallengeRoutes } from "./acme-challenge";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Force HTTPS redirection in production
app.use((req, res, next) => {
  // Skip for localhost and development
  if (
    app.get("env") !== "production" || 
    req.headers.host?.includes("localhost") || 
    req.headers.host?.includes("repl.co") ||
    req.secure || 
    req.headers["x-forwarded-proto"] === "https"
  ) {
    return next();
  }
  
  // Redirect to HTTPS
  log(`Redirecting ${req.method} ${req.url} to HTTPS`);
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// Add security headers
app.use((req, res, next) => {
  // Add Strict-Transport-Security to enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Set content security policy - relaxed for React application needs
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: blob: 'unsafe-inline'; connect-src * 'unsafe-inline'; frame-src *;");
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Setup ACME challenge routes for SSL certificate verification
setupAcmeChallengeRoutes(app);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
