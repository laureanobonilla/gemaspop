# Gemas Pop – guía de cobro con PayPal + Netlify

IMPORTANTE: arrastrar la carpeta a Netlify Drop NO activa las funciones de pago. Usa GitHub o la CLI.

## 1. PayPal
1. developer.paypal.com → Apps & Credentials → Create App (empieza en Sandbox).
2. Copia el Client ID y el Secret.
3. Tarjeta: con tu cuenta Business los clientes ven el botón "Débito o tarjeta de crédito" (pago como invitado, según país). Para formulario de tarjeta propio activa "Advanced Credit and Debit Card Payments" en tu cuenta.

## 2. Netlify
1. Sube esta carpeta a un repositorio de GitHub → Netlify → Add new site → Import from Git (no cambies nada: netlify.toml ya está listo).
   Alternativa: `npm i -g netlify-cli` y luego `netlify deploy --prod` dentro de la carpeta.
2. Site configuration → Environment variables:
   - PAYPAL_CLIENT_ID = tu Client ID
   - PAYPAL_SECRET = tu Secret
   - PAYPAL_ENV = sandbox (pruebas) o live (cobro real)
3. En public/index.html pon tu Client ID en `paypalClientId` (el mismo, es público) y vuelve a desplegar.

## 3. Probar y salir a producción
- Compra de prueba con una cuenta Personal de Sandbox.
- Para cobrar de verdad: crea la app en modo Live, cambia ambas variables y el Client ID, y despliega de nuevo.
- Cambiar precios/packs: lib/paypal.js (precio real) y CONFIG.packs en index.html (texto mostrado).
- Pack inicial (p4): la "oferta única" se controla en el navegador del jugador; el servidor no la limita.

## Limitaciones
- Monedas y "sin anuncios" se guardan en el navegador del jugador: un usuario técnico podría editarlos. Para evitarlo hacen falta cuentas de usuario y base de datos.
- Si cambia de dispositivo o borra datos, pierde sus monedas.
- Publica política de privacidad, términos y de reembolsos (PayPal y las leyes de consumo lo suelen exigir).
