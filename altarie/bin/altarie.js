#!/usr/bin/env node


// this file is for altarie can create new project using this command: npx altarie new project-name

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const command = args[0]
const projectName = args[1]

if (command === 'new') {
  if (!projectName) {
    console.log(chalk.red('Usage: altarie new <project-name>'))
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), projectName)
  const templateDir = path.resolve(__dirname, '../template')

  console.log(chalk.cyan(`Creating new Altarie project in ${projectName}...`))
  fs.copySync(templateDir, targetDir)

  console.log(chalk.yellow('Installing dependencies...'))
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' })

  console.log(chalk.green(`Project ${projectName} created successfully!`))
  console.log(chalk.gray(`Next steps:`))
  console.log(`  cd ${projectName}`)
  console.log(`  npm run dev\n`)
} else {
  console.log(chalk.red('Unknown command. Try: altarie new <project-name>'))
}
