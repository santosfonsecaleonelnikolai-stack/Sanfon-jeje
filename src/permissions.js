// Lógica de permisos por módulo y planes de pago.
// La verificación SIEMPRE ocurre en el servidor.

import { all, filter, find, insert, remove } from './db.js';

// Catálogo fijo de los módulos (pestañas). `tier` = nivel de plan mínimo requerido.
//   tier 1 = Básico · tier 2 = Profesional · tier 3 = Premium
export const MODULES = [
  { slug: 'formulacion', name: 'Formulación', icon: '🧪', sort_order: 1, tier: 1,
    description: 'Fórmulas de productos de limpieza: ingredientes, porcentajes y procedimiento.' },
  { slug: 'usos', name: 'Usos de los productos', icon: '📋', sort_order: 2, tier: 1,
    description: 'Dilución, superficies y precauciones por producto.' },
  { slug: 'calculadora', name: 'Calculadora de fórmulas', icon: '🧮', sort_order: 3, tier: 1,
    description: 'Escala fórmulas y calcula costos y ganancias.' },
  { slug: 'productos', name: 'Nuestros productos', icon: '🧴', sort_order: 4, tier: 2,
    description: 'Catálogo de productos que vende S&F.' },
  { slug: 'marketing', name: 'Cómo hacer marketing', icon: '📣', sort_order: 5, tier: 2,
    description: 'Guías para promover y vender tu negocio de limpieza.' },
  { slug: 'equipo-minimo', name: 'Equipo mínimo', icon: '🧰', sort_order: 6, tier: 2,
    description: 'Lo básico para empezar tu negocio con costos aproximados.' },
  { slug: 'mezclas-peligrosas', name: 'Mezclas peligrosas', icon: '⚠️', sort_order: 7, tier: 2,
    description: 'Químicos que NUNCA deben mezclarse. Seguridad ante todo.' },
  { slug: 'maquinas', name: 'Máquinas y equipo', icon: '⚙️', sort_order: 8, tier: 3,
    description: 'Máquinas industriales que se ocupan para producir.' },
  { slug: 'formas-de-venta', name: 'Formas de venta', icon: '💰', sort_order: 9, tier: 3,
    description: 'Estrategias de venta: menudeo, mayoreo, ruta y punto de venta.' },
];

// Planes de pago. `tier` desbloquea todos los módulos de ese nivel y menores.
export const PLANS = [
  {
    id: 'basico', tier: 1, name: 'Básico', price: 499, period: 'pago único',
    tagline: 'Para arrancar con lo esencial',
    highlight: false, color: 'var(--syf-green-500)',
    features: [
      'Formulación de productos', 'Usos de los productos', 'Calculadora de fórmulas',
      'Acceso desde cualquier dispositivo', 'Actualizaciones incluidas',
    ],
  },
  {
    id: 'profesional', tier: 2, name: 'Profesional', price: 1099, period: 'pago único',
    tagline: 'El más elegido para crecer tu negocio',
    highlight: true, color: 'var(--syf-green-600)',
    features: [
      'Todo lo del plan Básico', 'Nuestros productos (catálogo)', 'Cómo hacer marketing',
      'Equipo mínimo con costos', 'Mezclas peligrosas (seguridad)', 'Soporte prioritario',
    ],
  },
  {
    id: 'premium', tier: 3, name: 'Premium', price: 1399, period: 'pago único',
    tagline: 'Todo el conocimiento S&F, sin límites',
    highlight: false, color: 'var(--syf-green-700)',
    features: [
      'Todo lo del plan Profesional', 'Máquinas y equipo industrial', 'Formas de venta avanzadas',
      'Acceso completo a los 9 módulos', 'Nuevos módulos futuros incluidos', 'Asesoría personalizada',
    ],
  },
];

export function planById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

export function planTier(user) {
  if (!user) return 0;
  if (user.role === 'admin') return 99;
  const plan = planById(user.plan);
  return plan ? plan.tier : 0;
}

export function moduleBySlug(slug) {
  return find('modules', (m) => m.slug === slug);
}

export function allModules() {
  return all('modules').slice().sort((a, b) => a.sort_order - b.sort_order);
}

// Módulos accesibles = por plan (tier) o por permiso explícito del admin.
export function accessibleSlugs(user) {
  if (!user) return new Set();
  if (user.role === 'admin') return new Set(allModules().map((m) => m.slug));
  const tier = planTier(user);
  const perms = filter('user_module_permissions', (p) => p.user_id === user.id);
  const permIds = new Set(perms.map((p) => p.module_id));
  const set = new Set();
  for (const m of allModules()) {
    if (m.is_enabled === false) continue;
    if ((m.tier || 1) <= tier || permIds.has(m.id)) set.add(m.slug);
  }
  return set;
}

// Devuelve los módulos accesibles del usuario.
export function userModules(user) {
  const ok = accessibleSlugs(user);
  return allModules().filter((m) => ok.has(m.slug));
}

// Todos los módulos con bandera `locked` (para pintarlos bloqueados en la UI).
export function modulesWithLock(user) {
  const ok = accessibleSlugs(user);
  return allModules().map((m) => ({ ...m, locked: !ok.has(m.slug) }));
}

// Plan mínimo que desbloquea un módulo.
export function requiredPlanForModule(mod) {
  return PLANS.find((p) => p.tier === (mod.tier || 1)) || PLANS[0];
}

export function canAccess(user, slug) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const mod = moduleBySlug(slug);
  if (!mod || mod.is_enabled === false) return false;
  return accessibleSlugs(user).has(slug);
}

// ---- Permisos manuales (override del admin) ----
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
