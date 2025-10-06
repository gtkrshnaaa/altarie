// Web routes for company profile demo (Altarie Studio)
import { HomeController } from '../app/controllers/HomeController.js'
import { ProductsController } from '../app/controllers/ProductsController.js'
import { BlogController } from '../app/controllers/BlogController.js'

export default async function (app) {
  const c = new HomeController()
  const products = new ProductsController()
  const blog = new BlogController()

  // Home / landing
  app.get('/', async (request, reply) => c.index(request, reply))

  // Company pages
  app.get('/about', async (request, reply) => c.about(request, reply))

  // Products
  app.get('/products', async (request, reply) => products.index(request, reply))
  app.get('/products/:slug', async (request, reply) => products.show(request, reply))

  // Blog
  app.get('/blog', async (request, reply) => blog.index(request, reply))
  app.get('/blog/:slug', async (request, reply) => blog.show(request, reply))
}
