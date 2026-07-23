# S&F Industria de la Limpieza — Plataforma

Herramienta web que S&F vende a sus clientes. El **administrador** crea las cuentas y decide qué pestañas (módulos) puede ver cada usuario. Cada cliente entra con su correo y contraseña y solo ve los módulos que tiene autorizados.

![S&F](assets/logo-syf.png)

## ¿Qué incluye?

- **Login** con la marca S&F (logo + paleta verde del logotipo).
- **Panel de administración** para:
  - Crear, suspender y reactivar usuarios; restablecer contraseñas.
  - Asignar permisos por módulo (con botones rápidos: acceso total, quitar todo, paquete básico).
  - Gestionar el contenido (productos, fórmulas, mezclas peligrosas, máquinas/equipo).
- **Navegación dinámica**: la barra lateral muestra solo los módulos autorizados. El control de acceso también se aplica en el servidor (las URLs de módulos no permitidos devuelven 403).
- **Módulos**: Formulación, Nuestros productos, Cómo hacer marketing, Máquinas y equipo, Mezclas peligrosas, Equipo mínimo, Calculadora de fórmulas, Usos de los productos y Formas de venta.
- **Calculadora de fórmulas** (herramienta estrella): escala los ingredientes según los litros a producir, calcula costo total, costo por litro y ganancia/margen, e imprime una hoja de producción con el logo.

## Requisitos

- Node.js 20 o superior. **No requiere instalar dependencias** (usa solo módulos nativos de Node).

## Cómo correr localmente

```bash
# 1. Sembrar la base de datos (crea los módulos, el admin y contenido de ejemplo)
npm run seed

# 2. Iniciar el servidor
npm start

# Abrir http://localhost:3000
```

Credenciales del administrador por defecto:

- **Correo:** `admin@syf.com`
- **Contraseña:** `admin123`

> Cambia estas credenciales definiendo `SYF_ADMIN_EMAIL` y `SYF_ADMIN_PASSWORD` (ver `.env.example`) **antes** de sembrar, o crea un nuevo admin y borra el de ejemplo.

## Cómo crear el primer usuario cliente

1. Entra como administrador en `/admin`.
2. En **Usuarios → Nuevo usuario**, llena nombre, correo y contraseña temporal (y fecha de compra/vencimiento si aplica).
3. Abre el usuario con **Gestionar** y marca los módulos que podrá ver. Guarda.
4. Entrega al cliente su correo y contraseña. Al entrar, solo verá esos módulos.

## Estructura del proyecto

```
server.js              Servidor HTTP y enrutamiento
src/
  db.js                Almacén de datos (archivo JSON)
  auth.js              Contraseñas (scrypt) y sesiones
  permissions.js       Catálogo de módulos y lógica de permisos
  seed.js              Siembra módulos, admin y contenido
  seed-content.js      Contenido de ejemplo de la industria de la limpieza
  views/               Render de HTML (layout, login, panel, módulos, admin, calculadora)
public/                Estáticos: logo, estilos S&F, JS del cliente
data/db.json           Base de datos en tiempo de ejecución (se crea sola; no se versiona)
assets/logo-syf.png    Logo oficial de la marca
PLAN.md                Plan detallado de construcción por fases
```

## Respaldo de datos

Toda la información vive en `data/db.json`. Para respaldar, copia ese archivo. Para restaurar, reemplázalo (con el servidor detenido).

## Seguridad

- Las contraseñas se guardan con hash **scrypt** + sal (nunca en texto plano).
- Las sesiones usan cookies `HttpOnly` con expiración.
- El acceso a cada módulo se verifica **en el servidor**, no solo ocultando pestañas.
- Un usuario suspendido o con acceso vencido no puede iniciar sesión.

## Nota sobre el stack

El plan original (ver `PLAN.md`) recomienda **Next.js + Supabase** para producción a mayor escala. Esta implementación usa un stack **autocontenido sin dependencias** (Node.js nativo + almacén JSON) para que la aplicación funcione de inmediato sin configurar servicios externos. La capa de datos (`src/db.js`) está aislada, de modo que migrar a PostgreSQL/Supabase más adelante no requiere reescribir las vistas ni la lógica de permisos.

## Despliegue

Cualquier servicio que corra Node.js sirve (Render, Railway, Fly.io, un VPS, etc.):

1. Define las variables de entorno (`PORT`, `SYF_ADMIN_EMAIL`, `SYF_ADMIN_PASSWORD`).
2. Ejecuta `npm run seed` una vez y luego `npm start`.
3. Asegura persistencia del archivo `data/db.json` (disco persistente).
