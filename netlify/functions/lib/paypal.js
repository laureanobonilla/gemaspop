// Precios y monedas VIVEN AQUÍ (servidor): el navegador no puede alterarlos.
const PACKS = {
  p1: { name: '300 monedas', price: '1.99', coins: 300 },
  p2: { name: '500 monedas', price: '2.99', coins: 500 },
  p4: { name: 'Pack inicial (oferta única)', price: '1.99', coins: 500 },
  p3: { name: 'Vidas ilimitadas 7 días', price: '2.99', coins: 0, passDays: 7 },
};
const CURRENCY = 'USD';
const BASE = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
async function token() {
  const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64');
  const r = await fetch(BASE + '/v1/oauth2/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const d = await r.json();
  if (!d.access_token) throw new Error('PayPal auth failed');
  return d.access_token;
}
const json = (code, body) => ({ statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
module.exports = { PACKS, CURRENCY, BASE, token, json };