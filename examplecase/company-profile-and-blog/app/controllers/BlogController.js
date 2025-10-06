// BlogController for Altarie Studio demo
// All program comments should use English.
export class BlogController {
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
    const { Post } = await import('../models/Post.js')
    const posts = Post.all()
    return reply.render('blog.njk', this.ctx(request, { posts }))
  }

  async show(request, reply) {
    const { Post } = await import('../models/Post.js')
    const post = Post.findBySlug(request.params.slug)
    if (!post) return reply.code(404).render('errors/404.njk', this.ctx(request, { url: request.url }))
    return reply.render('post.njk', this.ctx(request, { post }))
  }
}
