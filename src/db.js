// Almacén de datos autocontenido basado en un archivo JSON.
// Simple, sin dependencias externas y suficiente para el alcance inicial.
// Ruta de migración: reemplazar esta capa por Supabase/PostgreSQL sin tocar las vistas.

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'db.json');

const EMPTY_DB = {
  profiles: [],
  modules: [],
  user_module_permissions: [],
  articles: [],
  products: [],
  formulas: [],
  formula_ingredients: [],
  dangerous_mixes: [],
  machines: [],
  payments: [],
  sessions: [],
};

let cache = null;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function load() {
  if (cache) return cache;
  ensureDir();
  if (existsSync(DB_PATH)) {
    cache = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    // Garantiza que existan todas las colecciones aunque el archivo sea viejo.
    for (const key of Object.keys(EMPTY_DB)) {
      if (!cache[key]) cache[key] = [];
    }
  } else {
    cache = structuredClone(EMPTY_DB);
    persist();
  }
  return cache;
}

export function persist() {
  ensureDir();
  const tmp = DB_PATH + '.tmp';
  writeFileSync(tmp, JSON.stringify(cache, null, 2));
  renameSync(tmp, DB_PATH); // escritura atómica
}

export function resetDb() {
  cache = structuredClone(EMPTY_DB);
  persist();
  return cache;
}

// ---- Helpers CRUD genéricos ----

export function all(collection) {
  return load()[collection];
}

export function find(collection, predicate) {
  return load()[collection].find(predicate);
}

export function filter(collection, predicate) {
  return load()[collection].filter(predicate);
}

export function insert(collection, record) {
  const db = load();
  const row = { id: record.id || randomUUID(), ...record };
  db[collection].push(row);
  persist();
  return row;
}

export function update(collection, id, patch) {
  const db = load();
  const row = db[collection].find((r) => r.id === id);
  if (!row) return null;
  Object.assign(row, patch);
  persist();
  return row;
}

export function remove(collection, id) {
  const db = load();
  const before = db[collection].length;
  db[collection] = db[collection].filter((r) => r.id !== id);
  const changed = db[collection].length !== before;
  if (changed) persist();
  return changed;
}

export { DB_PATH, EMPTY_DB };
