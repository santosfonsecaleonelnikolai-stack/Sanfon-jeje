// Calculadora de fórmulas — herramienta estrella.

import { shell, esc, money } from './layout.js';
import { all, filter, find } from '../db.js';
import { moduleBySlug } from '../permissions.js';

export function calculatorPage(user, query = {}) {
  const mod = moduleBySlug('calculadora');
  const formulas = filter('formulas', (f) => f.is_published !== false);
  const selectedId = query.formula || (formulas[0] && formulas[0].id);
  const selected = find('formulas', (f) => f.id === selectedId) || formulas[0];

  const options = formulas.map((f) =>
    `<option value="${f.id}" ${f.id === (selected && selected.id) ? 'selected' : ''}>${esc(f.name)} (rinde ${f.yield_liters} L)</option>`
  ).join('');

  // Datos de la fórmula seleccionada para el cálculo en el cliente.
  const ingredients = selected
    ? filter('formula_ingredients', (i) => i.formula_id === selected.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((i) => ({ name: i.ingredient_name, quantity: i.quantity, unit: i.unit, cost: i.cost_per_unit || 0 }))
    : [];

  const data = selected
    ? { id: selected.id, name: selected.name, yield: selected.yield_liters, ingredients }
    : null;

  if (!selected) {
    return shell({ user, activeSlug: 'calculadora', title: mod.name,
      body: `<div class="pagehead"><h2>${mod.icon} ${esc(mod.name)}</h2></div>
        <div class="alert warn">Aún no hay fórmulas para calcular. Pide al administrador que agregue fórmulas.</div>` });
  }

  const body = `<div class="pagehead">
      <h2 style="margin:0">${mod.icon} ${esc(mod.name)}</h2>
      <p class="muted">Elige una fórmula, indica cuánto quieres producir y la app escala los ingredientes y calcula el costo.</p>
    </div>
    <div class="card no-print">
      <div class="grid cols-2" style="align-items:end">
        <div class="field" style="margin:0">
          <label>Fórmula</label>
          <select id="formulaSelect" onchange="location.href='/modulos/calculadora?formula='+this.value">${options}</select>
        </div>
        <div class="field" style="margin:0">
          <label>Cantidad a producir (litros)</label>
          <input type="number" id="targetLiters" value="${selected.yield_liters}" min="0" step="0.1" oninput="recalc()">
        </div>
      </div>
      <div class="grid cols-2" style="margin-top:14px">
        <div class="field" style="margin:0">
          <label>Precio de venta por litro (opcional)</label>
          <input type="number" id="sellPrice" placeholder="Ej. 25" min="0" step="0.5" oninput="recalc()">
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="print-only" style="text-align:center;margin-bottom:10px">
        <img src="/logo-syf.png" width="70"><h2>Hoja de producción S&F</h2>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <h3 id="resTitle" style="margin:0"></h3>
        <button class="btn secondary small no-print" onclick="window.print()">🖨️ Imprimir / PDF</button>
      </div>
      <table style="margin-top:12px">
        <thead><tr><th>Ingrediente</th><th>Cantidad</th><th>Costo estimado</th></tr></thead>
        <tbody id="resBody"></tbody>
      </table>
      <div id="resSummary" class="grid cols-3" style="margin-top:16px"></div>
    </div>

    <script>window.__FORMULA__ = ${JSON.stringify(data)};</script>`;

  return shell({ user, activeSlug: 'calculadora', title: mod.name, body });
}
