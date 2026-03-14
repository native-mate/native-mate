import type { RegistryComponent } from './types'

const DEFAULT_REGISTRY = 'https://registry.native-mate.dev'
const GITHUB_FALLBACK = 'https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry'

export async function fetchComponent(name: string, registry: string = DEFAULT_REGISTRY): Promise<RegistryComponent> {
  const url = `${registry}/components/${name}/latest.json`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<RegistryComponent>
  } catch {
    // Fallback to GitHub raw
    const fallbackUrl = `${GITHUB_FALLBACK}/${name}/latest.json`
    const res = await fetch(fallbackUrl)
    if (!res.ok) throw new Error(`Component "${name}" not found in registry`)
    return res.json() as Promise<RegistryComponent>
  }
}

export async function fetchComponentVersion(name: string, version: string, registry: string = DEFAULT_REGISTRY): Promise<RegistryComponent> {
  const url = `${registry}/components/${name}/${version}.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Component "${name}@${version}" not found`)
  return res.json() as Promise<RegistryComponent>
}

export async function fetchIndex(registry: string = DEFAULT_REGISTRY) {
  const url = `${registry}/index.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch registry index')
  return res.json()
}
