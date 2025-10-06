// Bootstrapping Fastify app for altarie.js
// All program comments should use English.
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
    .withMiddleware((middleware) => {
      // Register alias here
      // middleware.alias({
      //   'auth': /* yourAuthMiddleware */
      // })

      // Global middleware
      // middleware.append(/* yourGlobalMiddleware */)

      // Groups (optional)
      // middleware.group('web', [/* csrf, session */])
      // middleware.group('api', [/* rateLimiter */])
    })
    .withExceptions((exceptions) => {
      // exceptions.handler((error, request, reply) => { /* custom handler */ })
      // exceptions.notFound('errors/404.njk')
    })
    .create()
}
