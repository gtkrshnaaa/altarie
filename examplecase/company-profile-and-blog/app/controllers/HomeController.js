// HomeController for altarie.js
export class HomeController {
  async index(request, reply) {
    return reply.render('home.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  }
}
