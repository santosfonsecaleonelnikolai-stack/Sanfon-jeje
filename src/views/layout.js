// Utilidades de render y el layout (shell) con barra lateral y logo.

import { userModules } from '../permissions.js';

export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function nl2br(str) {
  return esc(str).replace(/\n/g, '<br>');
}

export function money(n) {
  return '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const HEAD = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="/logo-syf.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">`;

// Página completa con barra lateral (para usuarios autenticados).
export function shell({ user, activeSlug, title, body }) {
  const mods = userModules(user);
  const nav = mods.map((m) => `
    <a href="/modulos/${m.slug}" class="${activeSlug === m.slug ? 'active' : ''}">
      <span class="ico">${m.icon || '•'}</span> ${esc(m.name)}
    </a>`).join('');

  const adminLink = user.role === 'admin'
    ? `<a href="/admin" class="${activeSlug === 'admin' ? 'active' : ''}"><span class="ico">🛠️</span> Administración</a>`
    : '';

  return `<!doctype html><html lang="es"><head><title>${esc(title)} · S&F</title>${HEAD}</head>
<body><div class="app">
  <aside class="sidebar">
    <a href="/panel" class="brand">
      <img src="/logo-syf.png" alt="S&F">
      <span><b>S&amp;F</b><small>Industria de la limpieza</small></span>
    </a>
    <nav class="nav">
      <a href="/panel" class="${activeSlug === 'panel' ? 'active' : ''}"><span class="ico">🏠</span> Inicio</a>
      ${nav}
      ${adminLink}
    </nav>
    <div class="foot">
      <div class="muted" style="color:#fff;opacity:.85">${esc(user.full_name || user.email)}</div>
      <a href="/logout">Cerrar sesión →</a>
    </div>
  </aside>
  <main class="content">
    <div class="topbar">
      <h1>${esc(title)}</h1>
      <span class="user">${esc(user.email)} · ${user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
    </div>
    <div class="main">${body}</div>
  </main>
</div></body></html>`;
}

// Página simple sin sidebar (login, errores).
export function bare({ title, body }) {
  return `<!doctype html><html lang="es"><head><title>${esc(title)} · S&F</title>${HEAD}</head>
<body>${body}</body></html>`;
}
