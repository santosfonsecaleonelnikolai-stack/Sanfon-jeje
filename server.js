// Servidor HTTP autocontenido (sin dependencias externas) para la plataforma S&F.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { gzipSync } from 'node:zlib';

import { seed } from './src/seed.js';
import {
  getSessionUser, createSession, destroySession, parseCookies,
  sessionCookie, clearSessionCookie, hashPassword, verifyPassword, SESSION_COOKIE,
} from './src/auth.js';
import { all, find, insert, update, remove } from './src/db.js';
import { canAccess, grant, revoke, allModules, planById } from './src/permissions.js';
import { loginPage, panelPage, errorPage } from './src/views/pages.js';
import { renderModule } from './src/views/modules.js';
import { calculatorPage } from './src/views/calculator.js';
import { adminUsersPage, adminUserDetailPage, adminContentPage } from './src/views/admin.js';
import { plansPage, checkoutPage, paymentSuccessPage } from './src/views/plans.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

// Sembrar al arrancar (idempotente).
seed();

const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };

// ---- Helpers de respuesta ----
// Comprime HTML con gzip cuando el navegador lo soporta (res._gzip lo fija el handler).
function html(res, body, status = 200, extraHeaders = {}) {
  const headers = { 'Content-Type': 'text/html; charset=utf-8', ...extraHeaders };
  if (res._gzip && body && body.length > 1024) {
    const gz = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
    res.writeHead(status, headers);
    res.end(gz);
    return;
  }
  res.writeHead(status, headers);
  res.end(body);
}
function redirect(res, location, extraHeaders = {}) {
  res.writeHead(302, { Location: location, ...extraHeaders });
  res.end();
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => resolve(parseForm(data)));
  });
}
function parseForm(data) {
  const params = new URLSearchParams(data);
  const out = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    out[key] = values.length > 1 ? values : values[0];
  }
  return out;
}

async function serveStatic(res, pathname) {
  const filePath = join(PUBLIC_DIR, pathname.replace(/^\/+/, ''));
  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath)) return false;
  const ext = extname(filePath);
  const data = await readFile(filePath);
  // Imágenes: caché muy larga e inmutable. CSS/JS: un día.
  const isImg = ['.png', '.jpg', '.jpeg', '.webp', '.ico'].includes(ext);
  const cache = isImg ? 'public, max-age=31536000, immutable' : 'public, max-age=86400';
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
  res.end(data);
  return true;
}

// ---- Servidor ----
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = decodeURIComponent(url.pathname);
    const query = Object.fromEntries(url.searchParams);
    const cookies = parseCookies(req);
    const user = getSessionUser(cookies[SESSION_COOKIE]);
    res._gzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');

    // --- Estáticos ---
    if (req.method === 'GET' && /\.(css|js|png|jpe?g|webp|ico|svg)$/.test(path)) {
      if (await serveStatic(res, path)) return;
    }

    // --- Login / Logout (públicas) ---
    if (path === '/login' && req.method === 'GET') {
      if (user) return redirect(res, '/panel');
      return html(res, loginPage());
    }
    if (path === '/login' && req.method === 'POST') {
      const body = await readBody(req);
      const found = find('profiles', (p) => p.email === String(body.email || '').trim().toLowerCase());
      if (!found || !verifyPassword(body.password || '', found.password_hash)) {
        return html(res, loginPage({ error: 'Correo o contraseña incorrectos.' }), 401);
      }
      if (!found.is_active) {
        return html(res, loginPage({ error: 'Tu cuenta está suspendida. Contacta al administrador.' }), 403);
      }
      if (found.access_expires_at && new Date(found.access_expires_at) < new Date()) {
        return html(res, loginPage({ error: 'Tu acceso ha vencido. Contacta al administrador.' }), 403);
      }
      const token = createSession(found.id);
      return redirect(res, '/panel', { 'Set-Cookie': sessionCookie(token) });
    }
    if (path === '/logout') {
      destroySession(cookies[SESSION_COOKIE]);
      return redirect(res, '/login', { 'Set-Cookie': clearSessionCookie() });
    }

    // --- A partir de aquí se requiere sesión ---
    if (!user) return redirect(res, '/login');

    if (path === '/' || path === '/panel') return html(res, panelPage(user));

    // --- Planes y pagos ---
    if (path === '/planes') return html(res, plansPage(user, { flash: query.msg }));
    if (path === '/planes/checkout') {
      const page = checkoutPage(user, query.plan);
      if (!page) return redirect(res, '/planes');
      return html(res, page);
    }
    if (path === '/planes/contratar' && req.method === 'POST') {
      const body = await readBody(req);
      const plan = planById(body.plan);
      if (!plan) return redirect(res, '/planes');
      if (user.role !== 'admin') {
        insert('payments', {
          user_id: user.id, plan_id: plan.id, plan_name: plan.name, amount: plan.price,
          method: body.method || 'tarjeta', status: 'pagado', created_at: new Date().toISOString(),
        });
        update('profiles', user.id, { plan: plan.id, purchased_at: new Date().toISOString().slice(0, 10) });
      }
      return redirect(res, '/planes/gracias?plan=' + encodeURIComponent(plan.id));
    }
    if (path === '/planes/gracias') {
      const plan = planById(query.plan);
      if (!plan) return redirect(res, '/panel');
      return html(res, paymentSuccessPage(user, plan));
    }

    // --- Módulos ---
    if (path.startsWith('/modulos/')) {
      const slug = path.split('/')[2];
      if (!canAccess(user, slug)) {
        // Módulo bloqueado: se envía al usuario a elegir un plan para desbloquearlo.
        return redirect(res, '/planes?msg=' + encodeURIComponent('Ese módulo está incluido en un plan. Elige uno para desbloquearlo.'));
      }
      if (slug === 'calculadora') return html(res, calculatorPage(user, query));
      const page = renderModule(user, slug, query);
      if (page) return html(res, page);
      return html(res, errorPage({ user, code: 404, message: 'Módulo no encontrado.' }), 404);
    }

    // --- Administración (solo admin) ---
    if (path.startsWith('/admin')) {
      if (user.role !== 'admin') {
        return html(res, errorPage({ user, code: 403, message: 'Solo el administrador puede entrar aquí.' }), 403);
      }
      return handleAdmin(req, res, user, path, query);
    }

    return html(res, errorPage({ user, code: 404, message: 'Página no encontrada.' }), 404);
  } catch (err) {
    console.error(err);
    html(res, `<h1>Error interno</h1><pre>${err.message}</pre>`, 500);
  }
});

// ---- Rutas de administración ----
async function handleAdmin(req, res, user, path, query) {
  const parts = path.split('/').filter(Boolean); // ['admin', ...]

  // GET listados
  if (req.method === 'GET') {
    if (path === '/admin' || path === '/admin/usuarios') {
      return html(res, adminUsersPage(user, { flash: query.msg }));
    }
    if (path === '/admin/contenido') {
      return html(res, adminContentPage(user, { flash: query.msg }));
    }
    if (parts[1] === 'usuarios' && parts[2]) {
      const target = find('profiles', (p) => p.id === parts[2]);
      if (!target) return html(res, errorPage({ user, code: 404, message: 'Usuario no encontrado.' }), 404);
      return html(res, adminUserDetailPage(user, target, { flash: query.msg }));
    }
  }

  // POST acciones
  if (req.method === 'POST') {
    const body = await readBody(req);

    // Crear usuario
    if (path === '/admin/usuarios/crear') {
      const email = String(body.email || '').trim().toLowerCase();
      if (find('profiles', (p) => p.email === email)) {
        return redirect(res, '/admin/usuarios?msg=' + encodeURIComponent('Ese correo ya existe.'));
      }
      insert('profiles', {
        email, password_hash: hashPassword(body.password || 'temporal123'),
        full_name: body.full_name || '', phone: body.phone || '', role: 'cliente',
        is_active: true, purchased_at: body.purchased_at || null,
        access_expires_at: body.access_expires_at || null, created_at: new Date().toISOString(),
      });
      return redirect(res, '/admin/usuarios?msg=' + encodeURIComponent('Usuario creado.'));
    }

    // Permisos
    if (parts[1] === 'usuarios' && parts[3] === 'permisos') {
      const target = find('profiles', (p) => p.id === parts[2]);
      if (target && target.role !== 'admin') {
        const selected = new Set([].concat(body.modules || []).map(String));
        for (const m of allModules()) {
          if (selected.has(String(m.id))) grant(target.id, m.id, user.id);
          else revoke(target.id, m.id);
        }
      }
      return redirect(res, `/admin/usuarios/${parts[2]}?msg=` + encodeURIComponent('Permisos guardados.'));
    }

    // Plan del cliente (asignación manual del admin)
    if (parts[1] === 'usuarios' && parts[3] === 'plan') {
      const target = find('profiles', (p) => p.id === parts[2]);
      if (target && target.role !== 'admin') {
        const plan = planById(body.plan);
        update('profiles', target.id, { plan: plan ? plan.id : null });
      }
      return redirect(res, `/admin/usuarios/${parts[2]}?msg=` + encodeURIComponent('Plan actualizado.'));
    }

    // Estado (activar/suspender)
    if (parts[1] === 'usuarios' && parts[3] === 'estado') {
      const target = find('profiles', (p) => p.id === parts[2]);
      if (target && target.role !== 'admin') update('profiles', target.id, { is_active: !target.is_active });
      return redirect(res, `/admin/usuarios/${parts[2]}?msg=` + encodeURIComponent('Estado actualizado.'));
    }

    // Contraseña
    if (parts[1] === 'usuarios' && parts[3] === 'password') {
      const target = find('profiles', (p) => p.id === parts[2]);
      if (target && body.password) update('profiles', target.id, { password_hash: hashPassword(body.password) });
      return redirect(res, `/admin/usuarios/${parts[2]}?msg=` + encodeURIComponent('Contraseña actualizada.'));
    }

    // ---- Contenido ----
    const ok = (m) => redirect(res, '/admin/contenido?msg=' + encodeURIComponent(m));

    if (path === '/admin/contenido/producto') {
      insert('products', {
        name: body.name, category: body.category || '', description: body.description || '',
        usage_instructions: body.usage_instructions || '',
        presentations: parsePresentations(body.presentations), is_published: true,
      });
      return ok('Producto agregado.');
    }
    if (parts[2] === 'producto' && parts[4] === 'borrar') { remove('products', parts[3]); return ok('Producto borrado.'); }

    if (path === '/admin/contenido/formula') {
      const f = insert('formulas', {
        name: body.name, description: body.description || '',
        yield_liters: Number(body.yield_liters) || 20, procedure: body.procedure || '',
        safety_notes: body.safety_notes || '', is_published: true,
      });
      parseIngredients(body.ingredients).forEach((ing, i) =>
        insert('formula_ingredients', { ...ing, formula_id: f.id, sort_order: i }));
      return ok('Fórmula agregada.');
    }
    if (parts[2] === 'formula' && parts[4] === 'borrar') {
      remove('formulas', parts[3]);
      for (const ing of all('formula_ingredients').filter((i) => i.formula_id === parts[3])) remove('formula_ingredients', ing.id);
      return ok('Fórmula borrada.');
    }

    if (path === '/admin/contenido/mezcla') {
      insert('dangerous_mixes', {
        chemical_a: body.chemical_a, chemical_b: body.chemical_b,
        danger_level: body.danger_level || 'alto', reaction: body.reaction || '',
        prevention: body.prevention || '', first_aid: body.first_aid || '',
      });
      return ok('Mezcla peligrosa agregada.');
    }
    if (parts[2] === 'mezcla' && parts[4] === 'borrar') { remove('dangerous_mixes', parts[3]); return ok('Mezcla borrada.'); }

    if (path === '/admin/contenido/maquina') {
      insert('machines', {
        name: body.name, purpose: body.purpose || '', approx_price_range: body.approx_price_range || '',
        supplier_info: body.supplier_info || '', module: body.module || 'maquinas',
        is_essential: body.module === 'equipo-minimo',
      });
      return ok('Equipo agregado.');
    }
    if (parts[2] === 'maquina' && parts[4] === 'borrar') { remove('machines', parts[3]); return ok('Equipo borrado.'); }
  }

  return html(res, errorPage({ user, code: 404, message: 'Acción no encontrada.' }), 404);
}

// "1 L=38\n5 L=160" -> [{size,price}]
function parsePresentations(text) {
  return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [size, price] = l.split('=');
    return { size: (size || '').trim(), price: Number(price) || 0 };
  });
}
// "Texapón=3=kg=55" -> [{ingredient_name,quantity,unit,cost_per_unit}]
function parseIngredients(text) {
  return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, qty, unit, cost] = l.split('=');
    return { ingredient_name: (name || '').trim(), quantity: Number(qty) || 0,
      unit: (unit || 'kg').trim(), cost_per_unit: Number(cost) || 0 };
  });
}

server.listen(PORT, () => {
  console.log(`\n  S&F Industria de la limpieza`);
  console.log(`  Servidor en http://localhost:${PORT}`);
  console.log(`  Admin: ${process.env.SYF_ADMIN_EMAIL || 'admin@syf.com'} / ${process.env.SYF_ADMIN_PASSWORD || 'admin123'}\n`);
});
