import { existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun'
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm'

  // Check npm_config_user_agent (set by package managers when running scripts)
  const agent = process.env.npm_config_user_agent ?? ''
  if (agent.startsWith('bun')) return 'bun'
  if (agent.startsWith('pnpm')) return 'pnpm'
  if (agent.startsWith('yarn')) return 'yarn'

  return 'npm'
}

export function installCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(' ')
  switch (pm) {
    case 'bun':  return `bun add ${pkgs}`
    case 'pnpm': return `pnpm add ${pkgs}`
    case 'yarn': return `yarn add ${pkgs}`
    default:     return `npm install ${pkgs}`
  }
}

export function runInstall(pm: PackageManager, packages: string[], cwd: string = process.cwd()): void {
  const cmd = installCommand(pm, packages)
  execSync(cmd, { cwd, stdio: 'pipe' })
}
