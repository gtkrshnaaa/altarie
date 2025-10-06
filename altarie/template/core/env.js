// Environment loader for altarie.js
// Loads variables from .env using dotenv and sets safe defaults.
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function loadEnv(rootDir) {
  const root = rootDir && typeof rootDir === 'string'
    ? rootDir
    : path.join(__dirname, '..')
  const envPath = path.join(root, '.env')

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
  } else {
    dotenv.config() // fallback to process cwd
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
  }
}
