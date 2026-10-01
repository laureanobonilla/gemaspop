// Entrega el Client ID de PayPal (es público por diseño) leyéndolo de la variable de Netlify.
// El Secret NUNCA se expone aquí.
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify({ clientId: process.env.PAYPAL_CLIENT_ID || '' }),
});