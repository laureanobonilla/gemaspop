const { PACKS, CURRENCY, BASE, token, json } = require('./lib/paypal');
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
    const { pack } = JSON.parse(event.body || '{}');
    const pk = PACKS[pack];
    if (!pk) return json(400, { error: 'pack' });
    const r = await fetch(BASE + '/v2/checkout/orders', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ custom_id: pack, description: pk.name, amount: { currency_code: CURRENCY, value: pk.price } }],
      }),
    });
    const d = await r.json();
    return d.id ? json(200, { id: d.id }) : json(502, { error: 'paypal' });
  } catch (e) { return json(500, { error: 'server' }); }
};
