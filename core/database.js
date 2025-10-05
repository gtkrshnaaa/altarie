// Database connector for altarie.js using better-sqlite3
// Provides a singleton connection and ensures database directory exists.
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dbConfig from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbInstance = null

export function getDb() {
  if (dbInstance) return dbInstance

  // Resolve DB file relative to project root
  const root = path.join(__dirname, '..')
  const filename = path.join(root, dbConfig.connection.filename)
  const dir = path.dirname(filename)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  dbInstance = new Database(filename)

  // Recommended pragmas for local development
  dbInstance.pragma('journal_mode = WAL')
  dbInstance.pragma('synchronous = NORMAL')

  return dbInstance
}

export function closeDb() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
