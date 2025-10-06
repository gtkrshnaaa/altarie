// Simple smoke test for altarie.js dev server
// Starts the server then fetches /api/health and logs the result.
import { createApp } from '../bootstrap/app.js'

async function main() {
  const app = await createApp()
  try {
    // Use global fetch (Node.js 20+)
    const res = await fetch('http://127.0.0.1:3000/api/health')
    const json = await res.json()
    console.log('[health]', json)
  } finally {
    await app.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
