// Nunjucks view integration for altarie.js
// Registers a Fastify decorator reply.render(template, context)
import nunjucks from 'nunjucks'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function registerView(app) {
  const viewsPath = path.join(__dirname, '../app/views')

  const env = nunjucks.configure(viewsPath, {
    autoescape: true,
    noCache: process.env.NODE_ENV === 'development'
  })

  // Decorate reply with a render method
  app.decorateReply('render', function (template, context = {}) {
    const html = env.render(template, context)
    this.type('text/html').send(html)
  })
}
