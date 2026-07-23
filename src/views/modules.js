// Render de cada módulo de la plataforma.

import { shell, esc, nl2br, money, coverImg, moduleImage } from './layout.js';
import { all, filter, find } from '../db.js';
import { moduleBySlug } from '../permissions.js';

// Banda de portada con imagen (fallback a gradiente + emoji).
function head(mod, extra = '') {
  return `<div class="pagehead">
    <div class="cover-band">
      ${coverImg(moduleImage(mod.slug))}
      <span class="emoji">${mod.icon || ''}</span>
    </div>
    <h2>${esc(mod.name)}</h2>
    <p class="muted">${esc(mod.description || '')}</p>
    ${extra}
  </div>`;
}

// Elige imagen de producto por palabra clave del nombre.
function productImage(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('lavatrast') || n.includes('trast')) return 'img/product-lavatrastes.png';
  if (n.includes('multiuso') || n.includes('desinfect')) return 'img/product-multiusos.png';
  if (n.includes('suavizante')) return 'img/product-suavizante.png';
  return null;
}

// ---- Formulación ----
function formulacion(user, mod) {
  const formulas = filter('formulas', (f) => f.is_published !== false);
  const cards = formulas.map((f) => {
    const ings = filter('formula_ingredients', (i) => i.formula_id === f.id)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const rows = ings.map((i) =>
      `<tr><td>${esc(i.ingredient_name)}</td><td>${i.quantity} ${esc(i.unit)}</td></tr>`).join('');
    return `<div class="card hover">
      <h3 style="margin:0 0 4px">${esc(f.name)}</h3>
      <p class="muted" style="margin:0 0 10px">${esc(f.description || '')}</p>
      <span class="badge grad">Rinde ${f.yield_liters} L</span>
      <table style="margin:12px 0"><thead><tr><th>Ingrediente</th><th>Cantidad</th></tr></thead>
        <tbody>${rows}</tbody></table>
      <details><summary style="cursor:pointer;font-weight:600;color:var(--syf-green-700)">Procedimiento y seguridad</summary>
        <p style="margin:10px 0 4px"><b>Elaboración:</b></p>
        <p class="muted" style="margin:0">${nl2br(f.procedure)}</p>
        ${f.safety_notes ? `<div class="alert warn" style="margin-top:10px">⚠️ ${esc(f.safety_notes)}</div>` : ''}
      </details>
      <a class="btn small" style="margin-top:14px" href="/modulos/calculadora?formula=${f.id}">🧮 Calcular esta fórmula</a>
    </div>`;
  }).join('');
  return head(mod) + (formulas.length ? `<div class="grid cols-2 stagger">${cards}</div>`
    : `<div class="alert warn">Aún no hay fórmulas. El administrador puede agregarlas.</div>`);
}

// ---- Productos ----
function productos(user, mod) {
  const products = filter('products', (p) => p.is_published !== false);
  const cards = products.map((p) => {
    const img = productImage(p.name);
    const pres = (p.presentations || []).map((x) =>
      `<tr><td>${esc(x.size)}</td><td><b>${money(x.price)}</b></td></tr>`).join('');
    return `<div class="mod-card">
      <div class="mod-cover" style="height:180px">
        ${img ? coverImg(img, { style: 'object-fit:contain;padding:14px' }) : ''}
        ${!img ? '<span class="emoji">🧴</span>' : ''}
      </div>
      <div class="mod-body">
        <span class="badge">${esc(p.category || 'Producto')}</span>
        <h3 style="margin:8px 0 4px">${esc(p.name)}</h3>
        <p style="min-height:auto">${esc(p.description || '')}</p>
        <table style="margin-top:10px"><thead><tr><th>Presentación</th><th>Precio</th></tr></thead><tbody>${pres}</tbody></table>
        ${p.usage_instructions ? `<p style="margin:10px 0 0;font-size:.85rem"><b>Uso:</b> ${esc(p.usage_instructions)}</p>` : ''}
      </div>
    </div>`;
  }).join('');
  return head(mod) + (products.length ? `<div class="grid cols-2 stagger">${cards}</div>`
    : `<div class="alert warn">Aún no hay productos cargados.</div>`);
}

// ---- Artículos (marketing / formas de venta) ----
function articulos(user, mod) {
  const items = filter('articles', (a) => a.module_slug === mod.slug && a.is_published !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const cards = items.map((a, idx) => `<div class="card hover">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="flex:0 0 auto;width:34px;height:34px;border-radius:10px;background:var(--grad-lime);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-family:Poppins">${idx + 1}</div>
        <div>
          <h3 style="margin:0 0 6px">${esc(a.title)}</h3>
          <p style="margin:0">${nl2br(a.body)}</p>
        </div>
      </div>
    </div>`).join('');
  return head(mod) + (items.length ? `<div class="grid stagger">${cards}</div>`
    : `<div class="alert warn">Aún no hay contenido en este módulo.</div>`);
}

// ---- Máquinas / equipo mínimo ----
function maquinas(user, mod) {
  const isEquipo = mod.slug === 'equipo-minimo';
  const items = filter('machines', (m) => m.module === mod.slug);
  const cards = items.map((m) => `<div class="card hover">
      <h3 style="margin:0 0 4px">${esc(m.name)}</h3>
      <p class="muted" style="margin:0 0 10px">${esc(m.purpose)}</p>
      <span class="badge grad">${esc(m.approx_price_range)}</span>
      ${m.supplier_info ? `<p style="margin:10px 0 0;font-size:.82rem" class="muted">📍 ${esc(m.supplier_info)}</p>` : ''}
    </div>`).join('');
  const tip = isEquipo
    ? `<div class="alert ok">✅ Con este equipo básico puedes arrancar tu producción de forma segura y económica.</div>`
    : '';
  return head(mod) + tip + (items.length ? `<div class="grid cols-2 stagger">${cards}</div>`
    : `<div class="alert warn">Aún no hay equipo cargado.</div>`);
}

// ---- Usos de los productos ----
function usos(user, mod) {
  const products = filter('products', (p) => p.is_published !== false && p.usage_instructions);
  const rows = products.map((p) => `<div class="card hover">
      <h3 style="margin:0 0 6px">${esc(p.name)}</h3>
      <p style="margin:0">${esc(p.usage_instructions)}</p>
    </div>`).join('');
  const search = `<input id="usoSearch" placeholder="🔎 Buscar producto..." onkeyup="filterCards(this,'.uso-list .card')" style="max-width:360px;margin-bottom:18px">`;
  return head(mod) + search + `<div class="uso-list grid stagger">${rows || '<div class="alert warn">Sin datos de uso.</div>'}</div>`;
}

// ---- Mezclas peligrosas ----
function mezclasPeligrosas(user, mod) {
  const mixes = all('dangerous_mixes');
  const rows = mixes.map((m) => `<div class="card mix-card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h3 style="margin:0">${esc(m.chemical_a)} <span class="muted">✕</span> ${esc(m.chemical_b)}</h3>
        <span class="badge ${esc(m.danger_level)}">Riesgo ${esc(m.danger_level)}</span>
      </div>
      <p style="margin:10px 0 4px"><b>¿Qué ocurre?</b> ${esc(m.reaction)}</p>
      <p style="margin:4px 0"><b>Prevención:</b> ${esc(m.prevention)}</p>
      <p style="margin:4px 0"><b>Primeros auxilios:</b> ${esc(m.first_aid)}</p>
    </div>`).join('');
  return `<div class="pagehead danger-head">
      <h2><span class="pulse-warn">⚠️</span> ${esc(mod.name)}</h2>
      <p class="muted">${esc(mod.description || '')}</p>
    </div>
    <div class="alert error">🚫 Nunca combines estos químicos. En caso de exposición, ventila el área y busca atención médica.</div>
    <input id="mixSearch" placeholder="🔎 ¿Puedo mezclar...? Escribe un químico (ej. cloro)" onkeyup="filterCards(this,'.mix-list .card')" style="max-width:440px;margin-bottom:18px">
    <div class="mix-list grid stagger">${rows}</div>
    <p class="muted" style="margin-top:26px;font-size:.8rem">
      Aviso: esta información es orientativa sobre seguridad. Consulta siempre las hojas de datos de seguridad (HDS) de cada producto.
    </p>`;
}

export function renderModule(user, slug, query = {}) {
  const mod = moduleBySlug(slug);
  if (!mod) return null;
  let body;
  switch (slug) {
    case 'formulacion': body = formulacion(user, mod); break;
    case 'productos': body = productos(user, mod); break;
    case 'marketing':
    case 'formas-de-venta': body = articulos(user, mod); break;
    case 'maquinas':
    case 'equipo-minimo': body = maquinas(user, mod); break;
    case 'usos': body = usos(user, mod); break;
    case 'mezclas-peligrosas': body = mezclasPeligrosas(user, mod); break;
    default: body = head(mod) + '<div class="alert warn">Módulo en construcción.</div>';
  }
  return shell({ user, activeSlug: slug, title: mod.name, body });
}
