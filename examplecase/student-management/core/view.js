// Nunjucks view integration for altarie.js
// Registers a Fastify decorator reply.render(template, context)
import nunjucks from 'nunjucks'
import path from 'path'
import { fileURLToPath } from 'url'
import viewConfig from '../config/view.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function registerView(app) {
  // Resolve views directory from config
  const root = path.join(__dirname, '..')
  const viewsPath = path.join(root, viewConfig.viewsPath || 'app/views')

  const env = nunjucks.configure(viewsPath, {
    autoescape: viewConfig.autoescape !== undefined ? viewConfig.autoescape : true,
    noCache: process.env.NODE_ENV === 'development'
  })

  // Decorate reply with a render method
  app.decorateReply('render', function (template, context = {}) {
    const html = env.render(template, context)
    this.type('text/html').send(html)
  })
}
