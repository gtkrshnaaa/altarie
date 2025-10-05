// Web routes for altarie.js
export default async function (app) {
  app.get('/', async (request, reply) => {
    // Render home page using Nunjucks template
    return reply.render('home.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  })
}
