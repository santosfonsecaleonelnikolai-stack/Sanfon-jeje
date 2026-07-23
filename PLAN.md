# Plan Detallado de Construcción — Plataforma S&F Industria de la Limpieza

> **Documento maestro de ejecución.** Este plan está escrito para que el modelo **Claude Opus 4.8** lo siga paso a paso, en orden, para construir la aplicación completa. Cada fase indica qué construir, cómo verificarlo y qué entregar antes de pasar a la siguiente.

---

## 1. Visión general del producto

**¿Qué es?** Una aplicación web (plataforma tipo SaaS) que S&F Industria de la Limpieza vende a sus clientes. Los usuarios que compran acceso reciben credenciales y pueden entrar únicamente a las pestañas (módulos) que el administrador les haya autorizado.

**Modelo de negocio:**
1. Un cliente compra el acceso (fuera de la app o dentro de ella en fases futuras).
2. El **administrador** crea la cuenta del usuario y le asigna permisos por módulo.
3. El usuario inicia sesión y ve solo las pestañas habilitadas para él.

**Los módulos (pestañas) de la plataforma:**

| # | Módulo | Contenido |
|---|--------|-----------|
| 1 | **Formulación** | Fórmulas de productos de limpieza: ingredientes, porcentajes, procedimiento de elaboración, notas técnicas. |
| 2 | **Nuestros productos (S&F)** | Catálogo de los productos que vende S&F: nombre, foto, descripción, presentaciones, precio sugerido. |
| 3 | **Cómo hacer marketing** | Guías de marketing: redes sociales, marca, empaque, publicidad local, fidelización de clientes. |
| 4 | **Máquinas y equipo industrial** | Máquinas que se ocupan para producir: mezcladoras, envasadoras, etiquetadoras; especificaciones y proveedores. |
| 5 | **Mezclas peligrosas** | ⚠️ Módulo de seguridad: qué químicos NUNCA deben mezclarse, riesgos, primeros auxilios, equipo de protección. |
| 6 | **Equipo mínimo para empezar** | Lista del equipo básico para arrancar el negocio: recipientes, básculas, agitadores, EPP, con costos aproximados. |
| 7 | **Calculadora de fórmulas** | Herramienta interactiva: el usuario indica cuántos litros quiere producir y la app escala automáticamente las cantidades de cada ingrediente y calcula el costo. |
| 8 | **Usos de los productos** | Fichas de uso: dilución recomendada, superficies, frecuencia, precauciones por producto. |
| 9 | **Formas de venta** | Estrategias de venta: menudeo, mayoreo, ruta de reparto, punto de venta, precios y márgenes. |
| 10 | **Administración** (solo admin) | Gestión de usuarios, asignación de permisos por módulo, gestión del contenido de todos los módulos. |

---

## 2. Identidad visual (obligatoria en toda la app)

El diseño completo se basa en el logo oficial (`assets/logo-syf.png`): gota verde con hoja, monograma **S&F** y lema "Industria de la limpieza".

### Paleta de colores (tomada del logo)

| Token | Hex | Uso |
|-------|-----|-----|
| `--syf-green-700` | `#1F6B22` | Textos sobre fondos claros, hover de botones |
| `--syf-green-600` | `#2E8B2E` | **Color primario** (botones, barra de navegación, enlaces) — verde del logo |
| `--syf-green-500` | `#3DA53D` | Acentos, íconos, estados activos |
| `--syf-green-100` | `#E4F3E4` | Fondos de tarjetas, hover suave, badges |
| `--syf-green-50` | `#F2FAF2` | Fondo general de páginas |
| `--syf-white` | `#FFFFFF` | Fondo de tarjetas y superficies |
| `--syf-ink` | `#1C2B1C` | Texto principal (verde-negro) |
| `--syf-gray` | `#6B7A6B` | Texto secundario |
| `--syf-danger` | `#C62828` | Solo para el módulo de mezclas peligrosas y errores |
| `--syf-warning` | `#F9A825` | Advertencias |

### Reglas de diseño
- El **logo aparece** en: pantalla de login (grande, centrado), barra lateral/navegación (versión pequeña), favicon y pantallas de carga.
- Tipografía: **Poppins** o **Montserrat** (redondeada, similar al lema del logo) para títulos; **Inter** para texto.
- Formas: bordes muy redondeados (radio 12–16 px) y motivo de "gota" en detalles decorativos, haciendo eco del logo.
- Modo claro por defecto (fondo `--syf-green-50`); el módulo "Mezclas peligrosas" usa acentos rojos sobre el mismo sistema para comunicar peligro.
- Toda pantalla debe verse bien en **celular, tableta y computadora** (los clientes usarán mayormente el teléfono).

---

## 3. Stack tecnológico recomendado

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | **Next.js 15 (React) + Tailwind CSS** | Una sola base de código, rápido, diseño consistente con tokens de color. |
| Backend / API | **Next.js API routes (o Route Handlers)** | Evita mantener dos proyectos; suficiente para este alcance. |
| Base de datos + Auth | **Supabase** (PostgreSQL + Auth + Storage) | Autenticación lista, Row Level Security para permisos por módulo, storage para fotos de productos y PDFs. Plan gratuito suficiente para arrancar. |
| Hosting | **Vercel** | Deploy automático desde GitHub, gratis para empezar. |
| Idioma de toda la UI | **Español** | Público objetivo hispanohablante. |

> Alternativa si se prefiere todo autocontenido: SQLite + NextAuth. Pero Supabase es la ruta recomendada por velocidad de desarrollo.

---

## 4. Modelo de datos

```sql
-- Usuarios (Supabase Auth maneja credenciales; esta tabla guarda el perfil)
profiles (
  id uuid PK -> auth.users,
  full_name text,
  phone text,
  role text CHECK (role IN ('admin', 'cliente')) DEFAULT 'cliente',
  is_active boolean DEFAULT true,          -- el admin puede suspender acceso
  purchased_at date,                        -- fecha de compra
  access_expires_at date NULL,              -- opcional: acceso con vencimiento
  created_at timestamptz
)

-- Catálogo de módulos (las pestañas)
modules (
  id serial PK,
  slug text UNIQUE,        -- 'formulacion', 'productos', 'marketing', 'maquinas',
                           -- 'mezclas-peligrosas', 'equipo-minimo', 'calculadora',
                           -- 'usos', 'formas-de-venta'
  name text,
  description text,
  icon text,
  sort_order int,
  is_enabled boolean DEFAULT true
)

-- Permisos: qué usuario puede ver qué módulo
user_module_permissions (
  user_id uuid FK -> profiles,
  module_id int FK -> modules,
  granted_by uuid FK -> profiles,
  granted_at timestamptz,
  PRIMARY KEY (user_id, module_id)
)

-- Contenido de módulos informativos (artículos/fichas)
articles (
  id uuid PK,
  module_id int FK -> modules,
  title text,
  body markdown/richtext,
  cover_image_url text,
  attachments jsonb,        -- PDFs, videos
  is_published boolean,
  sort_order int,
  created_at, updated_at
)

-- Productos S&F
products (
  id uuid PK,
  name text,
  description text,
  image_url text,
  presentations jsonb,      -- [{tamaño: "1L", precio: 45}, ...]
  category text,
  usage_instructions text,  -- alimenta también el módulo "Usos"
  is_published boolean
)

-- Fórmulas (módulo Formulación + Calculadora)
formulas (
  id uuid PK,
  name text,                -- "Jabón líquido para trastes"
  description text,
  yield_liters numeric,     -- rendimiento base, ej. 20 L
  procedure text,           -- pasos de elaboración
  safety_notes text,
  is_published boolean
)

formula_ingredients (
  id uuid PK,
  formula_id uuid FK,
  ingredient_name text,
  quantity numeric,
  unit text,                -- kg, L, g, mL
  cost_per_unit numeric,    -- para que la calculadora estime costos
  sort_order int
)

-- Mezclas peligrosas
dangerous_mixes (
  id uuid PK,
  chemical_a text,
  chemical_b text,
  danger_level text CHECK (IN ('alto','medio','bajo')),
  reaction text,            -- qué ocurre (gases tóxicos, etc.)
  first_aid text,
  prevention text
)

-- Máquinas y equipo
machines (
  id uuid PK,
  name text,
  purpose text,
  image_url text,
  approx_price_range text,
  supplier_info text,
  module text CHECK (IN ('maquinas','equipo-minimo')),
  is_essential boolean      -- true = aparece en "Equipo mínimo"
)
```

**Seguridad de datos (Row Level Security en Supabase):**
- `profiles`: cada usuario lee solo su fila; admin lee todas.
- Todas las tablas de contenido: `SELECT` permitido solo si existe fila en `user_module_permissions` para ese usuario y módulo, **y** `is_active = true` **y** (sin vencimiento o `access_expires_at > now()`).
- `INSERT/UPDATE/DELETE` de contenido: solo `role = 'admin'`.
- El chequeo de permisos **siempre se hace en el servidor/BD**, nunca solo ocultando pestañas en el frontend.

---

## 5. Fases de construcción (orden de ejecución para Opus 4.8)

### FASE 0 — Cimientos del proyecto (½ día)
1. Inicializar proyecto Next.js 15 con TypeScript, Tailwind CSS y ESLint.
2. Configurar tokens de color de la sección 2 en `tailwind.config` / CSS variables.
3. Instalar fuentes (Poppins + Inter) vía `next/font`.
4. Colocar `assets/logo-syf.png` en `public/` y generar favicon a partir de él.
5. Crear layout base: barra lateral verde con logo, área de contenido, responsive.
6. **Verificación:** `npm run dev` levanta, se ve el layout con logo y colores S&F.

### FASE 1 — Autenticación y roles (1 día)
1. Crear proyecto Supabase; configurar variables de entorno (`.env.local`, nunca commiteadas).
2. Implementar login con correo y contraseña (pantalla con logo grande, fondo `--syf-green-50`).
3. Crear tablas `profiles`, `modules`, `user_module_permissions` con sus políticas RLS.
4. Sembrar (`seed`) los 9 módulos en la tabla `modules`.
5. Middleware de Next.js: sin sesión → redirige a `/login`; con sesión → carga perfil y permisos.
6. Crear el primer usuario admin manualmente (documentar cómo en el README).
7. **Verificación:** un usuario sin permisos entra y ve un panel vacío con mensaje "Contacta al administrador para activar tus módulos"; el admin ve todo.

### FASE 2 — Panel de Administración (2 días) ← **se construye primero, como pidió el dueño**
1. Ruta `/admin` protegida (solo `role = 'admin'`).
2. **Gestión de usuarios:**
   - Listado con búsqueda (nombre, correo, estado).
   - Crear usuario: nombre, correo, teléfono, contraseña temporal, fecha de compra, vencimiento opcional.
   - Activar / suspender usuario (interruptor `is_active`).
   - Restablecer contraseña.
3. **Asignación de permisos:** en la ficha de cada usuario, una cuadrícula de casillas con los 9 módulos; marcar/desmarcar guarda en `user_module_permissions` al instante. Botones rápidos: "Acceso total", "Quitar todo", "Paquete básico" (formulación + calculadora + usos).
4. **Gestión de contenido:** CRUD de artículos, productos, fórmulas + ingredientes, mezclas peligrosas y máquinas, con editor de texto enriquecido y subida de imágenes a Supabase Storage.
5. **Verificación:** el admin crea un usuario de prueba, le da 3 módulos, entra como ese usuario y confirma que ve exactamente esas 3 pestañas y que las URLs de módulos no permitidos responden 403/redirigen.

### FASE 3 — Navegación dinámica por permisos (½ día)
1. La barra lateral se genera desde los permisos del usuario: solo pinta pestañas autorizadas.
2. Página de inicio (`/panel`): saludo con nombre, tarjetas de acceso rápido a sus módulos, logo y frase de bienvenida.
3. Guard de servidor en cada ruta de módulo (doble verificación: UI + servidor).
4. **Verificación:** cambiar permisos desde admin se refleja en la sesión del usuario al recargar.

### FASE 4 — Módulos de contenido (2–3 días)
Construir con una misma plantilla de "lista de fichas → detalle" los módulos:
1. **Nuestros productos:** cuadrícula de tarjetas con foto, nombre y presentaciones; detalle con descripción, precios y usos.
2. **Cómo hacer marketing:** artículos ordenados como mini-curso (lecciones numeradas).
3. **Máquinas:** tarjetas con foto, propósito, rango de precio y datos de proveedor.
4. **Equipo mínimo:** lista tipo checklist con costo aproximado total calculado al final.
5. **Usos de los productos:** buscador + fichas con dilución, superficies y precauciones.
6. **Formas de venta:** artículos con plantillas descargables (listas de precios, guiones de venta).
7. **Verificación:** cada módulo renderiza contenido real sembrado desde el admin, en móvil y escritorio.

### FASE 5 — Formulación y Mezclas peligrosas (1–2 días)
1. **Formulación:** listado de fórmulas; detalle con tabla de ingredientes (cantidad, unidad), procedimiento paso a paso y notas de seguridad; botón directo "Calcular esta fórmula" que abre la calculadora.
2. **Mezclas peligrosas:** diseño distintivo con acentos rojos (`--syf-danger`):
   - Tabla/matriz de combinaciones peligrosas con nivel de riesgo (alto/medio/bajo) por color.
   - Buscador: "¿Puedo mezclar X con Y?" → responde con la ficha del riesgo.
   - Cada ficha: reacción, prevención, primeros auxilios.
   - Aviso legal permanente al pie del módulo.
3. **Verificación:** buscar "cloro + amoniaco" devuelve ficha de riesgo alto con primeros auxilios.

### FASE 6 — Calculadora de fórmulas (1–2 días) ⭐ herramienta estrella
1. El usuario elige una fórmula del catálogo.
2. Ingresa la cantidad a producir (litros o kilos).
3. La app escala cada ingrediente proporcionalmente (`cantidad_base × deseado / rendimiento_base`) y muestra tabla con cantidades exactas y unidades sensatas (g→kg, mL→L cuando corresponda).
4. Calcula **costo total estimado y costo por litro** usando `cost_per_unit`.
5. Campo opcional "precio de venta por litro" → muestra ganancia estimada y margen %.
6. Botones: imprimir / descargar PDF de la hoja de producción con logo S&F.
7. **Verificación:** con una fórmula de 20 L pedida a 50 L, todas las cantidades escalan ×2.5 y el costo coincide con la suma manual.

### FASE 7 — Pulido, seguridad y despliegue (1 día)
1. Revisión de seguridad: RLS activo en todas las tablas, rutas admin inaccesibles para clientes, rate limiting en login, validación de entradas.
2. Estados de carga, páginas de error 403/404 con la marca S&F.
3. SEO básico de la página pública de login + metadatos con logo.
4. Deploy a Vercel + Supabase producción; configurar dominio.
5. README con: cómo correr localmente, cómo crear el primer admin, cómo respaldar la BD.
6. **Verificación final (checklist de aceptación):**
   - [ ] Admin crea usuario y asigna módulos en menos de 1 minuto.
   - [ ] Usuario suspendido no puede entrar aunque tenga la contraseña.
   - [ ] Usuario ve solo sus pestañas; URLs ajenas devuelven 403.
   - [ ] Calculadora escala y costea correctamente.
   - [ ] Todo se ve correcto en un teléfono de gama media.
   - [ ] Logo y paleta verde presentes en cada pantalla.

### FASE 8 — Futuro (no bloquea el lanzamiento)
- Pagos en línea (Stripe/Mercado Pago) para autoservicio de compra.
- App instalable (PWA) con acceso sin conexión a fórmulas.
- Videos tutoriales dentro de los módulos.
- Notificaciones de vencimiento de acceso.
- Reportes para el admin: módulos más usados, usuarios activos.

---

## 6. Estructura de carpetas propuesta

```
/
├── public/
│   └── logo-syf.png
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── panel/                  # inicio del usuario
│   │   ├── admin/
│   │   │   ├── usuarios/
│   │   │   └── contenido/
│   │   └── modulos/
│   │       ├── formulacion/
│   │       ├── productos/
│   │       ├── marketing/
│   │       ├── maquinas/
│   │       ├── mezclas-peligrosas/
│   │       ├── equipo-minimo/
│   │       ├── calculadora/
│   │       ├── usos/
│   │       └── formas-de-venta/
│   ├── components/                 # UI reutilizable (tarjetas, tablas, sidebar)
│   ├── lib/                        # cliente supabase, helpers de permisos
│   └── styles/                     # tokens de color S&F
├── supabase/
│   ├── migrations/                 # SQL versionado
│   └── seed.sql                    # módulos + contenido de ejemplo
└── assets/
    └── logo-syf.png                # original de marca
```

---

## 7. Estimación total

| Fase | Duración estimada |
|------|-------------------|
| 0 – Cimientos | 0.5 días |
| 1 – Auth y roles | 1 día |
| 2 – Panel admin | 2 días |
| 3 – Navegación por permisos | 0.5 días |
| 4 – Módulos de contenido | 2–3 días |
| 5 – Formulación + Mezclas peligrosas | 1–2 días |
| 6 – Calculadora | 1–2 días |
| 7 – Pulido y despliegue | 1 día |
| **Total** | **≈ 9–12 días de desarrollo** |

---

## 8. Instrucciones de ejecución para Opus 4.8

1. Ejecuta las fases **en orden estricto** (0 → 7); no avances sin cumplir la verificación de la fase.
2. Haz **commits pequeños por fase** con mensajes descriptivos en español (ej. `fase 2: panel admin - gestión de usuarios y permisos`).
3. Usa siempre los tokens de color de la sección 2 — nunca colores arbitrarios.
4. Toda la interfaz, mensajes de error y correos van **en español**.
5. Nunca commitear llaves de Supabase; usar `.env.local` y documentar variables en `.env.example`.
6. El contenido de ejemplo (fórmulas, mezclas peligrosas, productos) debe ser realista para la industria de la limpieza, con avisos de seguridad donde aplique.
7. Al terminar cada fase, actualizar el README con lo construido.
