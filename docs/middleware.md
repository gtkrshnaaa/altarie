# Middleware

Use Fastify `preHandler` (and other hooks) to apply cross-cutting concerns.

Example `auth` middleware:
```js
export async function auth(request, reply) {
  const authorized = true // replace with real check
  if (!authorized) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
```

Attach to route:
```js
app.get('/dashboard', { preHandler: auth }, handler)
```

Guidelines:
- Keep middleware focused (auth, validation, logging).
- Compose arrays of middleware if needed.
