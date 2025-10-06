// AdminController for admin dashboard
// All program comments should use English.
export class AdminController {
  constructor() {
    this.company = {
      name: 'Altarie Studio',
      tagline: 'Laravel-like DX. JavaScript Simplicity.'
    }
  }

  ctx(request, extra = {}) {
    const currentYear = new Date().getFullYear()
    return {
      env: process.env.NODE_ENV || 'development',
      company: this.company,
      currentUrl: request.url,
      currentYear,
      user: request.user,
      ...extra
    }
  }

  async index(request, reply) {
    const { Product } = await import('../models/Product.js')
    const { Post } = await import('../models/Post.js')
    const { User } = await import('../models/User.js')
    const products = Product.all()
    const posts = Post.all()
    const users = User.all()
    return reply.render('admin/dashboard.njk', this.ctx(request, {
      stats: {
        products: products.length,
        posts: posts.length,
        users: users.length
      },
      products,
      posts
    }))
  }
}
