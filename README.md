# Altarie.js

Laravel-like developer experience in pure JavaScript (ESM). Fast to start, simple to extend, and friendly for modern npm workflows.

- Pure JavaScript (no TypeScript required)
- Laravel-inspired structure (MVC + providers)
- npm-first workflow (works with npm install && npm run dev)
- Fastify + Nunjucks + better-sqlite3 + dotenv + Youch

---

## Philosophy

Altarie.js is for developers who enjoy Laravel’s clarity but prefer the flexibility of JavaScript. It aims to be predictable, approachable, and fully async-safe without build steps or transpilers.

Goals:
- Convention over configuration
- Clear separation of concerns (Controller, Model, View, Config)
- Laravel-like DX on Node.js
- Zero transpiler, ESM-native
- One-command startup

---

## Tech Stack

- HTTP: Fastify
- Templates: Nunjucks (Blade-like)
- Database: better-sqlite3 (embedded)
- Optional ORM: Prisma (for bigger apps)
- Env: dotenv
- Error pages: Youch
- Static assets: @fastify/static
- Autoload routes: fastify-autoload
- Dev logs: pino-pretty

---

## Repository Layout

- Framework implementation lives in `altarie/`
- Example app scaffold lives in `examplecase/student-management/`
- Root-level [README.md](cci:7://file:///home/user/space/dev/altariespace/altarie/README.md:0:0-0:0) (this file)

Key entry points and directories:

- [altarie/server.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/server.js:0:0-0:0) — Application entry
- [altarie/bootstrap/app.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/bootstrap/app.js:0:0-0:0) — Kernel: loads env, logger, view, routes, error handler, providers, devtools
- `altarie/config/` — App, view, and database config
- `altarie/core/` — Core modules (env, view, error, devtools, database)
- `altarie/routes/` — Route modules ([web.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/routes/web.js:0:0-0:0), [api.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/routes/api.js:0:0-0:0))
- `altarie/app/` — Controllers, middleware, models, providers, views
- `altarie/database/` — Migration runner and folders
- `altarie/tests/` — Basic smoke tests
- `altarie/public/` — Static files

---

## Folder Structure (inside altarie/)

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

---

## Quick Start

Requirements:
- Node.js 20+

Steps:

1) Install dependencies
```bash
cd altarie
npm install
```

2) Configure environment
```bash
cp .env.example .env
# edit .env if needed (e.g., APP_PORT=3000)
```

3) Run in development (with auto-reload)
```bash
npm run dev
```

4) Or run in production mode
```bash
npm start
```

Visit:
- http://localhost:3000/

Devtools (development only):
- http://localhost:3000/_altarie/routes — list registered routes
- http://localhost:3000/_altarie/env — masked environment variables

---

## Configuration

- [config/app.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/config/app.js:0:0-0:0) — app name, env, port
- [config/view.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/config/view.js:0:0-0:0) — Nunjucks options and view directory
- [config/database.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/config/database.js:0:0-0:0) — database client and connection

Environment variables are loaded from `.env` by [core/env.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/core/env.js:0:0-0:0). Defaults are chosen for a smooth local experience.

---

## Routing and Controllers

Routes are auto-loaded from `routes/` using `@fastify/autoload`.

Example [routes/web.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/routes/web.js:0:0-0:0):
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

Example controller [app/controllers/HomeController.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/app/controllers/HomeController.js:0:0-0:0):
```js
export class HomeController {
  async index(request, reply) {
    return reply.render('home.njk', { env: process.env.NODE_ENV || 'development' })
  }
}
```

---

## Views (Nunjucks)

Views live under `app/views/`. The view engine is registered via [core/view.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/core/view.js:0:0-0:0) and exposes `reply.render(template, data)`.

Examples:
- [app/views/home.njk](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/app/views/home.njk:0:0-0:0)
- [app/views/dashboard.njk](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/app/views/dashboard.njk:0:0-0:0)
- `app/views/layouts/...`
- `app/views/errors/404.njk` (used by not-found handler)

---

## Database & Migrations

Default database is `better-sqlite3` with a simple, file-based workflow.

- Config: [config/database.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/config/database.js:0:0-0:0)
- Connector: [core/database.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/core/database.js:0:0-0:0)
- Runner: [database/migrate.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/database/migrate.js:0:0-0:0) (looks for files in `database/migrations/`)

Run migrations:
```bash
npm run db:migrate
```

The SQLite file is created at `database/database.sqlite` if it doesn’t exist.

---

## Error Handling

[core/error.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/core/error.js:0:0-0:0) uses Youch to render pretty HTML error pages in development (when the client accepts `text/html`). Otherwise, JSON is returned. In production, errors are returned as compact JSON.

---

## Development Experience

- Pretty logs via `pino-pretty` when `NODE_ENV=development`
- Devtools endpoints:
  - `/_altarie/routes`
  - `/_altarie/env` (secrets masked)
- Nodemon is wired to `npm run dev` for auto-restart

---

## Testing

A basic smoke test exists in [tests/run.js](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/tests/run.js:0:0-0:0). It starts the server and hits `/api/health`.

Run:
```bash
npm test
```

---

## Roadmap

- CLI (artisan-like) with Commander.js
- Better model/ORM integration (Prisma adapter)
- Opinionated auth/session scaffolding
- DX enhancements (generators, blueprints)

---

## License

MIT. See [altarie/LICENSE](cci:7://file:///home/user/space/dev/altariespace/altarie/altarie/LICENSE:0:0-0:0).

---
