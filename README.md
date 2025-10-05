# Altarie JS

* **Pure JavaScript (no TypeScript)**
* **Laravel 12-like structure** (MVC philosophy + service provider)
* **Developer-friendly for the modern JS ecosystem**
* **npm-first flow** (everything works with just `npm install && npm run dev`)
* and of course: **mature, async-safe, and LTS-friendly components**

---

# Framework Concept: **altarie.js**

> “Laravel experience, JavaScript simplicity.”

---

## Philosophy

altarie.js is built for developers who love the *clean and elegant feel of Laravel*,
but want to stay within the pure, dynamic, and flexible JavaScript world.

Its goals:

* Predictable structure (Convention over Configuration)
* Clean separation: Controller, Model, View, Config
* Laravel-level Developer Experience, but on Node.js
* No dependency on transpilers (pure JS)
* Runs directly via `npm start`

---

## Technical Foundation

| Component        | Library               | Description                     |
| ---------------- | --------------------- | ------------------------------- |
| HTTP Kernel      | **Fastify**           | Modern and fast web server      |
| Template Engine  | **Nunjucks**          | Blade-like templating           |
| Database Layer   | **better-sqlite3**    | Embedded DB, stable & sync-safe |
| ORM Option       | **Prisma (optional)** | For larger projects             |
| Env Loader       | **dotenv**            | Environment configuration       |
| Error Renderer   | **Youch**             | Whoops-like error display       |
| Route Autoloader | **fastify-autoload**  | Auto imports route modules      |
| Static Assets    | **@fastify/static**   | Serves public files             |
| CLI (planned)    | **Commander.js**      | For artisan-like commands       |

---

## Folder Structure (Laravel 12 inspired + JS-friendly)

```
altarie/
├── app/
│   ├── controllers/
│   │   └── HomeController.js
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── views/
│   │   └── home.njk
│   └── providers/
│       └── AppProvider.js
│
├── bootstrap/
│   └── app.js               # Main kernel: loads config, fastify, routes
│
├── config/
│   ├── app.js
│   ├── database.js
│   ├── view.js
│   └── routes.js
│
├── core/
│   ├── router.js            # Route autoloader
│   ├── error.js             # Youch handler
│   ├── view.js              # Nunjucks renderer
│   ├── database.js          # SQLite connector
│   ├── utils.js             # Global helpers
│   └── env.js               # Env loader
│
├── routes/
│   ├── web.js
│   └── api.js
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── database.sqlite
│
├── public/
│   └── css/
│
├── storage/
│   ├── logs/
│   └── cache/
│
├── tests/
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## npm-first Flow

### 1. Setup

```bash
npm init -y
npm install fastify nunjucks dotenv youch better-sqlite3 @fastify/static fastify-autoload
```

### 2. Script Workflow (in `package.json`)

```json
"scripts": {
  "dev": "NODE_ENV=development node server.js",
  "start": "NODE_ENV=production node server.js",
  "test": "node tests/run.js",
  "db:migrate": "node database/migrate.js"
}
```

### 3. Entry Point — `server.js`

```js
import { createApp } from './bootstrap/app.js'
createApp()
```

---

## Bootstrapping — `bootstrap/app.js`

```js
import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'
import { handleError } from '../core/error.js'
import { loadEnv } from '../core/env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp() {
  loadEnv()
  const app = Fastify({ logger: process.env.NODE_ENV === 'development' })

  // Static public
  await app.register(import('@fastify/static'), {
    root: path.join(__dirname, '../public'),
  })

  // Autoload routes
  await app.register(autoload, {
    dir: path.join(__dirname, '../routes')
  })

  // Error handler
  app.setErrorHandler(handleError)

  await app.listen({ port: process.env.APP_PORT || 3000 })
  console.log(`altarie.js running at http://localhost:${process.env.APP_PORT || 3000}`)
}

### View Rendering (Nunjucks)

The default landing page is rendered via Nunjucks templates (no `public/index.html`).
Place your templates under `app/views/` and render them from routes or controllers:
  
```js
// routes/web.js
export default async function (app) {
  app.get('/', async (request, reply) => {
    return reply.render('home.njk', { env: process.env.NODE_ENV })
  })
}
```

Example template file: `app/views/home.njk`.

---

## Laravel Features Retained

| Laravel Feature            | altarie.js Equivalent        |
| -------------------------- | ---------------------------- |
| Blade Templates            | Nunjucks                     |
| Controller / Route Binding | Fastify + Autoload           |
| Middleware                 | Fastify preHandler hooks     |
| Service Providers          | app/providers/               |
| Config Files               | config/                      |
| Error Page (Whoops)        | Youch                        |
| Env Config                 | dotenv                       |
| Database (Eloquent-lite)   | better-sqlite3 model wrapper |
| CLI “Artisan”              | Commander.js (planned)       |

---

## Philosophy vs Laravel

| Aspect        | Laravel                  | altarie.js                |
| ------------- | ------------------------ | ------------------------- |
| Language      | PHP                      | JavaScript                |
| Engine        | Blade / Symfony Kernel   | Fastify                   |
| ORM           | Eloquent                 | Prisma / Custom Model     |
| Error Handler | Whoops                   | Youch                     |
| Config Loader | Service Provider         | Core Module               |
| Mode          | Fullstack                | Node-first monolith       |
| Goal          | Enterprise-grade PHP app | Lightweight modern JS app |

---

## Target Build

* Node.js 20+
* ECMAScript Module (`"type": "module"`)
* Fully async compatible
* Zero transpiler
* One-command startup: `npm run dev`

---



would you like me to start with the “scaffold boilerplate” or the documentation first?
