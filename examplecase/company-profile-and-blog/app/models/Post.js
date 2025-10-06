// Post model using better-sqlite3
// All program comments should use English.
import { getDb } from '../../core/database.js'

export class Post {
  static all() {
    const db = getDb()
    return db.prepare('SELECT * FROM posts ORDER BY id DESC').all()
  }

  static recent(limit = 2) {
    const db = getDb()
    return db.prepare('SELECT * FROM posts ORDER BY id DESC LIMIT ?').all(limit)
  }

  static findBySlug(slug) {
    const db = getDb()
    return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug) || null
  }
}
