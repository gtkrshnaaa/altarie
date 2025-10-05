import { createApp } from './bootstrap/app.js'

// Start the altarie.js application
createApp().catch((err) => {
  console.error(err)
  process.exit(1)
})
