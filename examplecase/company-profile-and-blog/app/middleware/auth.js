// Cookie-based auth middleware for admin area
// All program comments should use English.
import { getDb } from '../../core/database.js'

export async function auth(request, reply) {
  try {
    const sid = request.cookies?.sid
    if (!sid) return reply.redirect('/admin/login')
    const db = getDb()
    const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(sid)
    if (!session) return reply.redirect('/admin/login')
    const now = new Date()
    const exp = new Date(session.expires_at)
    if (isNaN(exp.getTime()) || exp < now) {
      db.prepare('DELETE FROM sessions WHERE id = ?').run(session.id)
      reply.clearCookie('sid', { path: '/' })
      return reply.redirect('/admin/login')
    }
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(session.user_id)
    if (!user) return reply.redirect('/admin/login')
    request.user = user
    request.session = session
    return
  } catch {
    return reply.redirect('/admin/login')
  }
}
