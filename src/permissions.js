// Lógica de permisos por módulo. La verificación SIEMPRE ocurre en el servidor.

import { all, filter, find, insert, remove } from './db.js';

// Catálogo fijo de los módulos (pestañas) de la plataforma.
export const MODULES = [
  { slug: 'formulacion', name: 'Formulación', icon: '🧪', sort_order: 1,
    description: 'Fórmulas de productos de limpieza: ingredientes, porcentajes y procedimiento.' },
  { slug: 'productos', name: 'Nuestros productos', icon: '🧴', sort_order: 2,
    description: 'Catálogo de productos que vende S&F.' },
  { slug: 'marketing', name: 'Cómo hacer marketing', icon: '📣', sort_order: 3,
    description: 'Guías para promover y vender tu negocio de limpieza.' },
  { slug: 'maquinas', name: 'Máquinas y equipo', icon: '⚙️', sort_order: 4,
    description: 'Máquinas industriales que se ocupan para producir.' },
  { slug: 'mezclas-peligrosas', name: 'Mezclas peligrosas', icon: '⚠️', sort_order: 5,
    description: 'Químicos que NUNCA deben mezclarse. Seguridad ante todo.' },
  { slug: 'equipo-minimo', name: 'Equipo mínimo', icon: '🧰', sort_order: 6,
    description: 'Lo básico para empezar tu negocio con costos aproximados.' },
  { slug: 'calculadora', name: 'Calculadora de fórmulas', icon: '🧮', sort_order: 7,
    description: 'Escala fórmulas y calcula costos y ganancias.' },
  { slug: 'usos', name: 'Usos de los productos', icon: '📋', sort_order: 8,
    description: 'Dilución, superficies y precauciones por producto.' },
  { slug: 'formas-de-venta', name: 'Formas de venta', icon: '💰', sort_order: 9,
    description: 'Estrategias de venta: menudeo, mayoreo, ruta y punto de venta.' },
];

export function moduleBySlug(slug) {
  return find('modules', (m) => m.slug === slug);
}

export function allModules() {
  return all('modules').slice().sort((a, b) => a.sort_order - b.sort_order);
}

// Devuelve los módulos que un usuario puede ver.
export function userModules(user) {
  if (!user) return [];
  if (user.role === 'admin') return allModules();
  const perms = filter('user_module_permissions', (p) => p.user_id === user.id);
  const allowedIds = new Set(perms.map((p) => p.module_id));
  return allModules().filter((m) => allowedIds.has(m.id) && m.is_enabled !== false);
}

// ¿El usuario puede ver este módulo por slug?
export function canAccess(user, slug) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const mod = moduleBySlug(slug);
  if (!mod || mod.is_enabled === false) return false;
  return !!find('user_module_permissions',
    (p) => p.user_id === user.id && p.module_id === mod.id);
}

export function grant(userId, moduleId, grantedBy) {
  const existing = find('user_module_permissions',
    (p) => p.user_id === userId && p.module_id === moduleId);
  if (existing) return existing;
  return insert('user_module_permissions', {
    user_id: userId, module_id: moduleId,
    granted_by: grantedBy, granted_at: new Date().toISOString(),
  });
}

export function revoke(userId, moduleId) {
  const row = find('user_module_permissions',
    (p) => p.user_id === userId && p.module_id === moduleId);
  if (row) remove('user_module_permissions', row.id);
}

export function userPermissionIds(userId) {
  return new Set(
    filter('user_module_permissions', (p) => p.user_id === userId).map((p) => p.module_id)
  );
}
