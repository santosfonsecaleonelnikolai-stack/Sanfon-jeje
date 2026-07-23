// Panel de administración: usuarios, permisos y contenido.

import { shell, esc, money } from './layout.js';
import { all, filter, find } from '../db.js';
import { allModules, userPermissionIds } from '../permissions.js';

function tabs(active) {
  const items = [
    ['usuarios', '👥 Usuarios'],
    ['contenido', '📦 Contenido'],
  ];
  return `<div class="chip-row" style="margin-bottom:20px">
    ${items.map(([slug, label]) =>
      `<a class="btn ${active === slug ? '' : 'secondary'} small" href="/admin/${slug}">${label}</a>`).join('')}
  </div>`;
}

// ---- Lista de usuarios + alta ----
export function adminUsersPage(user, { flash } = {}) {
  const users = all('profiles').slice().sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
  const rows = users.map((u) => {
    const nMods = u.role === 'admin' ? 'Todos' : userPermissionIds(u.id).size;
    const status = u.is_active
      ? '<span class="badge bajo">Activo</span>'
      : '<span class="badge alto">Suspendido</span>';
    return `<tr>
      <td><b>${esc(u.full_name || '—')}</b><br><span class="muted" style="font-size:.8rem">${esc(u.email)}</span></td>
      <td>${u.role === 'admin' ? 'Administrador' : 'Cliente'}</td>
      <td>${status}</td>
      <td>${nMods} módulos</td>
      <td><a class="btn small secondary" href="/admin/usuarios/${u.id}">Gestionar</a></td>
    </tr>`;
  }).join('');

  const body = tabs('usuarios') +
    (flash ? `<div class="alert">${esc(flash)}</div>` : '') +
    `<div class="grid" style="grid-template-columns:1.6fr 1fr">
      <div class="card">
        <h3 style="margin:0 0 12px">Usuarios (${users.length})</h3>
        <table><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acceso</th><th></th></tr></thead>
          <tbody>${rows}</tbody></table>
      </div>
      <div class="card">
        <h3 style="margin:0 0 12px">➕ Nuevo usuario</h3>
        <form method="POST" action="/admin/usuarios/crear">
          <div class="field"><label>Nombre completo</label><input name="full_name" required></div>
          <div class="field"><label>Correo</label><input type="email" name="email" required></div>
          <div class="field"><label>Teléfono</label><input name="phone"></div>
          <div class="field"><label>Contraseña temporal</label><input name="password" required minlength="6"></div>
          <div class="field"><label>Fecha de compra</label><input type="date" name="purchased_at"></div>
          <div class="field"><label>Vence el (opcional)</label><input type="date" name="access_expires_at"></div>
          <button class="btn" type="submit">Crear usuario</button>
        </form>
      </div>
    </div>`;

  return shell({ user, activeSlug: 'admin', title: 'Administración · Usuarios', body });
}

// ---- Detalle de usuario: permisos, estado ----
export function adminUserDetailPage(admin, target, { flash } = {}) {
  const mods = allModules();
  const owned = target.role === 'admin' ? new Set(mods.map((m) => m.id)) : userPermissionIds(target.id);

  const permItems = mods.map((m) => `<label class="perm-item">
      <input type="checkbox" name="modules" value="${m.id}" ${owned.has(m.id) ? 'checked' : ''}
        ${target.role === 'admin' ? 'disabled' : ''}>
      <span>${m.icon || ''} ${esc(m.name)}</span>
    </label>`).join('');

  const body = `<a href="/admin/usuarios" class="muted">← Volver a usuarios</a>
    ${flash ? `<div class="alert" style="margin-top:12px">${esc(flash)}</div>` : ''}
    <div class="pagehead" style="margin-top:12px">
      <h2 style="margin:0">${esc(target.full_name || target.email)}</h2>
      <p class="muted">${esc(target.email)} · ${target.role === 'admin' ? 'Administrador' : 'Cliente'}
        · ${target.is_active ? 'Activo' : 'Suspendido'}</p>
    </div>

    <div class="grid" style="grid-template-columns:1.6fr 1fr">
      <div class="card">
        <h3 style="margin:0 0 6px">Permisos de módulos</h3>
        <p class="muted" style="margin:0 0 14px;font-size:.85rem">Marca las pestañas que este usuario podrá ver.</p>
        ${target.role === 'admin'
          ? '<div class="alert">Los administradores tienen acceso a todos los módulos.</div>'
          : `<form method="POST" action="/admin/usuarios/${target.id}/permisos">
              <div class="chip-row">
                <button type="button" class="btn secondary small" onclick="setAll(true)">Acceso total</button>
                <button type="button" class="btn secondary small" onclick="setAll(false)">Quitar todo</button>
                <button type="button" class="btn secondary small" onclick="setBasic()">Paquete básico</button>
              </div>
              <div class="perm-grid">${permItems}</div>
              <button class="btn" style="margin-top:16px" type="submit">Guardar permisos</button>
            </form>`}
      </div>

      <div class="card">
        <h3 style="margin:0 0 12px">Cuenta</h3>
        <form method="POST" action="/admin/usuarios/${target.id}/estado" style="margin-bottom:16px">
          <button class="btn ${target.is_active ? 'danger' : ''}" type="submit">
            ${target.is_active ? 'Suspender acceso' : 'Reactivar acceso'}
          </button>
        </form>
        <form method="POST" action="/admin/usuarios/${target.id}/password">
          <div class="field"><label>Nueva contraseña</label><input name="password" required minlength="6"></div>
          <button class="btn secondary" type="submit">Restablecer contraseña</button>
        </form>
      </div>
    </div>
    <script>
      var basic = ['formulaci','calculadora','usos'];
      function setAll(v){ document.querySelectorAll('input[name=modules]').forEach(function(c){ if(!c.disabled) c.checked = v; }); }
      function setBasic(){ document.querySelectorAll('input[name=modules]').forEach(function(c){
        if(c.disabled) return;
        var txt = c.parentNode.textContent.toLowerCase();
        c.checked = basic.some(function(k){ return txt.indexOf(k) > -1; });
      }); }
    </script>`;

  return shell({ user: admin, activeSlug: 'admin', title: 'Administración · Usuario', body });
}

// ---- Gestión de contenido ----
export function adminContentPage(user, { flash } = {}) {
  const products = all('products');
  const formulas = all('formulas');
  const mixes = all('dangerous_mixes');
  const machines = all('machines');

  function list(items, render, deleteBase) {
    return items.map((it) => `<tr><td>${render(it)}</td>
      <td style="text-align:right"><form method="POST" action="${deleteBase}/${it.id}/borrar" onsubmit="return confirm('¿Borrar?')">
        <button class="btn danger small" type="submit">Borrar</button></form></td></tr>`).join('');
  }

  const body = tabs('contenido') +
    (flash ? `<div class="alert">${esc(flash)}</div>` : '') +
    `<div class="grid">
      <div class="card">
        <h3 style="margin:0 0 12px">🧴 Productos (${products.length})</h3>
        <table><tbody>${list(products, (p) => `<b>${esc(p.name)}</b> <span class="muted">${esc(p.category||'')}</span>`, '/admin/contenido/producto')}</tbody></table>
        <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600">➕ Agregar producto</summary>
          <form method="POST" action="/admin/contenido/producto" style="margin-top:12px">
            <div class="field"><label>Nombre</label><input name="name" required></div>
            <div class="field"><label>Categoría</label><input name="category"></div>
            <div class="field"><label>Descripción</label><textarea name="description" rows="2"></textarea></div>
            <div class="field"><label>Instrucciones de uso</label><textarea name="usage_instructions" rows="2"></textarea></div>
            <div class="field"><label>Presentaciones (una por línea: tamaño=precio, ej. 1 L=38)</label><textarea name="presentations" rows="3" placeholder="1 L=38&#10;5 L=160"></textarea></div>
            <button class="btn" type="submit">Guardar producto</button>
          </form></details>
      </div>

      <div class="card">
        <h3 style="margin:0 0 12px">🧪 Fórmulas (${formulas.length})</h3>
        <table><tbody>${list(formulas, (f) => `<b>${esc(f.name)}</b> <span class="muted">rinde ${f.yield_liters} L</span>`, '/admin/contenido/formula')}</tbody></table>
        <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600">➕ Agregar fórmula</summary>
          <form method="POST" action="/admin/contenido/formula" style="margin-top:12px">
            <div class="field"><label>Nombre</label><input name="name" required></div>
            <div class="field"><label>Descripción</label><input name="description"></div>
            <div class="field"><label>Rendimiento (litros)</label><input type="number" name="yield_liters" value="20" step="0.1" required></div>
            <div class="field"><label>Procedimiento</label><textarea name="procedure" rows="3"></textarea></div>
            <div class="field"><label>Notas de seguridad</label><textarea name="safety_notes" rows="2"></textarea></div>
            <div class="field"><label>Ingredientes (uno por línea: nombre=cantidad=unidad=costo, ej. Texapón=3=kg=55)</label>
              <textarea name="ingredients" rows="4" placeholder="Texapón=3=kg=55&#10;Agua=14=L=0.1"></textarea></div>
            <button class="btn" type="submit">Guardar fórmula</button>
          </form></details>
      </div>

      <div class="card">
        <h3 style="margin:0 0 12px">⚠️ Mezclas peligrosas (${mixes.length})</h3>
        <table><tbody>${list(mixes, (m) => `<b>${esc(m.chemical_a)}</b> + <b>${esc(m.chemical_b)}</b> <span class="badge ${esc(m.danger_level)}">${esc(m.danger_level)}</span>`, '/admin/contenido/mezcla')}</tbody></table>
        <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600">➕ Agregar mezcla peligrosa</summary>
          <form method="POST" action="/admin/contenido/mezcla" style="margin-top:12px">
            <div class="field"><label>Químico A</label><input name="chemical_a" required></div>
            <div class="field"><label>Químico B</label><input name="chemical_b" required></div>
            <div class="field"><label>Nivel de peligro</label><select name="danger_level"><option>alto</option><option>medio</option><option>bajo</option></select></div>
            <div class="field"><label>Reacción</label><textarea name="reaction" rows="2"></textarea></div>
            <div class="field"><label>Prevención</label><textarea name="prevention" rows="2"></textarea></div>
            <div class="field"><label>Primeros auxilios</label><textarea name="first_aid" rows="2"></textarea></div>
            <button class="btn" type="submit">Guardar mezcla</button>
          </form></details>
      </div>

      <div class="card">
        <h3 style="margin:0 0 12px">⚙️ Máquinas y equipo (${machines.length})</h3>
        <table><tbody>${list(machines, (m) => `<b>${esc(m.name)}</b> <span class="muted">${m.module === 'equipo-minimo' ? 'equipo mínimo' : 'máquina'}</span>`, '/admin/contenido/maquina')}</tbody></table>
        <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600">➕ Agregar máquina / equipo</summary>
          <form method="POST" action="/admin/contenido/maquina" style="margin-top:12px">
            <div class="field"><label>Nombre</label><input name="name" required></div>
            <div class="field"><label>Para qué sirve</label><textarea name="purpose" rows="2"></textarea></div>
            <div class="field"><label>Rango de precio</label><input name="approx_price_range" placeholder="$500 – $1,500 MXN"></div>
            <div class="field"><label>Proveedor / dónde conseguir</label><input name="supplier_info"></div>
            <div class="field"><label>Categoría</label><select name="module"><option value="maquinas">Máquina industrial</option><option value="equipo-minimo">Equipo mínimo</option></select></div>
            <button class="btn" type="submit">Guardar</button>
          </form></details>
      </div>
    </div>`;

  return shell({ user, activeSlug: 'admin', title: 'Administración · Contenido', body });
}
