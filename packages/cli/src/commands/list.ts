import * as p from '@clack/prompts'
import pc from 'picocolors'
import { fetchIndex } from '../registry/client'
import { printBranding } from '../utils/branding'
import type { RegistryIndex } from '../registry/types'

interface ListOptions {
  registry?: string
}

export async function list(options: ListOptions) {
  printBranding()
  p.intro(pc.bgCyan(pc.black(' native-mate list ')))

  const s = p.spinner()
  s.start('Fetching registry')

  let index: RegistryIndex | undefined
  try {
    index = (await fetchIndex(options.registry)) as RegistryIndex
    s.stop(pc.green(`${index.components.length} components available`))
  } catch {
    s.stop(pc.red('Failed to fetch registry'))
    process.exit(1)
  }
  if (!index) process.exit(1)

  // Group by category
  const categories = new Map<string, typeof index.components>()
  for (const comp of index.components) {
    const cat = comp.category || 'other'
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(comp)
  }

  for (const [category, comps] of categories) {
    console.log()
    console.log(pc.bold(pc.cyan(`  ${category.charAt(0).toUpperCase() + category.slice(1)}`)))
    for (const comp of comps) {
      const name = pc.white(comp.name.padEnd(20))
      const version = pc.dim(`v${comp.version}`)
      const desc = pc.dim(comp.description)
      console.log(`    ${name} ${version}  ${desc}`)
    }
  }

  console.log()
  p.outro('Run ' + pc.cyan('native-mate add <name>') + ' to install a component.')
}
