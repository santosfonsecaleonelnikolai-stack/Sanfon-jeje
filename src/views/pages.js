// Vistas: login, panel de inicio y páginas de error.

import { bare, shell, esc } from './layout.js';
import { userModules } from '../permissions.js';

export function loginPage({ error } = {}) {
  return bare({
    title: 'Iniciar sesión',
    body: `<div class="login-wrap">
      <div class="login-card">
        <img src="/logo-syf.png" alt="S&F Industria de la limpieza">
        <h1>Plataforma S&amp;F</h1>
        <p class="sub">Industria de la limpieza</p>
        ${error ? `<div class="alert error">${esc(error)}</div>` : ''}
        <form method="POST" action="/login">
          <div class="field">
            <label>Correo</label>
            <input type="email" name="email" required autofocus placeholder="tucorreo@ejemplo.com">
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input type="password" name="password" required placeholder="••••••••">
          </div>
          <button class="btn" style="width:100%" type="submit">Entrar</button>
        </form>
        <p class="muted" style="margin-top:18px;font-size:.8rem">
          ¿Sin acceso? Contacta al administrador para activar tu cuenta.
        </p>
      </div>
    </div>`,
  });
}

export function panelPage(user) {
  const mods = userModules(user);
  const cards = mods.length
    ? `<div class="grid cols-3">${mods.map((m) => `
        <a href="/modulos/${m.slug}" class="card" style="text-decoration:none;color:inherit">
          <div style="font-size:2rem">${m.icon || '•'}</div>
          <h3 style="margin:8px 0 4px">${esc(m.name)}</h3>
          <p class="muted" style="font-size:.85rem;margin:0">${esc(m.description || '')}</p>
        </a>`).join('')}</div>`
    : `<div class="alert warn">
        Todavía no tienes módulos activos. Contacta al administrador para que active tu acceso.
       </div>`;

  const adminNote = user.role === 'admin'
    ? `<div class="card" style="margin-bottom:20px;background:var(--syf-green-100)">
         <b>Eres administrador.</b> Ve al panel de
         <a href="/admin">Administración</a> para crear usuarios, asignar permisos y editar contenido.
       </div>` : '';

  return shell({
    user, activeSlug: 'panel', title: 'Inicio',
    body: `<div class="pagehead">
        <h2 style="margin:0">¡Hola, ${esc((user.full_name || user.email).split(' ')[0])}! 👋</h2>
        <p class="muted">Bienvenido a tu plataforma S&F. Estos son tus módulos disponibles:</p>
      </div>
      ${adminNote}
      ${cards}`,
  });
}

export function errorPage({ user, code, message }) {
  const body = `<div style="text-align:center;padding:60px 20px">
      <img src="/logo-syf.png" width="90" alt="S&F">
      <h1 style="color:var(--syf-danger)">${code}</h1>
      <p class="muted">${esc(message)}</p>
      <a class="btn" href="${user ? '/panel' : '/login'}">Volver</a>
    </div>`;
  return user
    ? shell({ user, activeSlug: '', title: `Error ${code}`, body })
    : bare({ title: `Error ${code}`, body });
}
