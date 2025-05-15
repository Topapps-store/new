// Cloudflare Pages Function - Catch-all route handler
// Este archivo maneja todas las rutas que no son API para permitir el routing SPA

import { default as handler } from './api.js';

export function onRequest(context) {
  // Verificar si es una solicitud de archivo estático
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Si es una solicitud de API, enviarla al controlador API
  if (path.startsWith('/api/')) {
    return handler.fetch(context.request, context.env, context);
  }
  
  // Para extensiones de archivo estáticas, permitir que Cloudflare Pages las maneje
  const staticExtensions = ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'];
  if (staticExtensions.some(ext => path.endsWith(ext))) {
    return context.next();
  }
  
  // Para todas las demás rutas, permitir que el SPA maneje la navegación del lado del cliente
  // Cloudflare Pages servirá index.html automáticamente gracias al archivo _redirects
  return context.next();
}