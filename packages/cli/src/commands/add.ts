import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { readConfig } from '../utils/config'
import { detectPackageManager, runInstall } from '../utils/detect-pm'
import { fetchComponent } from '../registry/client'
import type { RegistryComponent } from '../registry/types'

interface AddOptions {
  registry?: string
  overwrite?: boolean
}

async function installComponent(
  name: string,
  config: ReturnType<typeof readConfig>,
  options: AddOptions,
  cwd: string,
  installed: Set<string>
): Promise<void> {
  if (installed.has(name)) return
  installed.add(name)

  const spinner = ora(`Fetching ${name}…`).start()
  let component: RegistryComponent

  try {
    component = await fetchComponent(name, options.registry)
    spinner.succeed(`Fetched ${chalk.cyan(name)}`)
  } catch (err: unknown) {
    spinner.fail(`Component "${name}" not found in registry`)
    throw err
  }

  // Install component dependencies first
  for (const dep of component.dependencies.components) {
    await installComponent(dep, config, options, cwd, installed)
  }

  // Write component files
  for (const file of component.files) {
    const dest = join(cwd, config.componentsDir, file.path)
    const dir = dirname(dest)

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    if (existsSync(dest) && !options.overwrite) {
      const existing = readFileSync(dest, 'utf-8')
      if (existing === file.content) continue // unchanged

      console.log(chalk.yellow(`  ↳ ${file.path} already exists, skipping (use --overwrite to replace)`))
      continue
    }

    writeFileSync(dest, file.content, 'utf-8')
    console.log(chalk.green(`  ↳ ${file.path}`))
  }

  // Install npm dependencies
  if (component.dependencies.npm.length > 0) {
    const pm = detectPackageManager(cwd)
    const depSpinner = ora(`Installing npm deps for ${name}…`).start()
    try {
      runInstall(pm, component.dependencies.npm, cwd)
      depSpinner.succeed(`npm deps installed`)
    } catch {
      depSpinner.warn(`Could not auto-install: ${component.dependencies.npm.join(', ')}`)
      console.log(chalk.yellow(`  Install manually: ${component.dependencies.npm.join(' ')}`))
    }
  }
}

export async function add(names: string[], options: AddOptions) {
  const cwd = process.cwd()

  let config: ReturnType<typeof readConfig>
  try {
    config = readConfig(cwd)
  } catch (err: unknown) {
    console.error(chalk.red((err as Error).message))
    process.exit(1)
  }

  if (names.length === 0) {
    console.error(chalk.red('Provide at least one component name, e.g. native-mate add button'))
    process.exit(1)
  }

  const installed = new Set<string>()

  for (const name of names) {
    console.log()
    try {
      await installComponent(name, config, options, cwd, installed)
    } catch {
      // Error already logged in installComponent
      process.exit(1)
    }
  }

  console.log()
  console.log(chalk.green('Done!'))
}
