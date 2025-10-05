# Views (Nunjucks)

Nunjucks is registered in `core/view.js` and exposes `reply.render(template, data)`.

- Default directory: `altarie/app/views/`
- Caching: disabled in development (`noCache: true`)

Example render:
```js
return reply.render('home.njk', { env: process.env.NODE_ENV })
```

Recommended structure:
```
app/views/
├── layouts/
├── errors/
├── home.njk
└── dashboard.njk
```

Use includes and extends for reusable layouts.
