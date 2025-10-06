// Web routes for altarie.js
import { HomeController } from '../app/controllers/HomeController.js'

export default async function (app) {
  const home = new HomeController()

  app.get('/', async (request, reply) => home.index(request, reply))

  // Protected route example
  // Use Laravel-like alias resolver defined in bootstrap/app.js via app.mw.resolve
  const preAuth = app.mw.resolve(['auth'])
  app.get('/dashboard', { preHandler: preAuth }, async (request, reply) => {
    return reply.render('dashboard.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  })
}
