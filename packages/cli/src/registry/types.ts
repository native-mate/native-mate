export interface RegistryFile {
  path: string
  content: string
  hash: string
}

export interface RegistryComponent {
  name: string
  version: string
  description: string
  files: RegistryFile[]
  dependencies: {
    npm: string[]
    components: string[]
  }
}

export interface RegistryIndex {
  components: Array<{
    name: string
    version: string
    description: string
    category: string
  }>
}
