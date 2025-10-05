# Database & Migrations (better-sqlite3)

- Connector: `core/database.js` (singleton, ensures DB directory and sets pragmas)
- Config: `config/database.js`
- Runner: `database/migrate.js`

Run migrations:
```bash
npm run db:migrate
```

Tips:
- Place files under `altarie/database/migrations/`.
- Keep migrations deterministic; local dev can reset frequently.
- SQLite file path: `altarie/database/database.sqlite` (auto-created).
