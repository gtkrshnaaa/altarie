# Altarie.js Guide

A practical guide to building apps with Altarie.js — a Laravel-like developer experience in pure JavaScript (ESM), powered by Fastify and Nunjucks.

- Status: Early-stage framework
- Node.js: 20+
- Module system: ESM (type: module)

---

## Table of Contents

1. Getting Started
2. Project Structure
3. Environment & Configuration
4. Bootstrapping (Laravel-like Builder)
5. Routing (Explicit vs Autoload)
6. Controllers
7. Views (Nunjucks)
8. Middleware (Aliases, Global, Groups)
9. Exceptions (Error & Not Found)
10. Providers
11. Database & Migrations (better-sqlite3)
12. Testing
13. Static Assets
14. Development Tools
15. Deployment
16. Patterns & Conventions
17. FAQ & Troubleshooting

---

## 1) Getting Started

Install dependencies and run the app in development mode:

```bash
npm install
cp .env.example .env
npm run dev
```

Production mode:

```bash
npm start
```

Open your browser at:

- http://localhost:3000/

Development-only endpoints:

- http://localhost:3000/_altarie/routes
- http://localhost:3000/_altarie/env

---

## 2) Project Structure

Inside the package directory:

```
altarie/
├── app/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── providers/
│   └── views/
├── bootstrap/
│   └── app.js
├── config/
│   ├── app.js
│   ├── database.js
│   └── view.js
├── core/
│   ├── database.js
│   ├── devtools.js
│   ├── env.js
│   ├── error.js
│   └── view.js
├── routes/
│   ├── web.js
│   └── api.js
├── database/
│   ├── migrate.js
│   ├── migrations/
│   └── seeds/
├── public/
│   └── css/
├── tests/
│   └── run.js
├── package.json
└── server.js
```

- `server.js` — app entry, calls `createApp()`.
- `bootstrap/app.js` — kernel wiring (env, logger, static, security, views, routes, errors, providers, devtools).
- `config/` — application, view, and database configuration.
- `core/` — framework internals.
- `routes/` — route modules auto-registered by `@fastify/autoload`.
- `app/` — your application code: controllers, middleware, models, providers, views.
- `database/` — migration runner + folders for migrations/seeds.

---

## 3) Environment & Configuration

Environment variables are loaded via `core/env.js` using `dotenv`.

- Example `.env` keys:
  - `APP_PORT=3000`
  - `NODE_ENV=development`

Configuration files:

- `config/app.js`: app name, env, port
- `config/view.js`: Nunjucks options & `viewsPath`
- `config/database.js`: DB client & connection (default: better-sqlite3 → `database/database.sqlite`)

---

## 4) Bootstrapping (Laravel-like Builder)

`bootstrap/app.js` now uses a fluent API similar to Laravel's `bootstrap/app.php`.

```javascript
// bootstrap/app.js
import path from 'path'
import { fileURLToPath } from 'url'
import { Application } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createApp() {
  return Application
    .configure({ basePath: path.join(__dirname, '..') })
    .withRouting({
      web: path.join(__dirname, '../routes/web.js'),
      api: path.join(__dirname, '../routes/api.js'),
      health: '/up'
    })
    .withMiddleware((mw) => {
      // Aliases
      // mw.alias({ 'auth': yourAuthMiddleware })

      // Global (runs on every request)
      // mw.append(yourGlobalMiddleware)

      // Groups (optional)
      // mw.group('web', [csrfMiddleware, sessionMiddleware])
      // mw.group('api', [rateLimitMiddleware])
    })
    .withExceptions((ex) => {
      // ex.handler((error, request, reply) => { /* custom */ })
      // ex.notFound('errors/404.njk')
    })
    .create()
}
```

Notes:
- `.withRouting()` may be omitted to use autoload from `routes/`.
- `health` adds `GET /up` returning simple JSON.

## 5) Routing (Explicit vs Autoload)

Routes are defined as ESM modules under `routes/` and auto-registered. Each file should export a default async function that receives the Fastify instance.

Example `routes/web.js`:

```js
import { HomeController } from '../app/controllers/HomeController.js'
import { auth } from '../app/middleware/auth.js'

export default async function (app) {
  const home = new HomeController()

  app.get('/', async (request, reply) => home.index(request, reply))

  const preAuth = app.mw.resolve(['auth'])
  app.get('/dashboard', { preHandler: preAuth }, async (request, reply) => {
    return reply.render('dashboard.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  })
}
```

Example `routes/api.js`:

```js
export default async function (app) {
  app.get('/api/health', async () => ({
    status: 'ok',
    name: 'altarie.js',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  }))
}
```

---

## 5) Controllers

Controllers live under `app/controllers/` and encapsulate request handling logic.

```js
// app/controllers/HomeController.js
export class HomeController {
  async index(request, reply) {
    return reply.render('home.njk', { env: process.env.NODE_ENV || 'development' })
  }
}
```

Bind controller methods from your route modules.

---

## 6) Views (Nunjucks)

Nunjucks is configured in `core/view.js`, exposing `reply.render(template, data)`.

- Default path: `app/views/`
- Cache: disabled in development (`noCache: true`)

Common files:

- `app/views/home.njk`
- `app/views/dashboard.njk`
- `app/views/layouts/*`
- `app/views/errors/404.njk` (used by `setNotFoundHandler`)

---

## 8) Middleware (Aliases, Global, Groups)

Configure in builder and/or `bootstrap/config.js`. Use aliases for route-level DX, append for global middleware, and groups for reusable stacks.

```javascript
// In builder
mw.alias({ 'auth': auth, 'auth.admin': adminAuth })
mw.append(requestLogger)
mw.group('web', [csrf, session])
mw.group('api', [rateLimit])

// In routes
const pre = app.mw.resolve(['auth', someMiddleware])
app.get('/secure', { preHandler: pre }, handler)

```js
// app/providers/AppProvider.js
export async function register(app) {
  // Example: app.decorate('version', '0.1.0')
}
```

Registered in `bootstrap/app.js` before `app.listen()`.

---

## 9) Database & Migrations (better-sqlite3)

The default database is SQLite via `better-sqlite3`. A singleton connector lives in `core/database.js`. Migrations are plain JS files executed by `database/migrate.js`.

Run migrations:

```bash
npm run db:migrate
```

Tips:

- Place migration files under `database/migrations/`.
- Keep them idempotent if you plan to re-run in local dev.
- The SQLite file is created automatically at `database/database.sqlite`.

---

## 10) Testing

A basic smoke test is provided:

```bash
npm test
```

`tests/run.js` will start the server and hit `/api/health`.

---

## 9) Exceptions (Error & Not Found)

Use `.withExceptions()` to override error and not-found. Default uses `core/error.js` (Youch in dev) and renders `errors/404.njk`.

- If the client accepts `text/html` and `NODE_ENV=development`, errors are rendered as HTML.
- Otherwise, JSON payloads are returned.
- In production, payloads are compact and do not include stack traces.

---

## 12) Static Assets

`@fastify/static` serves files from `public/`.

- Put CSS/JS/images under `public/`.
- Example: `public/css/app.css` → accessible as `/css/app.css`.

---

## 14) Development Tools

Development-only endpoints (enabled when `NODE_ENV=development`):

- `/_altarie/routes` — list of registered routes.
- `/_altarie/env` — masked environment variables.

These are implemented in `core/devtools.js` via Fastify hooks.

---

## 15) Deployment

General tips:

- Set `NODE_ENV=production`.
- Ensure a writable path for `database/database.sqlite` (or configure an external DB/ORM).
- Use a process manager (pm2/systemd/Docker) to run `node server.js`.
- Configure reverse proxy (nginx/Caddy) if needed.

---

## 16) Patterns & Conventions

- ESM everywhere (no transpilers).
- Convention-over-configuration folder layout.
- Controllers thin, reusable domain logic in separate modules.
- Views for presentation (Nunjucks includes/extends for layouts).
- Middleware focused on cross-cutting concerns (auth, validation, logging).
- Providers to register app-level services/utilities.
- Keep migrations deterministic; reset DB freely in local dev.

---

## 17) FAQ & Troubleshooting

- Q: Fastify fails to start (EADDRINUSE)?
  - A: The port is in use. Change `APP_PORT` in `.env` or terminate the running process.

- Q: Nunjucks template not found?
  - A: Check `config/view.js` `viewsPath` and ensure the file exists under `app/views/`.

- Q: Database file not created?
  - A: Ensure the `database/` directory exists and is writable. The connector creates the directory if missing.

- Q: Pretty logs not showing?
  - A: Ensure `NODE_ENV=development` for `pino-pretty` transport.

- Q: How to add my own provider?
  - A: Create `app/providers/MyProvider.js` with `export async function register(app) { /* ... */ }` and register it in `bootstrap/app.js` before `app.listen()`.

---

Happy building with Altarie.js!

---

## 15.1) Production Configuration (ENV)

Use `.env` to control production behavior. Altarie reads env at startup via `loadEnv(basePath)`.

Recommended keys:

```env
APP_PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# CORS: comma-separated origins (exact scheme+host, optional port)
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

# If behind reverse proxy / ingress
TRUST_PROXY=true

# Global rate limit (optional)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=300
RATE_LIMIT_WINDOW=1 minute
RATE_LIMIT_ALLOWLIST=127.0.0.1

# Helmet CSP (optional)
HELMET_CSP=true
# allow extra connection targets (comma-separated)
CSP_CONNECT_SRC=https://api.yourdomain.com,https://logs.yourdomain.com
# allow inline scripts if absolutely necessary
CSP_SCRIPT_INLINE=false
```

Notes:

- `CORS_ORIGIN` may be a single value or comma-separated list.
- Rate limit is global and should be tuned based on traffic.
- `HELMET_CSP` adds a sensible CSP with `connect-src`, `img-src data:`, and optional inline allowances.
- `LOG_LEVEL`: use `info` or `warn` in production.

---

## 15.2) PM2 Deployment Example

Create `ecosystem.config.js` in your project root (next to `server.js`):

```js
module.exports = {
  apps: [
    {
      name: 'altarie-app',
      script: 'server.js',
      node_args: '--enable-source-maps',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3000,
        LOG_LEVEL: 'info',
        TRUST_PROXY: 'true',
        CORS_ORIGIN: 'https://yourdomain.com,https://admin.yourdomain.com',
        RATE_LIMIT_ENABLED: 'true',
        RATE_LIMIT_MAX: '300',
        RATE_LIMIT_WINDOW: '1 minute'
      }
    }
  ]
}
```

Commands:

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs altarie-app
pm2 restart altarie-app
```

Behind nginx (snippet):

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

