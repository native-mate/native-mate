import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface NativeMateConfig {
  preset: 'zinc' | 'slate' | 'rose' | 'midnight'
  componentsDir: string
  registry?: string
}

const CONFIG_FILE = 'native-mate.json'

export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, CONFIG_FILE))
}

export function readConfig(cwd: string = process.cwd()): NativeMateConfig {
  const configPath = join(cwd, CONFIG_FILE)
  if (!existsSync(configPath)) {
    throw new Error('native-mate.json not found. Run `native-mate init` first.')
  }
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8')) as NativeMateConfig
  } catch {
    throw new Error('native-mate.json is malformed. Please fix or delete it and re-run init.')
  }
}

export function writeConfig(config: NativeMateConfig, cwd: string = process.cwd()): void {
  const configPath = join(cwd, CONFIG_FILE)
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
}
