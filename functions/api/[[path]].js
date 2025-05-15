// Cloudflare Pages Function - API route handler
// Este archivo maneja todas las rutas de API dinámicas
// Simplemente reenvía las solicitudes a la función principal

import { default as handler } from '../api.js';

export function onRequest(context) {
  return handler.fetch(context.request, context.env, context);
}