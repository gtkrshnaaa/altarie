// Simple User model using better-sqlite3
// Note: Extended with password hash lookup for admin auth.
import { getDb } from '../../core/database.js'
import { hashPassword } from '../utils/auth.js'

export class User {
  static all() {
    const db = getDb()
    const stmt = db.prepare('SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC')
    return stmt.all()
  }

  static find(id) {
    const db = getDb()
    const stmt = db.prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
    return stmt.get(id)
  }

  static findByEmail(email) {
    const db = getDb()
    return db.prepare('SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ?').get(email) || null
  }

  static verify(email, password) {
    const secret = process.env.ADMIN_SALT || ''
    const user = this.findByEmail(email)
    if (!user) return null
    const hashed = hashPassword(password, secret)
    if (hashed !== user.password_hash) return null
    return { id: user.id, name: user.name, email: user.email }
  }

  static create({ name, email }) {
    const db = getDb()
    const now = new Date().toISOString()
    const stmt = db.prepare('INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)')
    const info = stmt.run(name, email, now, now)
    return this.find(info.lastInsertRowid)
  }
}
