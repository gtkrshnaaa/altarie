# Getting Started

Requirements:
- Node.js 20+

Steps:

```bash
cd altarie
npm install
cp .env.example .env
npm run dev
```

Open:
- http://localhost:3000/

Development-only endpoints:
- `/_altarie/routes`
- `/_altarie/env`

Scripts:
- `npm run dev` — development with nodemon
- `npm start` — production mode
- `npm test` — smoke test
- `npm run db:migrate` — run migrations
