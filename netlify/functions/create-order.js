const { PACKS, CURRENCY, BASE, token, json } = require('./lib/paypal');
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
    const { pack, redirect } = JSON.parse(event.body || '{}');
    const pk = PACKS[pack];
    if (!pk) return json(400, { error: 'pack' });
    const body = {
      intent: 'CAPTURE',
      purchase_units: [{ custom_id: pack, description: pk.name, amount: { currency_code: CURRENCY, value: pk.price } }],
    };
    if (redirect) {
      // Modo página completa: PayPal devuelve al jugador a tu sitio con ?pp=ok&token=ORDEN
      const site = process.env.URL || event.headers.origin || ('https://' + event.headers.host);
      body.payment_source = { paypal: { experience_context: {
        brand_name: 'Gemas Pop',
        user_action: 'PAY_NOW',
        landing_page: 'GUEST_CHECKOUT',
        shipping_preference: 'NO_SHIPPING',
        return_url: site + '/?pp=ok',
        cancel_url: site + '/?pp=cancel',
      } } };
    }
    const r = await fetch(BASE + '/v2/checkout/orders', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    if (!d.id) return json(502, { error: 'paypal' });
    const link = (d.links || []).find(l => l.rel === 'payer-action' || l.rel === 'approve');
    return json(200, { id: d.id, url: link ? link.href : undefined });
  } catch (e) { return json(500, { error: 'server' }); }
};