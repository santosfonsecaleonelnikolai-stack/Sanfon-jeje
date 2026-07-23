// Autenticación autocontenida: hash de contraseñas con scrypt y sesiones
// firmadas en cookie. Sin dependencias externas.

import { scryptSync, randomBytes, timingSafeEqual, randomUUID } from 'node:crypto';
import { all, find, insert, remove, update } from './db.js';

const SESSION_COOKIE = 'syf_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 horas

// ---- Contraseñas ----

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, key] = stored.split(':');
  const derived = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}

// ---- Sesiones ----

export function createSession(userId) {
  const token = randomUUID() + randomUUID().replace(/-/g, '');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  insert('sessions', { id: token, user_id: userId, expires_at: expiresAt });
  return token;
}

export function destroySession(token) {
  if (token) remove('sessions', token);
}

export function getSessionUser(token) {
  if (!token) return null;
  const session = find('sessions', (s) => s.id === token);
  if (!session) return null;
  if (session.expires_at < Date.now()) {
    remove('sessions', token);
    return null;
  }
  const user = find('profiles', (p) => p.id === session.user_id);
  if (!user || !user.is_active) return null;
  // Verifica vencimiento de acceso (compra con expiración opcional).
  if (user.access_expires_at && new Date(user.access_expires_at) < new Date()) {
    return null;
  }
  return user;
}

// ---- Cookies ----

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(v.join('='));
  }
  return out;
}

export function sessionCookie(token) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export { SESSION_COOKIE };
