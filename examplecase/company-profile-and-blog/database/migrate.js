// Migration runner for altarie.js using better-sqlite3
// Scans database/migrations/*.js and executes exports.up(db) in filename order.
// Records executed migrations into migrations table with batch and timestamp.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb, closeDb } from '../core/database.js'
import { loadEnv } from '../core/env.js'

async function run() {
  // Ensure env is loaded for migrations needing it
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  loadEnv(path.join(__dirname, '..'))
  const db = getDb()
  try {
    // Ensure migrations table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        batch INTEGER NOT NULL,
        migrated_at TEXT NOT NULL
      );
    `)

    const dir = path.join(__dirname, 'migrations')
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.js'))
      .sort()

    const applied = new Set(
      db.prepare('SELECT name FROM migrations ORDER BY id').all().map(r => r.name)
    )
    const currentMax = db.prepare('SELECT COALESCE(MAX(batch), 0) AS b FROM migrations').get().b
    const batch = Number(currentMax) + 1
    const nowIso = new Date().toISOString()

    for (const f of files) {
      if (applied.has(f)) continue
      const mod = await import(path.join(dir, f))
      if (typeof mod.up === 'function') {
        mod.up(db)
        db.prepare('INSERT INTO migrations (name, batch, migrated_at) VALUES (?, ?, ?)').run(f, batch, nowIso)
        console.log(`[migrate] up: ${f}`)
      }
    }

    console.log('Migrations executed successfully.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 1
  } finally {
    closeDb()
  }
}

run()
