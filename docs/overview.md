# Altarie.js Documentation — Overview

Altarie.js delivers a Laravel-like developer experience in pure JavaScript (ESM). It combines Fastify, Nunjucks, dotenv, Youch, and better-sqlite3 to give you a clean, predictable setup with minimal ceremony.

- Language: JavaScript (ESM)
- Node: 20+
- Philosophy: Convention over configuration, MVC + Providers, npm-first

## Core Concepts

- App entry: `altarie/server.js` → `bootstrap/app.js`
- Config: `altarie/config/` (app, view, database)
- Core: `altarie/core/` (env, view, error, devtools, database)
- MVC: `altarie/app/` (controllers, middleware, models, providers, views)
- Routes: `altarie/routes/` (autoloaded)

## Request Lifecycle

1. Fastify server initializes in `bootstrap/app.js`.
2. Env is loaded (`core/env.js`).
3. Static, security, CORS, view engine registered.
4. Routes autoloaded from `routes/`.
5. Errors handled globally (`core/error.js`).
6. Devtools enabled in development.

## What This Doc Covers

- Getting started
- Routing & controllers
- Views with Nunjucks
- Middleware and providers
- Database & migrations (better-sqlite3)
- Testing & deployment
- Roadmap and CLI direction
