// Session model using better-sqlite3
// All program comments should use English.
import { getDb } from '../../core/database.js'
import { generateToken } from '../utils/auth.js'

export class Session {
  static create(userId, ttlMinutes = 60 * 24) {
    const db = getDb()
    const now = new Date()
    const expires = new Date(now.getTime() + ttlMinutes * 60 * 1000)
    const token = generateToken(32)
    const stmt = db.prepare('INSERT INTO sessions (user_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)')
    stmt.run(userId, token, now.toISOString(), expires.toISOString())
    return { token, expiresAt: expires.toISOString() }
  }

  static deleteByToken(token) {
    const db = getDb()
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
  }
}
