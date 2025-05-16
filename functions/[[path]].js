// Manejador para cualquier ruta que no sea /api
export function onRequest(context) {
  // Este manejador simplemente pasa la solicitud al siguiente manejador
  // que será Cloudflare Pages sirviendo los archivos estáticos
  return context.next();
}