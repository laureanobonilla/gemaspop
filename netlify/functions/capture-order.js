const { PACKS, CURRENCY, BASE, token, json } = require('./lib/paypal');
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { ok: false });
    const { orderID } = JSON.parse(event.body || '{}');
    if (!orderID) return json(400, { ok: false });
    const r = await fetch(BASE + '/v2/checkout/orders/' + encodeURIComponent(orderID) + '/capture', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' },
    });
    const d = await r.json();
    const cap = d.purchase_units && d.purchase_units[0] && d.purchase_units[0].payments.captures[0];
    const pk = cap && PACKS[cap.custom_id];
    // Solo se entregan monedas si PayPal confirma COMPLETED y el monto coincide con el precio real.
    // Una orden no puede capturarse dos veces, así que no se puede repetir para ganar monedas.
    if (d.status === 'COMPLETED' && cap.status === 'COMPLETED' && pk &&
        cap.amount.value === pk.price && cap.amount.currency_code === CURRENCY)
      return json(200, { ok: true, coins: pk.coins, passDays: pk.passDays || 0 });
    return json(402, { ok: false });
  } catch (e) { return json(500, { ok: false }); }
};