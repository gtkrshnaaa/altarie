// Global error handler for altarie.js
// Formats errors nicely in development using Youch with content negotiation.
import Youch from 'youch'

export async function handleError(error, request, reply) {
  const isDev = process.env.NODE_ENV === 'development'
  const statusCode = error.statusCode || error.status || 500

  // Decide response type based on Accept header and environment
  const wantsHtml = /text\/html/.test(request.headers['accept'] || '')

  if (isDev && wantsHtml) {
    const youch = new Youch(error, request)
    const html = await youch.toHTML()
    return reply.type('text/html').status(statusCode).send(html)
  }

  const payload = {
    message: error.message || 'Internal Server Error',
    statusCode,
  }

  // Include stack only in development
  if (isDev && error.stack) {
    payload.stack = error.stack.split('\n')
  }

  return reply.type('application/json').status(statusCode).send(payload)
}
