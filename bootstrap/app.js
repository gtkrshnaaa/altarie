// Bootstrapping Fastify app for altarie.js
import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import path from 'path'
import { fileURLToPath } from 'url'
import { handleError } from '../core/error.js'
import { loadEnv } from '../core/env.js'
import { registerView } from '../core/view.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createApp() {
  // Load environment variables
  loadEnv()

  const app = Fastify({ logger: process.env.NODE_ENV === 'development' })

  // Serve static files from /public
  const fastifyStatic = await import('@fastify/static')
  await app.register(fastifyStatic.default, {
    root: path.join(__dirname, '../public')
  })

  // Register Nunjucks view engine
  await registerView(app)

  // Autoload all route modules in /routes
  await app.register(autoload, {
    dir: path.join(__dirname, '../routes')
  })

  // Global error handler
  app.setErrorHandler(handleError)

  const port = Number(process.env.APP_PORT || 3000)
  await app.listen({ port })
  console.log(`altarie.js running at http://localhost:${port}`)

  return app
}
