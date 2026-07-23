// Render de cada módulo de la plataforma.

import { shell, esc, nl2br, money } from './layout.js';
import { all, filter, find } from '../db.js';
import { moduleBySlug } from '../permissions.js';

function head(mod, extra = '') {
  return `<div class="pagehead">
    <h2 style="margin:0">${mod.icon || ''} ${esc(mod.name)}</h2>
    <p class="muted">${esc(mod.description || '')}</p>
    ${extra}
  </div>`;
}

// ---- Formulación ----
function formulacion(user, mod) {
  const formulas = filter('formulas', (f) => f.is_published !== false);
  const cards = formulas.map((f) => {
    const ings = filter('formula_ingredients', (i) => i.formula_id === f.id)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const rows = ings.map((i) =>
      `<tr><td>${esc(i.ingredient_name)}</td><td>${i.quantity} ${esc(i.unit)}</td></tr>`).join('');
    return `<div class="card">
      <h3 style="margin:0 0 4px">${esc(f.name)}</h3>
      <p class="muted" style="margin:0 0 10px">${esc(f.description || '')}</p>
      <p class="badge">Rinde ${f.yield_liters} L</p>
      <table style="margin:12px 0"><thead><tr><th>Ingrediente</th><th>Cantidad</th></tr></thead>
        <tbody>${rows}</tbody></table>
      <details><summary style="cursor:pointer;font-weight:600">Procedimiento y seguridad</summary>
        <p style="margin:10px 0 4px"><b>Elaboración:</b></p>
        <p class="muted" style="margin:0">${nl2br(f.procedure)}</p>
        ${f.safety_notes ? `<div class="alert warn" style="margin-top:10px">⚠️ ${esc(f.safety_notes)}</div>` : ''}
      </details>
      <a class="btn small" style="margin-top:12px" href="/modulos/calculadora?formula=${f.id}">🧮 Calcular esta fórmula</a>
    </div>`;
  }).join('');
  return head(mod) + (formulas.length ? `<div class="grid cols-2">${cards}</div>`
    : `<div class="alert">Aún no hay fórmulas. El administrador puede agregarlas.</div>`);
}

// ---- Productos ----
function productos(user, mod) {
  const products = filter('products', (p) => p.is_published !== false);
  const cards = products.map((p) => {
    const pres = (p.presentations || []).map((x) =>
      `<tr><td>${esc(x.size)}</td><td>${money(x.price)}</td></tr>`).join('');
    return `<div class="card">
      ${p.image_url ? `<img src="${esc(p.image_url)}" style="width:100%;border-radius:10px;margin-bottom:10px">` : ''}
      <span class="badge">${esc(p.category || 'Producto')}</span>
      <h3 style="margin:8px 0 4px">${esc(p.name)}</h3>
      <p class="muted" style="margin:0 0 10px">${esc(p.description || '')}</p>
      <table><thead><tr><th>Presentación</th><th>Precio</th></tr></thead><tbody>${pres}</tbody></table>
      ${p.usage_instructions ? `<p style="margin:10px 0 0;font-size:.85rem"><b>Uso:</b> ${esc(p.usage_instructions)}</p>` : ''}
    </div>`;
  }).join('');
  return head(mod) + (products.length ? `<div class="grid cols-2">${cards}</div>`
    : `<div class="alert">Aún no hay productos cargados.</div>`);
}

// ---- Artículos (marketing / formas de venta) ----
function articulos(user, mod) {
  const items = filter('articles', (a) => a.module_slug === mod.slug && a.is_published !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const cards = items.map((a) => `<div class="card">
      <h3 style="margin:0 0 8px">${esc(a.title)}</h3>
      <p style="margin:0">${nl2br(a.body)}</p>
    </div>`).join('');
  return head(mod) + (items.length ? `<div class="grid">${cards}</div>`
    : `<div class="alert">Aún no hay contenido en este módulo.</div>`);
}

// ---- Máquinas / equipo mínimo ----
function maquinas(user, mod) {
  const isEquipo = mod.slug === 'equipo-minimo';
  const items = filter('machines', (m) => m.module === mod.slug);
  const cards = items.map((m) => `<div class="card">
      <h3 style="margin:0 0 4px">${esc(m.name)}</h3>
      <p class="muted" style="margin:0 0 8px">${esc(m.purpose)}</p>
      <p class="badge">${esc(m.approx_price_range)}</p>
      ${m.supplier_info ? `<p style="margin:8px 0 0;font-size:.82rem" class="muted">📍 ${esc(m.supplier_info)}</p>` : ''}
    </div>`).join('');
  const tip = isEquipo
    ? `<div class="alert">✅ Con este equipo básico puedes arrancar tu producción de forma segura y económica.</div>`
    : '';
  return head(mod) + tip + (items.length ? `<div class="grid cols-2">${cards}</div>`
    : `<div class="alert">Aún no hay equipo cargado.</div>`);
}

// ---- Usos de los productos ----
function usos(user, mod) {
  const products = filter('products', (p) => p.is_published !== false && p.usage_instructions);
  const rows = products.map((p) => `<div class="card">
      <h3 style="margin:0 0 6px">${esc(p.name)}</h3>
      <p style="margin:0">${esc(p.usage_instructions)}</p>
    </div>`).join('');
  const search = `<input id="usoSearch" placeholder="Buscar producto..." onkeyup="filterCards(this,'.uso-list .card')" style="max-width:340px;margin-bottom:16px">`;
  return head(mod) + search + `<div class="uso-list grid">${rows || '<div class="alert">Sin datos de uso.</div>'}</div>`;
}

// ---- Mezclas peligrosas ----
function mezclasPeligrosas(user, mod) {
  const mixes = all('dangerous_mixes');
  const rows = mixes.map((m) => `<div class="card mix-card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h3 style="margin:0">${esc(m.chemical_a)} <span class="muted">+</span> ${esc(m.chemical_b)}</h3>
        <span class="badge ${esc(m.danger_level)}">Riesgo ${esc(m.danger_level)}</span>
      </div>
      <p style="margin:10px 0 4px"><b>¿Qué ocurre?</b> ${esc(m.reaction)}</p>
      <p style="margin:4px 0"><b>Prevención:</b> ${esc(m.prevention)}</p>
      <p style="margin:4px 0"><b>Primeros auxilios:</b> ${esc(m.first_aid)}</p>
    </div>`).join('');
  return `<div class="pagehead danger-head">
      <h2 style="margin:0;color:var(--syf-danger)">⚠️ ${esc(mod.name)}</h2>
      <p class="muted">${esc(mod.description || '')}</p>
    </div>
    <div class="alert error">Nunca combines estos químicos. En caso de exposición, ventila el área y busca atención médica.</div>
    <input id="mixSearch" placeholder="¿Puedo mezclar...? Escribe un químico (ej. cloro)" onkeyup="filterCards(this,'.mix-list .card')" style="max-width:420px;margin-bottom:16px">
    <div class="mix-list grid">${rows}</div>
    <p class="muted" style="margin-top:24px;font-size:.8rem">
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
    default: body = head(mod) + '<div class="alert">Módulo en construcción.</div>';
  }
  return shell({ user, activeSlug: slug, title: mod.name,
    body: body + `<script src="/app.js"></script>` });
}
