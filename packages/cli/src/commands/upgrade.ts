import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import chalk from 'chalk'
import ora from 'ora'
import semver from 'semver'
import inquirer from 'inquirer'
import { readConfig } from '../utils/config'
import { fetchComponent } from '../registry/client'
import type { RegistryComponent } from '../registry/types'

interface UpgradeOptions {
  registry?: string
  yes?: boolean
}

interface ComponentStatus {
  name: string
  currentVersion: string
  latestVersion: string
  hasUpdates: boolean
  modifiedFiles: string[]
}

function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 12)
}

/** Read the version from the header comment: // native-mate: button@0.1.0 | hash:abc */
function parseHeader(content: string): { version: string; hash: string } | null {
  const match = content.split('\n')[0]?.match(/\/\/ native-mate: [\w-]+@([\d.]+) \| hash:([a-f0-9]+)/)
  if (!match) return null
  return { version: match[1], hash: match[2] }
}

async function checkComponent(
  name: string,
  config: ReturnType<typeof readConfig>,
  options: UpgradeOptions,
  cwd: string
): Promise<ComponentStatus | null> {
  const spinner = ora(`Checking ${name}…`).start()

  let latest: RegistryComponent
  try {
    latest = await fetchComponent(name, options.registry)
  } catch {
    spinner.fail(`Could not fetch ${name} from registry`)
    return null
  }

  const modifiedFiles: string[] = []
  let currentVersion = 'unknown'

  for (const file of latest.files) {
    const filePath = join(cwd, config.componentsDir, file.path)
    if (!existsSync(filePath)) continue

    const diskContent = readFileSync(filePath, 'utf-8')
    const header = parseHeader(diskContent)
    if (header) currentVersion = header.version

    // Hash the content without header line (same as build-registry)
    const diskBody = diskContent.split('\n').slice(1).join('\n')
    const diskHash = hashContent(diskBody)
    if (diskHash !== file.hash) {
      modifiedFiles.push(file.path)
    }
  }

  const hasUpdates = semver.gt(latest.version, currentVersion === 'unknown' ? '0.0.0' : currentVersion)

  spinner.stop()

  return {
    name,
    currentVersion,
    latestVersion: latest.version,
    hasUpdates,
    modifiedFiles,
  }
}

function writeFiles(component: RegistryComponent, config: ReturnType<typeof readConfig>, cwd: string): void {
  for (const file of component.files) {
    const dest = join(cwd, config.componentsDir, file.path)
    writeFileSync(dest, file.content, 'utf-8')
    console.log(chalk.green(`  ↳ ${file.path}`))
  }
}

export async function upgrade(names: string[], options: UpgradeOptions) {
  const cwd = process.cwd()

  let config: ReturnType<typeof readConfig>
  try {
    config = readConfig(cwd)
  } catch (err: unknown) {
    console.error(chalk.red((err as Error).message))
    process.exit(1)
  }

  // If no names given, scan installed components
  let targets = names
  if (targets.length === 0) {
    const componentsDir = join(cwd, config.componentsDir)
    if (!existsSync(componentsDir)) {
      console.log(chalk.yellow('No components installed yet.'))
      return
    }
    // Look for files with native-mate headers
    const { readdirSync } = await import('fs')
    const entries = readdirSync(componentsDir, { withFileTypes: true })
    targets = entries
      .filter(e => e.isDirectory())
      .map(e => e.name)

    if (targets.length === 0) {
      console.log(chalk.yellow('No components found in ' + config.componentsDir))
      return
    }
  }

  console.log()
  const statuses: ComponentStatus[] = []

  for (const name of targets) {
    const status = await checkComponent(name, config, options, cwd)
    if (status) statuses.push(status)
  }

  const upgradeable = statuses.filter(s => s.hasUpdates)
  const upToDate = statuses.filter(s => !s.hasUpdates)

  if (upToDate.length > 0) {
    console.log(chalk.dim(`Up to date: ${upToDate.map(s => s.name).join(', ')}`))
  }

  if (upgradeable.length === 0) {
    console.log(chalk.green('\nAll components are up to date.'))
    return
  }

  console.log()
  console.log(chalk.bold('Updates available:'))
  for (const s of upgradeable) {
    const modified = s.modifiedFiles.length > 0 ? chalk.yellow(` (${s.modifiedFiles.length} local changes)`) : ''
    console.log(`  ${chalk.cyan(s.name)}: ${s.currentVersion} → ${chalk.green(s.latestVersion)}${modified}`)
    if (s.modifiedFiles.length > 0) {
      for (const f of s.modifiedFiles) {
        console.log(chalk.yellow(`      modified: ${f}`))
      }
    }
  }

  let toUpgrade = upgradeable

  if (!options.yes) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `Upgrade ${upgradeable.length} component(s)?`,
        default: true,
      },
    ])
    if (!confirmed) {
      console.log(chalk.yellow('Upgrade cancelled.'))
      return
    }

    // If any have local modifications, warn per component
    const withMods = upgradeable.filter(s => s.modifiedFiles.length > 0)
    if (withMods.length > 0) {
      const { overwriteAll } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwriteAll',
          message: chalk.yellow(`${withMods.length} component(s) have local modifications. Overwrite?`),
          default: false,
        },
      ])
      if (!overwriteAll) {
        toUpgrade = upgradeable.filter(s => s.modifiedFiles.length === 0)
        console.log(chalk.dim(`Skipping modified: ${withMods.map(s => s.name).join(', ')}`))
      }
    }
  }

  console.log()
  for (const status of toUpgrade) {
    const spinner = ora(`Upgrading ${status.name}…`).start()
    try {
      const component = await fetchComponent(status.name, options.registry)
      spinner.succeed(`Upgraded ${chalk.cyan(status.name)} to ${chalk.green(status.latestVersion)}`)
      writeFiles(component, config, cwd)
    } catch {
      spinner.fail(`Failed to upgrade ${status.name}`)
    }
  }

  console.log()
  console.log(chalk.green('Done!'))
}
