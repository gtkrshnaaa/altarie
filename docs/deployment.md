# Deployment

Checklist:
- Set `NODE_ENV=production`.
- Ensure the database path is writable or use an external DB/ORM.
- Run `node altarie/server.js` under a process manager (pm2, systemd, Docker).
- Put a reverse proxy (nginx/Caddy) in front if needed.

Environment:
- Configure `APP_PORT` in `.env` or via process env.
- Disable devtools in production by not using `NODE_ENV=development`.
