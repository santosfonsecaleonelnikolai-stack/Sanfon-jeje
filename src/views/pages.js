// Vistas: login, panel de inicio y páginas de error.

import { bare, shell, esc, coverImg, moduleImage } from './layout.js';
import { userModules } from '../permissions.js';

// Burbujas flotantes decorativas para el login.
function bubbles() {
  const specs = [
    [8, 12, 10, 0], [22, 40, 16, 2], [38, 24, 8, 1], [55, 60, 20, 3],
    [68, 30, 12, 0.5], [80, 50, 9, 2.5], [90, 20, 14, 1.5], [15, 70, 11, 4],
    [45, 85, 7, 3.5], [72, 78, 15, 0.8],
  ];
  return `<div class="bubbles">${specs.map(([left, size, dur, delay]) =>
    `<span style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur + 8}s;animation-delay:${delay}s"></span>`
  ).join('')}</div>`;
}

export function loginPage({ error } = {}) {
  return bare({
    title: 'Iniciar sesión',
    body: `<div class="login-wrap">
      ${coverImg('img/login-bg.png', { cls: 'login-bg-img' })}
      ${bubbles()}
      <div class="login-card">
        <div class="logo-badge"><img src="/logo-syf.png" alt="S&F Industria de la limpieza"></div>
        <h1>Plataforma S&amp;F</h1>
        <p class="sub">Industria de la limpieza</p>
        ${error ? `<div class="alert error">⚠️ ${esc(error)}</div>` : ''}
        <form method="POST" action="/login">
          <div class="field">
            <label>Correo</label>
            <input type="email" name="email" required autofocus placeholder="tucorreo@ejemplo.com">
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input type="password" name="password" required placeholder="••••••••">
          </div>
          <button class="btn block" type="submit">Entrar →</button>
        </form>
        <p class="muted" style="margin-top:20px;font-size:.8rem">
          ¿Sin acceso? Contacta al administrador para activar tu cuenta.
        </p>
      </div>
    </div>`,
  });
}

export function panelPage(user) {
  const mods = userModules(user);
  const cards = mods.length
    ? `<div class="grid cols-3 stagger">${mods.map((m) => `
        <a href="/modulos/${m.slug}" class="mod-card">
          <div class="mod-cover">
            ${coverImg(moduleImage(m.slug))}
            <span class="emoji">${m.icon || '•'}</span>
          </div>
          <div class="mod-body">
            <h3>${esc(m.name)}</h3>
            <p>${esc(m.description || '')}</p>
            <span class="mod-go">Entrar <span class="arrow">→</span></span>
          </div>
        </a>`).join('')}</div>`
    : `<div class="card" style="text-align:center;padding:44px">
        ${coverImg('img/empty-state.png', { cls: 'empty-img', style: 'max-width:200px;margin:0 auto 14px;display:block' })}
        <h3 style="margin:0 0 6px">Aún no tienes módulos activos</h3>
        <p class="muted" style="margin:0">Contacta al administrador para que active tu acceso.</p>
       </div>`;

  const adminNote = user.role === 'admin'
    ? `<div class="card hover" style="margin-bottom:22px;background:linear-gradient(135deg,#fff,var(--syf-green-50));display:flex;gap:14px;align-items:center">
         <div style="font-size:2rem">🛠️</div>
         <div>
           <b>Eres administrador.</b> <span class="muted">Ve al panel de
           <a href="/admin">Administración</a> para crear usuarios, asignar permisos y editar contenido.</span>
         </div>
       </div>` : '';

  const firstName = esc((user.full_name || user.email).split(' ')[0]);

  return shell({
    user, activeSlug: 'panel', title: 'Inicio',
    body: `<div class="hero reveal">
        ${coverImg('img/hero-dashboard.png', { cls: 'hero-img' })}
        <h2>¡Hola, ${firstName}! 👋</h2>
        <p>Bienvenido a tu plataforma S&F. Aquí tienes todo lo que necesitas para producir y vender productos de limpieza.</p>
        <svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" width="100%" height="40">
          <path fill="rgba(255,255,255,.14)" d="M0,32 C240,64 480,0 720,24 C960,48 1200,8 1440,32 L1440,60 L0,60 Z"/>
        </svg>
      </div>
      ${adminNote}
      <h3 style="margin:0 0 16px">Tus módulos</h3>
      ${cards}`,
  });
}

export function errorPage({ user, code, message }) {
  const body = `<div style="text-align:center;padding:70px 20px">
      <div class="logo-badge" style="width:96px;height:96px;margin:0 auto 16px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh)">
        <img src="/logo-syf.png" width="76" alt="S&F">
      </div>
      <h1 style="color:var(--syf-danger);font-size:3rem;margin:0">${code}</h1>
      <p class="muted" style="margin:8px 0 20px">${esc(message)}</p>
      <a class="btn" href="${user ? '/panel' : '/login'}">Volver</a>
    </div>`;
  return user
    ? shell({ user, activeSlug: '', title: `Error ${code}`, body })
    : bare({ title: `Error ${code}`, body });
}
