// AuthController for admin login/logout
// All program comments should use English.
export class AuthController {
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
      ...extra
    }
  }

  async showLogin(request, reply) {
    if (request.user) return reply.redirect('/admin')
    return reply.render('admin/login.njk', this.ctx(request))
  }

  async doLogin(request, reply) {
    const { User } = await import('../models/User.js')
    const { Session } = await import('../models/Session.js')
    const { email, password } = request.body || {}
    const user = User.verify(email, password)
    if (!user) {
      return reply.render('admin/login.njk', this.ctx(request, { error: 'Invalid credentials' }))
    }
    const session = Session.create(user.id)
    const isProd = process.env.NODE_ENV === 'production'
    reply.setCookie('sid', session.token, {
      path: '/', httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 60 * 60 * 24
    })
    return reply.redirect('/admin')
  }

  async logout(request, reply) {
    const { Session } = await import('../models/Session.js')
    const sid = request.cookies?.sid
    if (sid) Session.deleteByToken(sid)
    reply.clearCookie('sid', { path: '/' })
    return reply.redirect('/admin/login')
  }
}
