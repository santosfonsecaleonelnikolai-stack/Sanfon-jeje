// Siembra la base de datos: módulos, usuario admin y contenido de ejemplo.
// Uso: `node src/seed.js` (no borra si ya hay datos) o `node src/seed.js --reset`.

import { load, resetDb, all, insert, find, update } from './db.js';
import { hashPassword } from './auth.js';
import { MODULES } from './permissions.js';
import { FORMULAS, PRODUCTS, DANGEROUS_MIXES, MACHINES, ARTICLES } from './seed-content.js';

const ADMIN_EMAIL = process.env.SYF_ADMIN_EMAIL || 'admin@syf.com';
const ADMIN_PASSWORD = process.env.SYF_ADMIN_PASSWORD || 'admin123';

export function seed({ reset = false } = {}) {
  if (reset) resetDb();
  const db = load();

  // --- Módulos ---
  if (db.modules.length === 0) {
    for (const m of MODULES) {
      insert('modules', { ...m, is_enabled: true });
    }
  } else {
    // Migración: asegura que los módulos existentes tengan tier, nombre y orden al día.
    for (const m of MODULES) {
      const row = find('modules', (x) => x.slug === m.slug);
      if (row) update('modules', row.id, { tier: m.tier, sort_order: m.sort_order, name: m.name, description: m.description });
    }
  }

  // --- Admin ---
  if (!find('profiles', (p) => p.email === ADMIN_EMAIL)) {
    insert('profiles', {
      email: ADMIN_EMAIL,
      password_hash: hashPassword(ADMIN_PASSWORD),
      full_name: 'Administrador S&F',
      phone: '',
      role: 'admin',
      is_active: true,
      purchased_at: new Date().toISOString().slice(0, 10),
      access_expires_at: null,
      created_at: new Date().toISOString(),
    });
  }

  // --- Contenido de ejemplo (solo si está vacío) ---
  if (db.formulas.length === 0) {
    for (const f of FORMULAS) {
      const { ingredients, ...formula } = f;
      const row = insert('formulas', { ...formula, is_published: true });
      ingredients.forEach((ing, i) =>
        insert('formula_ingredients', { ...ing, formula_id: row.id, sort_order: i }));
    }
  }
  if (db.products.length === 0) {
    for (const p of PRODUCTS) insert('products', { ...p, is_published: true });
  }
  if (db.dangerous_mixes.length === 0) {
    for (const d of DANGEROUS_MIXES) insert('dangerous_mixes', d);
  }
  if (db.machines.length === 0) {
    for (const m of MACHINES) insert('machines', m);
  }
  if (db.articles.length === 0) {
    for (const [moduleSlug, items] of Object.entries(ARTICLES)) {
      const mod = find('modules', (m) => m.slug === moduleSlug);
      for (const a of items) {
        insert('articles', { ...a, module_id: mod ? mod.id : null,
          module_slug: moduleSlug, is_published: true });
      }
    }
  }

  return {
    modules: all('modules').length,
    admin: ADMIN_EMAIL,
    formulas: all('formulas').length,
    products: all('products').length,
  };
}

// Ejecutar directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const reset = process.argv.includes('--reset');
  const result = seed({ reset });
  console.log('Base de datos sembrada:', result);
  console.log(`Admin: ${ADMIN_EMAIL}  /  contraseña: ${ADMIN_PASSWORD}`);
}
