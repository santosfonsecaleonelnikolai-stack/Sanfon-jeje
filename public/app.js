// JS del cliente: calculadora y buscadores.

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

  const costPerLiter = target ? totalCost / target : 0;
  let summary =
    tile('Costo total', money(totalCost)) +
    tile('Costo por litro', money(costPerLiter));

  if (sell > 0) {
    const revenue = sell * target;
    const profit = revenue - totalCost;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    summary += tile('Ganancia estimada', money(profit) +
      ' <small style="color:var(--syf-gray)">(' + margin.toFixed(0) + '% margen)</small>');
  } else {
    summary += tile('Ganancia', '<span class="muted" style="font-size:.85rem">Ingresa precio de venta</span>');
  }
  document.getElementById('resSummary').innerHTML = summary;
}

function tile(label, value) {
  return '<div class="card" style="background:var(--syf-green-50);text-align:center">' +
    '<div class="muted" style="font-size:.8rem">' + label + '</div>' +
    '<div style="font-size:1.35rem;font-weight:700;color:var(--syf-green-700)">' + value + '</div></div>';
}

function filterCards(input, selector) {
  const q = input.value.toLowerCase().trim();
  document.querySelectorAll(selector).forEach(function (card) {
    card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.__FORMULA__) recalc();
});
