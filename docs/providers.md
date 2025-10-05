# Providers

Providers register app-level services/utilities on the Fastify instance.

Example:
```js
// app/providers/AppProvider.js
export async function register(app) {
  // app.decorate('version', '0.1.0')
}
```

Register in `bootstrap/app.js` before `app.listen()`.

Usage ideas:
- Database repositories
- Caching utilities
- Third-party API clients
