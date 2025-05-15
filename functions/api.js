// Cloudflare Pages Function
import express from 'express';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';
import { setupAcmeChallengeRoutes } from '../server/acme-challenge.js';

// Configurar neon para WebSockets
globalThis.WebSocket = ws;

// Crear app Express
const app = express();
app.use(express.json());

// Respuesta para verificación de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Configurar rutas y base de datos
async function setupApp() {
  try {
    // Configurar base de datos si DATABASE_URL está disponible
    if (process.env.DATABASE_URL) {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const db = drizzle(pool, { schema });
      
      // Importar dinámicamente el storage y routes
      // Nota: En Cloudflare, usamos import() dinámico porque requiere módulos ESM
      const { storage } = await import('../server/storage.js');
      const { registerRoutes } = await import('../server/routes.js');
      
      // Configurar rutas
      await registerRoutes(app);
      
      // Configurar rutas ACME para SSL
      setupAcmeChallengeRoutes(app);
    } else {
      app.use('/api', (req, res) => {
        res.status(500).json({ error: "No se ha configurado DATABASE_URL" });
      });
    }
    
    // Ruta de captura para rutas desconocidas
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });
  } catch (error) {
    console.error("Error al configurar la aplicación:", error);
    app.use('/api', (req, res) => {
      res.status(500).json({ 
        error: "Error al inicializar la API",
        message: error.message 
      });
    });
  }
}

// Inicializar la aplicación
let appInitialized = false;
let initPromise = null;

// Adaptadores para Cloudflare Functions
function adaptRequest(request, url) {
  return {
    method: request.method,
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers),
    body: request.body,
    query: Object.fromEntries(url.searchParams),
    path: url.pathname,
    ip: request.headers.get('CF-Connecting-IP') || '0.0.0.0'
  };
}

function adaptResponse(resolve) {
  const res = {
    statusCode: 200,
    headers: new Headers(),
    body: [],
    
    status(code) {
      this.statusCode = code;
      return this;
    },
    
    set(name, value) {
      this.headers.set(name, value);
      return this;
    },
    
    json(data) {
      this.headers.set('Content-Type', 'application/json');
      this.body = [JSON.stringify(data)];
      this.end();
    },
    
    send(data) {
      if (typeof data === 'object') {
        return this.json(data);
      }
      this.body = [data];
      this.end();
    },
    
    end(data) {
      if (data) this.body.push(data);
      const responseBody = this.body.join('');
      resolve(new Response(responseBody, {
        status: this.statusCode,
        headers: this.headers
      }));
    }
  };
  
  return res;
}

// Función principal de Cloudflare
export default {
  async fetch(request, env, ctx) {
    try {
      // Establecer variables de entorno
      if (!process.env) {
        process.env = {};
      }
      
      // Copiar variables de entorno de Cloudflare a process.env
      if (env) {
        Object.keys(env).forEach(key => {
          process.env[key] = env[key];
        });
      }
      
      // Comprobar salud rápidamente sin inicializar toda la app
      const url = new URL(request.url);
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          deployment: 'cloudflare'
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      // Inicializar la app solo una vez
      if (!appInitialized) {
        if (!initPromise) {
          initPromise = setupApp().then(() => {
            appInitialized = true;
          });
        }
        await initPromise;
      }
      
      // Procesar la solicitud con Express
      return await new Promise(resolve => {
        const expressReq = adaptRequest(request, url);
        const expressRes = adaptResponse(resolve);
        
        app(expressReq, expressRes);
      });
    } catch (error) {
      console.error("Error en Cloudflare function:", error);
      
      return new Response(JSON.stringify({
        error: error.message || "Error interno del servidor",
        path: new URL(request.url).pathname,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}