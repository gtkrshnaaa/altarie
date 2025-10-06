// Central bootstrap configuration for altarie.js (Laravel-like DX)
// All program comments should use English.
import path from 'path'
import { fileURLToPath } from 'url'

import appConfig from '../config/app.js'
import { register as registerAppProvider } from '../app/providers/AppProvider.js'
import { auth } from '../app/middleware/auth.js'
import Fastify from 'fastify'
import { loadEnv } from '../core/env.js'
import { handleError } from '../core/error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Security plugins configuration
export const security = {
  helmet: { enabled: true, options: {} },
  cors: { enabled: true, options: { origin: true } }
}

// Static file serving configuration
export const statics = {
  enabled: true,
  root: path.join(__dirname, '../public')
}

// View engine toggle (Nunjucks is set up in core/view.js)
export const views = { enabled: true }

// Routes autoload directory
export const routes = { dir: path.join(__dirname, '../routes') }

// Error handler to be set at app level
export const errorHandler = handleError

// Not Found rendering configuration
export const notFound = { template: 'errors/404.njk' }

// View setup wrapper so app.js does not import core/view directly
export async function setupViews(app) {
  const { registerView } = await import('../core/view.js')
  await registerView(app)
}

// Devtools registration wrapper (enabled in development)
export async function registerDevtools(app) {
  const { registerDevtools } = await import('../core/devtools.js')
  await registerDevtools(app)
}

// Application-level providers to register
export const providers = [registerAppProvider]

// Middleware system similar to Laravel (global, groups, aliases)
export const middleware = {
  global: [],
  groups: { web: [], api: [] },
  aliases: { auth }
}

// Boot object encapsulating wiring and lifecycle
const boot = {
  app: appConfig,
  security,
  statics,
  views,
  routes,
  errorHandler,
  notFound,
  setupViews,
  registerDevtools,
  providers,
  middleware,

  async registerMiddleware(app) {
    if (Array.isArray(this.middleware?.global) && this.middleware.global.length > 0) {
      for (const mw of this.middleware.global) app.addHook('preHandler', mw)
    }
    app.decorate('mw', {
      resolve: (aliasesOrFns = []) => {
        const out = []
        for (const item of aliasesOrFns) {
          if (typeof item === 'function') out.push(item)
          else if (typeof item === 'string' && this.middleware?.aliases?.[item]) out.push(this.middleware.aliases[item])
        }
        return out
      },
      groups: this.middleware?.groups || {}
    })
  },

  async apply(app, { isDev = false, rootDir = path.join(__dirname, '..'), explicitRoutes } = {}) {
    if (this.statics?.enabled) {
      const fastifyStatic = await import('@fastify/static')
      await app.register(fastifyStatic.default, {
        root: this.statics.root || path.join(rootDir, 'public')
      })
    }
    if (this.security?.helmet?.enabled) {
      const helmet = await import('@fastify/helmet')
      await app.register(helmet.default, this.security.helmet.options || {})
    }
    if (this.security?.cors?.enabled) {
      const cors = await import('@fastify/cors')
      await app.register(cors.default, this.security.cors.options || { origin: true })
    }
    if (this.views?.enabled) {
      await this.setupViews(app)
    }

    if (Array.isArray(explicitRoutes) && explicitRoutes.length > 0) {
      for (const modPath of explicitRoutes) {
        const mod = await import(modPath)
        const plugin = mod.default || mod
        await app.register(plugin)
      }
    } else {
      const autoload = (await import('@fastify/autoload')).default
      await app.register(autoload, {
        dir: this.routes?.dir || path.join(rootDir, 'routes')
      })
    }

    app.setErrorHandler(this.errorHandler)
    app.setNotFoundHandler(async (request, reply) => {
      const template = this.notFound?.template || 'errors/404.njk'
      return reply.render(template, { url: request.url })
    })

    if (Array.isArray(this.providers) && this.providers.length > 0) {
      for (const register of this.providers) await register(app)
    }

    if (isDev) await this.registerDevtools(app)
  },

  createServer({ isDev } = { isDev: process.env.NODE_ENV === 'development' }) {
    const app = Fastify({
      logger: isDev
        ? {
            transport: {
              target: 'pino-pretty',
              options: { translateTime: 'HH:MM:ss Z', colorize: true, ignore: 'pid,hostname' }
            }
          }
        : true
    })
    return app
  },

  async start() {
    loadEnv()
    const isDev = process.env.NODE_ENV === 'development'
    const app = this.createServer({ isDev })
    await this.registerMiddleware(app)
    await this.apply(app, { isDev, rootDir: path.join(__dirname, '..') })
    const port = Number(this.app.port)
    await app.listen({ port })
    console.log(`${this.app.name} running at http://localhost:${port}`)
    return app
  }
}

export default boot

// Fluent builder to mirror Laravel-like bootstrap/app.php style
export const Application = {
  configure({ basePath } = {}) {
    const state = {
      basePath: basePath || path.join(__dirname, '..'),
      routing: null,
      mw: { aliases: {}, global: [], groups: {} },
      exceptions: { handler: null, notFound: null }
    }

    return {
      withRouting(cfg) {
        state.routing = cfg || null
        return this
      },
      withMiddleware(configure) {
        if (typeof configure === 'function') {
          const api = {
            alias: (map) => Object.assign(state.mw.aliases, map || {}),
            append: (fn) => { if (typeof fn === 'function') state.mw.global.push(fn) },
            group: (name, fns) => {
              if (!name) return
              const arr = Array.isArray(fns) ? fns : [fns]
              state.mw.groups[name] = [...(state.mw.groups[name] || []), ...arr.filter(Boolean)]
            }
          }
          configure(api)
        }
        return this
      },
      withExceptions(configure) {
        if (typeof configure === 'function') {
          const api = {
            handler: (fn) => { state.exceptions.handler = fn },
            notFound: (tplOrFn) => { state.exceptions.notFound = tplOrFn }
          }
          configure(api)
        }
        return this
      },
      async create() {
        loadEnv()
        const isDev = process.env.NODE_ENV === 'development'
        const app = boot.createServer({ isDev })

        if (state.mw.global.length > 0) {
          for (const mw of state.mw.global) app.addHook('preHandler', mw)
        }
        app.decorate('mw', {
          resolve: (aliasesOrFns = []) => {
            const out = []
            for (const item of aliasesOrFns) {
              if (typeof item === 'function') out.push(item)
              else if (typeof item === 'string' && state.mw.aliases[item]) out.push(state.mw.aliases[item])
            }
            return out
          },
          groups: state.mw.groups
        })

        if (typeof state.exceptions.handler === 'function') app.setErrorHandler(state.exceptions.handler)
        if (state.exceptions.notFound) {
          const nf = state.exceptions.notFound
          if (typeof nf === 'function') app.setNotFoundHandler(nf)
          else if (typeof nf === 'string') app.setNotFoundHandler(async (request, reply) => reply.render(nf, { url: request.url }))
        }

        const explicit = []
        if (state.routing?.web) explicit.push(state.routing.web)
        if (state.routing?.api) explicit.push(state.routing.api)
        await boot.apply(app, { isDev, rootDir: state.basePath, explicitRoutes: explicit.length ? explicit : undefined })

        if (state.routing?.health && typeof state.routing.health === 'string') {
          try { app.get(state.routing.health, async () => ({ status: 'ok', name: boot.app.name, time: new Date().toISOString() })) } catch {}
        }

        const port = Number(boot.app.port)
        await app.listen({ port })
        console.log(`${boot.app.name} running at http://localhost:${port}`)
        return app
      }
    }
  }
}

