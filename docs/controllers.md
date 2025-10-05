# Controllers

Controllers live in `altarie/app/controllers/` and encapsulate request handling.

Example `HomeController`:
```js
export class HomeController {
  async index(request, reply) {
    return reply.render('home.njk', { env: process.env.NODE_ENV || 'development' })
  }
}
```

Bind controller methods from routes:
```js
const home = new HomeController()
app.get('/', async (req, rep) => home.index(req, rep))
```

## Guidelines
- Keep controllers thin.
- Offload business logic to services/modules.
- Validate input at the boundary (middleware or early in controller).
