# Routing

Routes are ESM modules under `altarie/routes/` and are autoloaded by Fastify.

Example `routes/web.js`:
```js
import { HomeController } from '../app/controllers/HomeController.js'
import { auth } from '../app/middleware/auth.js'

export default async function (app) {
  const home = new HomeController()

  app.get('/', async (request, reply) => home.index(request, reply))

  app.get('/dashboard', { preHandler: auth }, async (request, reply) => {
    return reply.render('dashboard.njk', {
      env: process.env.NODE_ENV || 'development'
    })
  })
}
```

Example `routes/api.js`:
```js
export default async function (app) {
  app.get('/api/health', async () => ({
    status: 'ok',
    name: 'altarie.js',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  }))
}
```

## Tips
- Use `preHandler` for middleware.
- Keep route files cohesive; split by domain if needed.
- Prefer controllers for request handling logic.
