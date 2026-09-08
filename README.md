# Intensivo · IA Business Lab

Aplicación web para gestionar los "Intensivos" de 30 días de IA Business Lab: vista pública para
alumnos y panel de administrador para gestionar contenido, desbloqueos, ediciones y alumnos.

Todo el contenido (ediciones, días, catálogo, plantillas, skill) vive en la base de datos. No hay
nada hardcodeado en el código: crear una nueva edición no requiere tocar ni una línea.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **Tailwind CSS**
- **Prisma** sobre **PostgreSQL** — usado como motor Postgres estándar, sin ningún SDK ni función
  específica de Supabase (ni cliente `@supabase/*`, ni su Auth, ni su Storage). Esto significa que
  la app se puede migrar a cualquier otro Postgres (Neon, Railway, RDS, uno propio) cambiando solo
  `DATABASE_URL` / `DIRECT_URL`.

## Estructura relevante

```
prisma/schema.prisma       Modelo de datos (Edition, Day, Student, Progress, Resource, SkillFile)
prisma/seed.ts              Seed de la edición "Intensivo Septiembre 2026"
lib/actions/public.ts       Server actions de la vista pública (alumno)
lib/actions/admin.ts        Server actions del panel de administrador
lib/auth.ts                 Firma/verificación de la cookie de sesión de admin (HMAC, Web Crypto)
middleware.ts                Protección de /admin/* con la cookie firmada
app/(vista pública)          "/", "/dias", "/dias/[dayNumber]"
app/admin/(panel)            "/admin", "/admin/days", "/admin/students", "/admin/resources",
                              "/admin/editions" — protegidas por middleware
app/admin/login              Login del panel (fuera de la protección del middleware)
```

## Cómo funciona la sesión de alumno

No hay login de alumno. Al entrar por primera vez, el alumno elige su edición (si hay más de una
activa) y escribe su nombre; se crea un `Student` en la base de datos y su `id` se guarda en
`localStorage` del navegador. Mientras ese `localStorage` exista, la app lo reconoce. Borrar el
navegador o cambiar de dispositivo obliga a introducir el nombre de nuevo (se creará otro
`Student`; es un diseño deliberadamente simple, sin contraseñas para alumnos).

## Cómo funciona la sesión de admin

`/admin/login` comprueba la contraseña contra `ADMIN_PASSWORD` y, si es correcta, guarda una
cookie `httpOnly` firmada con HMAC-SHA256 (usando `ADMIN_PASSWORD` como secreto, vía Web Crypto,
compatible con el middleware en edge runtime). El middleware exige esa cookie válida en cualquier
ruta bajo `/admin/*` excepto `/admin/login`.

## Desarrollo local

```bash
npm install
cp .env.example .env   # y rellena DATABASE_URL, DIRECT_URL, ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Variables de entorno

| Variable         | Uso                                                                 |
|-------------------|----------------------------------------------------------------------|
| `DATABASE_URL`    | Connection string con pooler (pgbouncer, puerto 6543). La usa la app en runtime. |
| `DIRECT_URL`      | Connection string directa (puerto 5432). La usa Prisma solo para migraciones. |
| `ADMIN_PASSWORD`  | Contraseña del panel `/admin` y secreto para firmar la cookie de sesión. |

---

## Despliegue en producción (Supabase + Vercel, plan gratuito)

### 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**. Elige nombre, contraseña de base
   de datos (guárdala, la necesitarás) y región.
2. Espera a que el proyecto termine de aprovisionarse.

### 2. Obtener los dos connection strings

En el dashboard de Supabase: **Project Settings → Database → Connection string**.

- **`DATABASE_URL`** (para la app, en runtime): selecciona el modo **"Transaction"** (pooler,
  puerto **6543**, PgBouncer). Copia la URI y añade `?pgbouncer=true&connection_limit=1` al final
  si no lo trae ya. Sustituye `[YOUR-PASSWORD]` por la contraseña de la base de datos.
- **`DIRECT_URL`** (solo para migraciones): selecciona el modo **"Session"** o la conexión
  **directa** (puerto **5432**, sin pooler). Mismo usuario/contraseña.

Ejemplo de forma (los valores reales los da Supabase):

```
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

El `schema.prisma` ya declara ambas (`url` = `DATABASE_URL`, `directUrl` = `DIRECT_URL`), así que
no hay que tocar código: solo estas dos variables.

### 3. Conectar el repositorio de GitHub a Vercel

1. Sube este proyecto a un repositorio de GitHub (si aún no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <url-de-tu-repo>
   git push -u origin main
   ```
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa ese repositorio.
3. Vercel detecta Next.js automáticamente (Framework Preset: Next.js). No hace falta cambiar el
   build command (`prisma generate && next build`, ya definido en `package.json`).

### 4. Configurar las variables de entorno en Vercel

En **Project Settings → Environment Variables**, añade (para Production, y opcionalmente Preview):

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD` (elige una contraseña fuerte; es la que usarás para entrar en `/admin`)

### 5. Ejecutar las migraciones y el seed en producción

Puedes hacerlo desde tu máquina, apuntando a la base de datos de Supabase (usa las mismas
variables que pusiste en Vercel):

```bash
# En la raíz del proyecto, con las variables de producción en tu entorno local:
export DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1"
export DIRECT_URL="postgresql://...:5432/postgres"
export ADMIN_PASSWORD="tu-contraseña"

npx prisma migrate deploy
npm run seed
```

En PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1"
$env:DIRECT_URL   = "postgresql://...:5432/postgres"
$env:ADMIN_PASSWORD = "tu-contraseña"

npx prisma migrate deploy
npm run seed
```

`prisma migrate deploy` usa `DIRECT_URL` para aplicar las migraciones (necesita conexión directa,
sin pooler). El seed crea la edición "Intensivo Septiembre 2026" con sus 7 días de contenido, los
días 8-30 como tarjetas bloqueadas pendientes de rellenar, el catálogo de 5 servicios, las 3
plantillas y la skill.

Si alguna vez necesitas volver a ejecutar el seed, es seguro: si la edición
"Intensivo Septiembre 2026" ya existe, el script no hace nada y te avisa por consola.

### 6. Desplegar

Si ya conectaste el repo en el paso 3, Vercel despliega automáticamente en cada push a `main`. Si
quieres forzar el primer despliegue después de configurar las variables, ve a **Deployments** →
**Redeploy** en el último deployment (o simplemente haz un nuevo push).

### 7. Verificar que todo funciona

1. Abre la URL de producción (`https://tu-proyecto.vercel.app`). Deberías ver la pantalla de
   bienvenida pidiendo tu nombre (con una única edición activa, se salta el selector).
2. Escribe un nombre de prueba y entra: deberías ver las 30 tarjetas, con el día 1 desbloqueado.
3. Abre el día 1, márcalo como "Lo he hecho" y comprueba que la barra de progreso sube.
4. Ve a `https://tu-proyecto.vercel.app/admin`, entra con `ADMIN_PASSWORD`.
5. En **Días**, desbloquea el día 2 y comprueba que aparece desbloqueado en la vista pública.
6. En **Alumnos**, comprueba que aparece el alumno de prueba con 1 día completado.
7. En **Recursos**, comprueba que ves el catálogo, las plantillas y la skill del seed.
8. En **Ediciones**, prueba a clonar la edición para verificar el flujo de creación de una edición
   nueva (puedes borrar después esa edición de prueba directamente en Supabase si no la quieres).

---

## Notas

- **Seguridad de Next.js 14.x**: este proyecto usa la última versión parcheada de la rama 14
  (`14.2.35`). Hay un aviso moderado (`GHSA-955p-x3mx-jcvp`, exposición no autenticada de metadata
  de Server Functions) que afecta a toda la rama 14.x y solo se resuelve saltando a Next 15.5.21+
  o Next 16. Si en el futuro quieres cerrar ese aviso, el camino es migrar a Next 15/16 (App
  Router es compatible, pero conviene revisar el changelog antes de saltar versión mayor).
- El contenido HTML de `action_html` / `note_html` / catálogo / plantillas / instrucciones de
  skill se renderiza tal cual lo escribe el administrador (campo de texto en el panel). Solo el
  admin autenticado puede escribir ahí, por eso no se sanea: trátalo como contenido de confianza.
- El botón "Copiar" de catálogo y plantillas copia el texto plano (sin las etiquetas HTML) para
  que se pueda pegar directamente en WhatsApp o email.
