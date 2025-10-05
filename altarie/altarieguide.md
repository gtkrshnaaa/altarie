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
4. Routing
5. Controllers
6. Views (Nunjucks)
7. Middleware
8. Providers
9. Database & Migrations (better-sqlite3)
10. Testing
11. Error Handling
12. Static Assets
13. Development Tools
14. Deployment
15. Patterns & Conventions
16. FAQ & Troubleshooting

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

## 4) Routing

Routes are defined as ESM modules under `routes/` and auto-registered. Each file should export a default async function that receives the Fastify instance.

Example `routes/web.js`:

```js
import { HomeController } from '../app/controllers/HomeController.js'
import { auth } from '../app/middleware/auth.js'

export default async function (app) {
  const home = new HomeController()

  app.get('/', async (request, reply) => home.index(request, reply))

  app.get('/dashboard', { preHandler: auth }, async (request, reply) => {
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

## 7) Middleware

Use Fastify hooks and `preHandler` to compose middleware.

```js
// app/middleware/auth.js
export async function auth(request, reply) {
  const authorized = true // Replace with real check
  if (!authorized) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
```

Attach in routes via options: `{ preHandler: auth }` or arrays.

---

## 8) Providers

Providers register cross-cutting services on the Fastify instance.

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

## 11) Error Handling

`core/error.js` provides a centralized error handler using Youch in development.

- If the client accepts `text/html` and `NODE_ENV=development`, errors are rendered as HTML.
- Otherwise, JSON payloads are returned.
- In production, payloads are compact and do not include stack traces.

---

## 12) Static Assets

`@fastify/static` serves files from `public/`.

- Put CSS/JS/images under `public/`.
- Example: `public/css/app.css` → accessible as `/css/app.css`.

---

## 13) Development Tools

Development-only endpoints (enabled when `NODE_ENV=development`):

- `/_altarie/routes` — list of registered routes.
- `/_altarie/env` — masked environment variables.

These are implemented in `core/devtools.js` via Fastify hooks.

---

## 14) Deployment

General tips:

- Set `NODE_ENV=production`.
- Ensure a writable path for `database/database.sqlite` (or configure an external DB/ORM).
- Use a process manager (pm2/systemd/Docker) to run `node server.js`.
- Configure reverse proxy (nginx/Caddy) if needed.

---

## 15) Patterns & Conventions

- ESM everywhere (no transpilers).
- Convention-over-configuration folder layout.
- Controllers thin, reusable domain logic in separate modules.
- Views for presentation (Nunjucks includes/extends for layouts).
- Middleware focused on cross-cutting concerns (auth, validation, logging).
- Providers to register app-level services/utilities.
- Keep migrations deterministic; reset DB freely in local dev.

---

## 16) FAQ & Troubleshooting

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
