// Product model using better-sqlite3
// All program comments should use English.
import { getDb } from '../../core/database.js'

export class Product {
  static all() {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all()
    return rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] }))
  }

  static recent(limit = 2) {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM products ORDER BY id DESC LIMIT ?').all(limit)
    return rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] }))
  }

  static findBySlug(slug) {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug)
    if (!row) return null
    return { ...row, features: row.features ? JSON.parse(row.features) : [] }
  }
}
