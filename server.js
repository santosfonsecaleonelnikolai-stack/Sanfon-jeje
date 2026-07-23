// Servidor HTTP autocontenido (sin dependencias externas) para la plataforma S&F.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

import { seed } from './src/seed.js';
import {
  getSessionUser, createSession, destroySession, parseCookies,
  sessionCookie, clearSessionCookie, hashPassword, verifyPassword, SESSION_COOKIE,
} from './src/auth.js';
import { all, find, insert, update, remove } from './src/db.js';
import { canAccess, grant, revoke, allModules } from './src/permissions.js';
import { loginPage, panelPage, errorPage } from './src/views/pages.js';
import { renderModule } from './src/views/modules.js';
import { calculatorPage } from './src/views/calculator.js';
import { adminUsersPage, adminUserDetailPage, adminContentPage } from './src/views/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

// Sembrar al arrancar (idempotente).
seed();

const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };

// ---- Helpers de respuesta ----
function html(res, body, status = 200, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...extraHeaders });
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
  const data = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
    'Cache-Control': 'max-age=3600' });
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

    // --- Estáticos ---
    if (req.method === 'GET' && (path.startsWith('/logo') || path.endsWith('.css') ||
        path.endsWith('.js') || path.endsWith('.png') || path.endsWith('.ico'))) {
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

    // --- Módulos ---
    if (path.startsWith('/modulos/')) {
      const slug = path.split('/')[2];
      if (!canAccess(user, slug)) {
        return html(res, errorPage({ user, code: 403,
          message: 'No tienes acceso a este módulo. Pide al administrador que lo active.' }), 403);
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
