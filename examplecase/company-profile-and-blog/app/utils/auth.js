// Auth utilities: password hashing and token generation
// All program comments should use English.
import crypto from 'crypto'

export function hashPassword(password, secret = '') {
  const h = crypto.createHash('sha256')
  h.update(String(password || ''))
  h.update('|')
  h.update(String(secret || ''))
  return h.digest('hex')
}

export function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}
