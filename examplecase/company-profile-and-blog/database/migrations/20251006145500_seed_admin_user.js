// Migration: seed_admin_user
// All program comments should use English.
import crypto from 'crypto'

export function up(db) {
  const now = new Date().toISOString()
  const name = process.env.ADMIN_NAME || 'Administrator'
  const email = process.env.ADMIN_EMAIL || 'admin@altarie.local'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const salt = process.env.ADMIN_SALT || ''
  const h = crypto.createHash('sha256'); h.update(String(password)); h.update('|'); h.update(String(salt));
  const password_hash = h.digest('hex')

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (!exists) {
    db.prepare('INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, password_hash, now, now)
  }
}

export function down(db) {
  const email = process.env.ADMIN_EMAIL || 'admin@altarie.local'
  db.prepare('DELETE FROM users WHERE email = ?').run(email)
}
