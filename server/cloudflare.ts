import express from 'express';
import { registerRoutes } from "./routes";
import { setupAcmeChallengeRoutes } from "./acme-challenge";
import path from 'path';
import * as fs from 'fs';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up ACME challenge routes for SSL verification
setupAcmeChallengeRoutes(app);

// Set up API routes
registerRoutes(app);

// Serve static files from the client/dist directory
const staticDir = path.join(process.cwd(), 'client', 'dist');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir, {
    index: false, // Don't auto-serve index.html
    setHeaders: (res, filePath) => {
      // Set cache control headers for static assets
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0');
      } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      }
    }
  }));
  
  // For any other request, serve the index.html file (client-side routing)
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    try {
      res.sendFile(path.join(staticDir, 'index.html'));
    } catch (error) {
      console.error('Error serving index.html:', error);
      res.status(500).send('Error serving application');
    }
  });
}

// Cloudflare Pages Functions handler
export default {
  async fetch(request: Request, env: any, ctx: any) {
    try {
      // Add environment variables to process.env for compatibility
      if (typeof process === 'undefined' || !process.env) {
        (globalThis as any).process = { env: {} };
      }
      
      // Map Cloudflare environment variables to process.env
      if (env) {
        Object.keys(env).forEach(key => {
          process.env[key] = env[key];
        });
        
        // Ensure critical environment variables are set
        if (env.DATABASE_URL) {
          process.env.DATABASE_URL = env.DATABASE_URL;
        }
        
        // Set NODE_ENV if not already set
        if (!process.env.NODE_ENV) {
          process.env.NODE_ENV = 'production';
        }
      }
      
      // Create a URL object from the request URL
      const url = new URL(request.url);
      
      // Handle API health check separately for quick response
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      // Handle the request using Express
      return await new Promise((resolve) => {
        const expressReq = createRequest(request, url);
        const expressRes = createResponse(resolve);
        
        app(expressReq, expressRes);
      });
    } catch (err) {
      // Enhanced error handling
      console.error('Cloudflare function error:', err);
      
      // Safely extract error message
      const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
      
      return new Response(JSON.stringify({
        error: errorMessage,
        path: new URL(request.url).pathname,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// Helper functions to adapt between Fetch API and Express
function createRequest(request: Request, url: URL) {
  const expressReq: any = {
    method: request.method,
    url: url.pathname + url.search,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: Object.fromEntries(request.headers),
    body: null, // Will be populated asynchronously if needed
    connection: {
      remoteAddress: request.headers.get('CF-Connecting-IP') || '0.0.0.0'
    }
  };
  
  return expressReq;
}

function createResponse(resolve: (response: Response) => void) {
  let statusCode = 200;
  let headers = new Headers();
  let body: any[] = [];
  
  const expressRes: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    set(name: string, value: string) {
      headers.set(name, value);
      return this;
    },
    get(name: string) {
      return headers.get(name);
    },
    write(chunk: any) {
      body.push(chunk);
      return this;
    },
    end(data?: any) {
      if (data) body.push(data);
      
      const responseBody = body.join('');
      resolve(new Response(responseBody, {
        status: statusCode,
        headers
      }));
    },
    json(data: any) {
      headers.set('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    },
    send(data: any) {
      if (typeof data === 'object') {
        return this.json(data);
      }
      this.end(data);
    },
    sendFile(filePath: string) {
      // Simple file sending implementation
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.json') contentType = 'application/json';
        
        headers.set('Content-Type', contentType);
        this.end(content);
      } catch (error) {
        this.status(404).end('File not found');
      }
    }
  };
  
  return expressRes;
}