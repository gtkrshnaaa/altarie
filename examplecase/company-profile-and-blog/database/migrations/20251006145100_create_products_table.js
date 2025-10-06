// Migration: create_products_table
// All program comments should use English.

export function up(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      summary TEXT,
      features TEXT, -- JSON array string
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
}

export function down(db) {
  db.exec(`DROP TABLE IF EXISTS products;`)
}
