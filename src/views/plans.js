// Vistas de planes y métodos de pago.

import { shell, esc, money } from './layout.js';
import { PLANS, planById, planTier } from '../permissions.js';

// ---- Página de planes (precios) ----
export function plansPage(user, { flash } = {}) {
  const currentTier = planTier(user);
  const isAdmin = user.role === 'admin';

  const cards = PLANS.map((plan) => {
    const owned = !isAdmin && currentTier >= plan.tier && currentTier > 0;
    const isCurrent = !isAdmin && planById(user.plan) && user.plan === plan.id;
    const feats = plan.features.map((f) =>
      `<li><span class="tick">✓</span> ${esc(f)}</li>`).join('');
    let cta;
    if (isAdmin) {
      cta = `<span class="btn secondary block" style="cursor:default">Eres administrador</span>`;
    } else if (isCurrent) {
      cta = `<span class="btn secondary block" style="cursor:default">✓ Tu plan actual</span>`;
    } else if (owned) {
      cta = `<span class="btn secondary block" style="cursor:default">Ya incluido</span>`;
    } else {
      cta = `<a class="btn block" href="/planes/checkout?plan=${plan.id}">Elegir ${esc(plan.name)}</a>`;
    }
    return `<div class="plan-card ${plan.highlight ? 'featured' : ''} reveal">
      ${plan.highlight ? '<div class="ribbon">★ Más elegido</div>' : ''}
      <div class="plan-name">${esc(plan.name)}</div>
      <p class="plan-tag">${esc(plan.tagline)}</p>
      <div class="plan-price"><span class="cur">$</span>${plan.price.toLocaleString('es-MX')}
        <span class="per">MXN · ${esc(plan.period)}</span></div>
      <ul class="plan-feats">${feats}</ul>
      ${cta}
    </div>`;
  }).join('');

  const head = isAdmin
    ? `<div class="alert ok">Como administrador ya tienes acceso a todos los módulos. Aquí ves cómo lucen los planes para tus clientes.</div>`
    : currentTier > 0
      ? `<div class="alert ok">Tienes el plan <b>${esc(planById(user.plan)?.name || '')}</b>. Puedes mejorarlo cuando quieras.</div>`
      : `<div class="alert warn">Aún no tienes un plan. Elige uno para desbloquear los módulos de la plataforma.</div>`;

  return shell({
    user, activeSlug: 'planes', title: 'Planes y pagos',
    body: `<div class="pagehead" style="text-align:center">
        <h2>Elige tu plan S&F</h2>
        <p class="muted">Un solo pago, acceso permanente. Sin mensualidades.</p>
      </div>
      ${flash ? `<div class="alert ok">${esc(flash)}</div>` : ''}
      ${head}
      <div class="plans-grid">${cards}</div>
      <div class="pay-badges">
        <span>💳 Tarjeta</span><span>🏦 Transferencia (SPEI)</span><span>🏪 Efectivo (OXXO)</span><span>🅿️ PayPal / Mercado Pago</span>
      </div>
      <p class="muted" style="text-align:center;margin-top:14px;font-size:.82rem">Pago seguro. Al contratar, tu acceso se activa de inmediato.</p>`,
  });
}

// ---- Checkout / métodos de pago ----
export function checkoutPage(user, planId, { error } = {}) {
  const plan = planById(planId);
  if (!plan) return null;

  return shell({
    user, activeSlug: 'planes', title: `Contratar ${plan.name}`,
    body: `<a href="/planes" class="muted">← Volver a planes</a>
      ${error ? `<div class="alert error" style="margin-top:12px">${esc(error)}</div>` : ''}
      <div class="checkout">
        <div class="checkout-main card">
          <h3 style="margin:0 0 4px">Método de pago</h3>
          <p class="muted" style="margin:0 0 18px">Elige cómo quieres pagar tu plan ${esc(plan.name)}.</p>
          <form method="POST" action="/planes/contratar" id="payForm">
            <input type="hidden" name="plan" value="${esc(plan.id)}">
            <div class="pay-methods">
              <label class="pay-opt">
                <input type="radio" name="method" value="tarjeta" checked onchange="showPay()">
                <span class="pm">💳<b>Tarjeta</b><small>Crédito o débito</small></span>
              </label>
              <label class="pay-opt">
                <input type="radio" name="method" value="transferencia" onchange="showPay()">
                <span class="pm">🏦<b>Transferencia</b><small>SPEI</small></span>
              </label>
              <label class="pay-opt">
                <input type="radio" name="method" value="efectivo" onchange="showPay()">
                <span class="pm">🏪<b>Efectivo</b><small>OXXO / tienda</small></span>
              </label>
              <label class="pay-opt">
                <input type="radio" name="method" value="paypal" onchange="showPay()">
                <span class="pm">🅿️<b>PayPal</b><small>Mercado Pago</small></span>
              </label>
            </div>

            <div id="pay-tarjeta" class="pay-body">
              <div class="field"><label>Nombre en la tarjeta</label><input name="card_name" placeholder="Como aparece en la tarjeta"></div>
              <div class="field"><label>Número de tarjeta</label><input name="card_num" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="19"></div>
              <div style="display:flex;gap:12px">
                <div class="field" style="flex:1"><label>Vencimiento</label><input name="card_exp" placeholder="MM/AA" maxlength="5"></div>
                <div class="field" style="flex:1"><label>CVV</label><input name="card_cvv" inputmode="numeric" placeholder="123" maxlength="4"></div>
              </div>
            </div>
            <div id="pay-transferencia" class="pay-body" style="display:none">
              <div class="alert ok" style="margin:0">Realiza una transferencia SPEI y tu acceso se activa al confirmar el pago.</div>
              <table style="margin-top:12px">
                <tr><td class="muted">Banco</td><td><b>BBVA</b></td></tr>
                <tr><td class="muted">CLABE</td><td><b>012 180 00000000000 0</b></td></tr>
                <tr><td class="muted">Beneficiario</td><td><b>S&F Industria de la Limpieza</b></td></tr>
                <tr><td class="muted">Concepto</td><td><b>Plan ${esc(plan.name)} · ${esc(user.email)}</b></td></tr>
              </table>
            </div>
            <div id="pay-efectivo" class="pay-body" style="display:none">
              <div class="alert warn" style="margin:0">Paga en efectivo en OXXO o tienda de conveniencia con la referencia que se genera al continuar.</div>
            </div>
            <div id="pay-paypal" class="pay-body" style="display:none">
              <div class="alert ok" style="margin:0">Serás dirigido a PayPal / Mercado Pago para completar tu pago de forma segura.</div>
            </div>

            <button class="btn block" type="submit" style="margin-top:8px">Pagar ${money(plan.price)} y activar acceso</button>
            <p class="muted" style="font-size:.78rem;text-align:center;margin-top:10px">🔒 Tus datos viajan cifrados. No se realiza ningún cargo real en esta demostración.</p>
          </form>
        </div>

        <aside class="checkout-side card">
          <h3 style="margin:0 0 14px">Resumen</h3>
          <div class="sum-row"><span>Plan ${esc(plan.name)}</span><b>${money(plan.price)}</b></div>
          <p class="muted" style="font-size:.85rem;margin:6px 0 0">${esc(plan.tagline)}</p>
          <ul class="plan-feats compact">${plan.features.slice(0, 4).map((f) => `<li><span class="tick">✓</span> ${esc(f)}</li>`).join('')}</ul>
          <div class="sum-total"><span>Total</span><b>${money(plan.price)}</b></div>
          <p class="muted" style="font-size:.78rem;margin:10px 0 0">Pago único · Acceso permanente</p>
        </aside>
      </div>
      <script>
        function showPay(){
          ['tarjeta','transferencia','efectivo','paypal'].forEach(function(m){
            var el=document.getElementById('pay-'+m);
            var on=document.querySelector('input[name=method]:checked').value===m;
            if(el) el.style.display=on?'block':'none';
          });
        }
      </script>`,
  });
}

// ---- Confirmación ----
export function paymentSuccessPage(user, plan) {
  return shell({
    user, activeSlug: 'planes', title: 'Pago confirmado',
    body: `<div class="success-wrap">
        <div class="success-check">✓</div>
        <h2>¡Listo, ${esc((user.full_name || user.email).split(' ')[0])}!</h2>
        <p class="muted">Tu plan <b>${esc(plan.name)}</b> quedó activo. Ya puedes usar todos los módulos incluidos.</p>
        <a class="btn" href="/panel">Ir a mis módulos →</a>
      </div>`,
  });
}
