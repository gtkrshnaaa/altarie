// Simple User model using better-sqlite3
// Note: This is a minimal wrapper to demonstrate the model pattern.
import { getDb } from '../../core/database.js'

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

  static create({ name, email }) {
    const db = getDb()
    const now = new Date().toISOString()
    const stmt = db.prepare('INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)')
    const info = stmt.run(name, email, now, now)
    return this.find(info.lastInsertRowid)
  }
}
