// ProductsController for Altarie Studio demo
// All program comments should use English.
export class ProductsController {
  constructor() {
    this.company = {
      name: 'Altarie Studio',
      tagline: 'Laravel-like DX. JavaScript Simplicity.',
      description: 'We craft fast, maintainable web products powered by Altarie.js.'
    }
  }

  ctx(request, extra = {}) {
    const currentYear = new Date().getFullYear()
    return {
      env: process.env.NODE_ENV || 'development',
      company: this.company,
      currentUrl: request.url,
      currentYear,
      ...extra
    }
  }

  async index(request, reply) {
    const { Product } = await import('../models/Product.js')
    const products = Product.all()
    return reply.render('products.njk', this.ctx(request, { products }))
  }

  async show(request, reply) {
    const { Product } = await import('../models/Product.js')
    const product = Product.findBySlug(request.params.slug)
    if (!product) return reply.code(404).render('errors/404.njk', this.ctx(request, { url: request.url }))
    return reply.render('product.njk', this.ctx(request, { product }))
  }
}
