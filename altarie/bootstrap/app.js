// Bootstrapping Fastify app for altarie.js
import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'
import { handleError } from '../core/error.js'
import { loadEnv } from '../core/env.js'
import { registerView } from '../core/view.js'
import appConfig from '../config/app.js'
import { register as registerAppProvider } from '../app/providers/AppProvider.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createApp() {
  // Load environment variables
  loadEnv()

  const isDev = process.env.NODE_ENV === 'development'
  const app = Fastify({
    logger: isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              colorize: true,
              ignore: 'pid,hostname'
            }
          }
        }
      : true
  })

  // Serve static files from /public
  const fastifyStatic = await import('@fastify/static')
  await app.register(fastifyStatic.default, {
    root: path.join(__dirname, '../public')
  })

  // Security and CORS (safe defaults)
  const helmet = await import('@fastify/helmet')
  await app.register(helmet.default)
  const cors = await import('@fastify/cors')
  await app.register(cors.default, { origin: true })

  // Register Nunjucks view engine
  await registerView(app)

  // Autoload all route modules in /routes
  await app.register(autoload, {
    dir: path.join(__dirname, '../routes')
  })

  // Global error handler
  app.setErrorHandler(handleError)

  // 404 Not Found handler renders Nunjucks template
  app.setNotFoundHandler(async (request, reply) => {
    return reply.render('errors/404.njk', { url: request.url })
  })

  // Register application-level provider(s)
  await registerAppProvider(app)

  // Register development tools
  if (isDev) {
    const { registerDevtools } = await import('../core/devtools.js')
    await registerDevtools(app)
  }

  const port = Number(appConfig.port)
  await app.listen({ port })
  console.log(`${appConfig.name} running at http://localhost:${port}`)

  return app
}
