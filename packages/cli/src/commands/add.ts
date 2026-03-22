import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { readConfig, configExists } from '../utils/config'
import { detectPackageManager, runInstall } from '../utils/detect-pm'
import { fetchComponent, fetchIndex } from '../registry/client'
import { printBranding } from '../utils/branding'
import type { RegistryComponent, RegistryIndex } from '../registry/types'

interface AddOptions {
  all?: boolean
  registry?: string
  overwrite?: boolean
}

// Components not yet ready — will be added in a future release
const COMING_SOON = new Set(['tooltip', 'popover'])

async function installComponent(
  name: string,
  config: ReturnType<typeof readConfig>,
  options: AddOptions,
  cwd: string,
  installed: Set<string>
): Promise<void> {
  if (installed.has(name)) return
  installed.add(name)

  const s = p.spinner()
  s.start(`Fetching ${name}`)
  let component: RegistryComponent

  try {
    component = await fetchComponent(name, options.registry)
    s.stop(pc.green(`Fetched ${pc.cyan(name)}`))
  } catch {
    s.stop(pc.red(`Component "${name}" not found in registry`))
    throw new Error(`Component "${name}" not found`)
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
      if (existing === file.content) continue

      p.log.warn(
        `${pc.dim(file.path)} already exists ${pc.dim('(use --overwrite to replace)')}`
      )
      continue
    }

    writeFileSync(dest, file.content, 'utf-8')
    p.log.step(pc.green(file.path))
  }

  // Install npm dependencies
  if (component.dependencies.npm.length > 0) {
    const pm = detectPackageManager(cwd)
    const depSpinner = p.spinner()
    depSpinner.start(`Installing npm deps for ${name}`)
    try {
      runInstall(pm, component.dependencies.npm, cwd)
      depSpinner.stop(pc.green(`Deps installed for ${pc.cyan(name)}`))
    } catch {
      depSpinner.stop(pc.yellow(`Could not auto-install: ${component.dependencies.npm.join(', ')}`))
      p.log.warn(`Install manually: ${pc.cyan(component.dependencies.npm.join(' '))}`)
    }
  }
}

async function promptComponentSelection(registry?: string): Promise<string[]> {
  const s = p.spinner()
  s.start('Fetching component registry')

  let index: RegistryIndex | undefined
  try {
    index = await fetchIndex(registry) as RegistryIndex
    s.stop(pc.green(`Found ${pc.cyan(String(index.components.length))} components`))
  } catch {
    s.stop(pc.red('Failed to fetch registry'))
    process.exit(1)
  }
  if (!index) process.exit(1)

  // Group by category
  const categories = new Map<string, typeof index.components>()
  for (const comp of index.components) {
    if (COMING_SOON.has(comp.name)) continue
    const cat = comp.category || 'other'
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(comp)
  }

  // Build flat options with category labels as separators
  const options: { value: string; label: string; hint?: string }[] = []
  for (const [category, comps] of categories) {
    for (const comp of comps) {
      options.push({
        value: comp.name,
        label: comp.name,
        hint: `${comp.description} ${pc.dim(`[${category}]`)}`,
      })
    }
  }

  const selected = await p.multiselect({
    message: 'Which components would you like to add?',
    options,
    required: true,
  })

  if (p.isCancel(selected)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  return selected as string[]
}

export async function add(names: string[], options: AddOptions) {
  printBranding()
  p.intro(pc.bgCyan(pc.black(' native-mate add ')))

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

  // Trim whitespace and filter empty names
  names = names.map((n) => n.trim().toLowerCase()).filter(Boolean)

  // Interactive multi-select if no names provided and --all not set
  if (names.length === 0 && !options.all) {
    names = await promptComponentSelection(options.registry)
  }

  // --all: fetch everything from registry
  if (options.all) {
    const s = p.spinner()
    s.start('Fetching component registry')
    try {
      const idx = (await fetchIndex(options.registry)) as RegistryIndex
      names = idx.components
        .map((c) => c.name)
        .filter((n) => !COMING_SOON.has(n))
      s.stop(pc.green(`Adding ${pc.cyan(String(names.length))} components`))
    } catch {
      s.stop(pc.red('Failed to fetch registry'))
      process.exit(1)
    }
  }

  // Check for components not yet in v1
  for (const name of names) {
    if (COMING_SOON.has(name)) {
      p.log.warn(
        `"${name}" is not available yet — coming in a future release.`
      )
      p.log.info(
        pc.dim('Follow https://github.com/native-mate/native-mate for updates.')
      )
      process.exit(1)
    }
  }

  const installed = new Set<string>()

  for (const name of names) {
    try {
      await installComponent(name, config, options, cwd, installed)
    } catch {
      process.exit(1)
    }
  }

  p.outro(pc.green(`Done! Added ${installed.size} component(s).`))
}
