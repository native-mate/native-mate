import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import semver from 'semver'
import { readConfig, configExists } from '../utils/config'
import { fetchComponent } from '../registry/client'
import { printBranding } from '../utils/branding'
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
  let latest: RegistryComponent
  try {
    latest = await fetchComponent(name, options.registry)
  } catch {
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

    const diskBody = diskContent.split('\n').slice(1).join('\n')
    const diskHash = hashContent(diskBody)
    if (diskHash !== file.hash) {
      modifiedFiles.push(file.path)
    }
  }

  const hasUpdates = semver.gt(
    latest.version,
    currentVersion === 'unknown' ? '0.0.0' : currentVersion
  )

  return { name, currentVersion, latestVersion: latest.version, hasUpdates, modifiedFiles }
}

export async function upgrade(names: string[], options: UpgradeOptions) {
  printBranding()
  p.intro(pc.bgCyan(pc.black(' native-mate upgrade ')))

  const cwd = process.cwd()

  if (!configExists(cwd)) {
    p.log.error(
      'native-mate.json not found. Run ' + pc.cyan('native-mate init') + ' first.'
    )
    process.exit(1)
  }

  const config = (() => {
    try {
      return readConfig(cwd)
    } catch (err: unknown) {
      p.log.error((err as Error).message)
      process.exit(1)
    }
  })()

  // If no names given, scan installed components
  let targets = names
  if (targets.length === 0) {
    const componentsDir = join(cwd, config.componentsDir)
    if (!existsSync(componentsDir)) {
      p.log.warn('No components installed yet.')
      p.outro('Nothing to upgrade.')
      return
    }
    const entries = readdirSync(componentsDir, { withFileTypes: true })
    // Components can be flat files (button.tsx) or directories (button/)
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
      .map((e) => e.name.replace('.tsx', ''))
    targets = [...new Set([...dirs, ...files])]

    if (targets.length === 0) {
      p.log.warn('No components found in ' + config.componentsDir)
      p.outro('Nothing to upgrade.')
      return
    }
  }

  const s = p.spinner()
  s.start(`Checking ${targets.length} component(s) for updates`)

  const statuses: ComponentStatus[] = []
  for (const name of targets) {
    const status = await checkComponent(name, config, options, cwd)
    if (status) statuses.push(status)
  }

  s.stop(pc.green('Check complete'))

  const upgradeable = statuses.filter((st) => st.hasUpdates)
  const upToDate = statuses.filter((st) => !st.hasUpdates)

  if (upToDate.length > 0) {
    p.log.info(pc.dim(`Up to date: ${upToDate.map((st) => st.name).join(', ')}`))
  }

  if (upgradeable.length === 0) {
    p.outro(pc.green('All components are up to date.'))
    return
  }

  // Show available updates
  p.log.message(pc.bold('Updates available:'))
  for (const st of upgradeable) {
    const modified =
      st.modifiedFiles.length > 0
        ? pc.yellow(` (${st.modifiedFiles.length} local changes)`)
        : ''
    p.log.step(
      `${pc.cyan(st.name)}: ${st.currentVersion} ${pc.dim('->')} ${pc.green(st.latestVersion)}${modified}`
    )
    for (const f of st.modifiedFiles) {
      console.log(pc.yellow(`         modified: ${f}`))
    }
  }

  let toUpgrade = upgradeable

  if (!options.yes) {
    // Let user pick which components to upgrade
    if (upgradeable.length > 1) {
      const selected = await p.multiselect({
        message: 'Which components to upgrade?',
        options: upgradeable.map((st) => ({
          value: st.name,
          label: st.name,
          hint: `${st.currentVersion} -> ${st.latestVersion}${st.modifiedFiles.length > 0 ? ' (modified locally)' : ''}`,
        })),
        initialValues: upgradeable
          .filter((st) => st.modifiedFiles.length === 0)
          .map((st) => st.name),
        required: true,
      })

      if (p.isCancel(selected)) {
        p.cancel('Upgrade cancelled.')
        return
      }

      const selectedSet = new Set(selected as string[])
      toUpgrade = upgradeable.filter((st) => selectedSet.has(st.name))
    } else {
      const confirmed = await p.confirm({
        message: `Upgrade ${pc.cyan(upgradeable[0].name)} to ${pc.green(upgradeable[0].latestVersion)}?`,
        initialValue: true,
      })

      if (p.isCancel(confirmed) || !confirmed) {
        p.cancel('Upgrade cancelled.')
        return
      }
    }

    // Warn about locally modified components
    const withMods = toUpgrade.filter((st) => st.modifiedFiles.length > 0)
    if (withMods.length > 0) {
      const overwrite = await p.confirm({
        message: pc.yellow(
          `${withMods.length} component(s) have local modifications. Overwrite them?`
        ),
        initialValue: false,
      })

      if (p.isCancel(overwrite) || !overwrite) {
        toUpgrade = toUpgrade.filter((st) => st.modifiedFiles.length === 0)
        if (toUpgrade.length === 0) {
          p.cancel('No components to upgrade.')
          return
        }
        p.log.info(
          pc.dim(`Skipping modified: ${withMods.map((st) => st.name).join(', ')}`)
        )
      }
    }
  }

  // Perform upgrades
  const upgradeSpinner = p.spinner()
  for (const status of toUpgrade) {
    upgradeSpinner.start(`Upgrading ${status.name}`)
    try {
      const component = await fetchComponent(status.name, options.registry)
      for (const file of component.files) {
        const dest = join(cwd, config.componentsDir, file.path)
        writeFileSync(dest, file.content, 'utf-8')
      }
      upgradeSpinner.stop(
        pc.green(`${pc.cyan(status.name)} upgraded to ${pc.green(status.latestVersion)}`)
      )
    } catch {
      upgradeSpinner.stop(pc.red(`Failed to upgrade ${status.name}`))
    }
  }

  p.outro(pc.green(`Done! Upgraded ${toUpgrade.length} component(s).`))
}
