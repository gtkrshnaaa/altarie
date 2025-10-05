// Global error handler for altarie.js
// Formats errors nicely in development using Youch
import Youch from 'youch'

export async function handleError(error, request, reply) {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    const youch = new Youch(error, request)
    const html = await youch.toHTML()
    reply.type('text/html').status(error.statusCode || 500).send(html)
    return
  }

  // Production-safe JSON response
  reply
    .type('application/json')
    .status(error.statusCode || 500)
    .send({
      message: 'Internal Server Error',
      statusCode: error.statusCode || 500
    })
}
