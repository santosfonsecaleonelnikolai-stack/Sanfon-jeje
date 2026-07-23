// JS del cliente: calculadora, animaciones y buscadores. Sin dependencias.

function money(n) {
  return '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Escala una cantidad y muestra unidades sensatas (g<->kg, mL<->L).
function fmtQty(qty, unit) {
  let q = qty, u = unit;
  if (u === 'kg' && q < 1) { q = q * 1000; u = 'g'; }
  else if (u === 'g' && q >= 1000) { q = q / 1000; u = 'kg'; }
  else if (u === 'L' && q < 1) { q = q * 1000; u = 'mL'; }
  else if (u === 'mL' && q >= 1000) { q = q / 1000; u = 'L'; }
  return q.toLocaleString('es-MX', { maximumFractionDigits: 3 }) + ' ' + u;
}

// Conteo animado de un número (desde el valor previo guardado).
function countUp(el, to, fmt) {
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const from = parseFloat(el.dataset.v || '0');
  el.dataset.v = String(to);
  if (reduce || from === to) { el.textContent = fmt(to); return; }
  const dur = 420, t0 = performance.now();
  if (el._raf) cancelAnimationFrame(el._raf);
  function step(t) {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * eased);
    if (p < 1) el._raf = requestAnimationFrame(step);
  }
  el._raf = requestAnimationFrame(step);
}

function statTile(label, id) {
  return '<div class="stat"><div class="lbl">' + label + '</div>' +
    '<div class="val" id="' + id + '">—</div></div>';
}

let summaryBuilt = false;
function ensureSummary() {
  const box = document.getElementById('resSummary');
  if (!box || summaryBuilt) return;
  box.innerHTML = statTile('Costo total', 'stTotal') +
    statTile('Costo por litro', 'stPerL') +
    '<div class="stat"><div class="lbl">Ganancia estimada</div>' +
    '<div class="val" id="stProfit">—</div><div class="lbl" id="stMargin"></div></div>';
  summaryBuilt = true;
}

function recalc() {
  const f = window.__FORMULA__;
  if (!f) return;
  const target = parseFloat(document.getElementById('targetLiters').value) || 0;
  const sell = parseFloat(document.getElementById('sellPrice').value) || 0;
  const factor = f.yield ? target / f.yield : 0;

  document.getElementById('resTitle').textContent = f.name + ' — ' + target + ' L';

  let totalCost = 0;
  const rows = f.ingredients.map(function (ing) {
    const qty = ing.quantity * factor;
    const cost = qty * (ing.cost || 0);
    totalCost += cost;
    return '<tr><td>' + ing.name + '</td><td>' + fmtQty(qty, ing.unit) +
      '</td><td>' + money(cost) + '</td></tr>';
  }).join('');
  document.getElementById('resBody').innerHTML = rows;

  ensureSummary();
  const costPerLiter = target ? totalCost / target : 0;
  countUp(document.getElementById('stTotal'), totalCost, money);
  countUp(document.getElementById('stPerL'), costPerLiter, money);

  const profitEl = document.getElementById('stProfit');
  const marginEl = document.getElementById('stMargin');
  if (sell > 0) {
    const revenue = sell * target;
    const profit = revenue - totalCost;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    countUp(profitEl, profit, money);
    marginEl.textContent = margin.toFixed(0) + '% de margen';
  } else {
    profitEl.dataset.v = '0';
    profitEl.textContent = '—';
    marginEl.textContent = 'Ingresa precio de venta';
  }
}

// Buscador de tarjetas.
function filterCards(input, selector) {
  const q = input.value.toLowerCase().trim();
  document.querySelectorAll(selector).forEach(function (card) {
    card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// Revelado al hacer scroll.
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
}

// Efecto ripple en botones.
function initRipple() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = document.createElement('span');
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const rect = btn.getBoundingClientRect();
    r.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,.45);' +
      'transform:scale(0);animation:rippleAnim .6s ease-out;pointer-events:none;width:' + size + 'px;height:' + size +
      'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(r);
    setTimeout(function () { r.remove(); }, 600);
  });
}

// Brillo que sigue al cursor en las tarjetas de módulo.
function initCardGlow() {
  document.querySelectorAll('.mod-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.__FORMULA__) recalc();
  initReveal();
  initRipple();
  initCardGlow();
});
