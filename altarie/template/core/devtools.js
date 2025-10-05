// Developer tools for altarie.js (development-only)
// - Collect registered routes and expose an inspection page at /_altarie/routes
// - Expose masked environment variables at /_altarie/env (never reveal secrets fully)

function maskValue(val) {
  if (typeof val !== 'string') return val
  if (val.length <= 4) return '*'.repeat(val.length)
  return val.slice(0, 2) + '***' + val.slice(-2)
}

export async function registerDevtools(app) {
  const routes = []
  app.addHook('onRoute', (route) => {
    routes.push({
      method: route.method,
      url: route.url,
      // expose minimal info only
      preHandler: Array.isArray(route.preHandler)
        ? route.preHandler.length
        : route.preHandler ? 1 : 0,
    })
  })

  app.get('/_altarie/routes', async (request, reply) => {
    return reply.type('application/json').send({ routes })
  })

  app.get('/_altarie/env', async (request, reply) => {
    const masked = {}
    for (const [k, v] of Object.entries(process.env)) {
      const keyUpper = String(k).toUpperCase()
      // common secrets
      const isSecret = /KEY|TOKEN|SECRET|PASS|PWD/.test(keyUpper)
      masked[k] = isSecret ? maskValue(String(v)) : v
    }
    return reply.type('application/json').send({ env: masked })
  })
}
