// API routes for altarie.js
export default async function (app) {
  app.get('/api/health', async (request, reply) => {
    return {
      status: 'ok',
      name: 'altarie.js',
      env: process.env.NODE_ENV || 'development',
      time: new Date().toISOString()
    }
  })
}
