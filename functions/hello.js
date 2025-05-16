// Función de prueba simple para verificar que Cloudflare Functions está funcionando
export function onRequest(context) {
  return new Response(JSON.stringify({
    message: "Hello from Cloudflare Functions!",
    timestamp: new Date().toISOString()
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}