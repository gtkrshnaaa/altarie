// Web routes for altarie.js
import { HomeController } from '../app/controllers/HomeController.js'
import { auth } from '../app/middleware/auth.js'

export default async function (app) {
  const home = new HomeController()

  app.get('/', async (request, reply) => home.index(request, reply))

  // Protected route example
  app.get('/dashboard', { preHandler: auth }, async (request, reply) => {
    return reply.render('dashboard.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  })
}
