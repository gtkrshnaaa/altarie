// Simple migration runner for altarie.js using better-sqlite3
// This is a placeholder to demonstrate db:migrate script.
import { getDb, closeDb } from '../core/database.js'

async function run() {
  const db = getDb()
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        batch INTEGER NOT NULL,
        migrated_at TEXT NOT NULL
      );
    `)

    // Example demo table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)

    console.log('Migrations executed successfully.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exitCode = 1
  } finally {
    closeDb()
  }
}

run()
