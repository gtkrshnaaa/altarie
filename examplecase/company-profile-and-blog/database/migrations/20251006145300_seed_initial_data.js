// Migration: seed_initial_data
// All program comments should use English.

export function up(db) {
  const now = new Date().toISOString()
  const countProducts = db.prepare('SELECT COUNT(1) AS c FROM products').get().c
  if (countProducts === 0) {
    const stmt = db.prepare('INSERT INTO products (slug, name, summary, features, created_at, updated_at) VALUES (@slug, @name, @summary, @features, @created_at, @updated_at)')
    const seed = [
      { slug: 'altarie-site-starter', name: 'Altarie Site Starter', summary: 'Production-ready starter with routing, views, and SQLite.', features: JSON.stringify(['Fastify core','Nunjucks views','SQLite']) },
      { slug: 'altarie-admin-dash', name: 'Admin Dashboard', summary: 'Role-based panels, charts, and CRUD using Altarie.', features: JSON.stringify(['Auth middleware','Charts','CRUD scaffolding']) },
      { slug: 'altarie-blog-kit', name: 'Blog Kit', summary: 'Simple blog with categories, tags, and search.', features: JSON.stringify(['Posts & tags','Search','Friendly URLs']) }
    ]
    const insert = db.transaction((rows) => {
      for (const r of rows) stmt.run({ ...r, created_at: now, updated_at: now })
    })
    insert(seed)
  }

  const countPosts = db.prepare('SELECT COUNT(1) AS c FROM posts').get().c
  if (countPosts === 0) {
    const stmt = db.prepare('INSERT INTO posts (slug, title, excerpt, body, created_at, updated_at) VALUES (@slug, @title, @excerpt, @body, @created_at, @updated_at)')
    const seed = [
      { slug: 'launching-altarie-studio', title: 'Launching Altarie Studio', excerpt: 'Introducing our studio and what we build with Altarie.js.', body: 'Altarie Studio focuses on practical products built with Altarie.js. This is a demo post for the company profile example.' },
      { slug: 'why-choose-altarie', title: 'Why choose Altarie.js', excerpt: 'Clean structure, great DX, and production-ready features.', body: 'With autoloaded routes, view helpers, and Youch in dev, Altarie.js keeps your team productive and happy.' }
    ]
    const insert = db.transaction((rows) => {
      for (const r of rows) stmt.run({ ...r, created_at: now, updated_at: now })
    })
    insert(seed)
  }
}

export function down(db) {
  // Non-destructive seed; optional cleanup
  db.exec('DELETE FROM posts;')
  db.exec('DELETE FROM products;')
}
