const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

const monorepoRoot = path.resolve(__dirname, '../..')

// Watch core package and registry so Metro can bundle them
config.watchFolders = [
  path.resolve(monorepoRoot, 'packages/core'),
  path.resolve(monorepoRoot, 'packages/registry'),
]

// Resolve @native-mate/core to the actual source
config.resolver.extraNodeModules = {
  '@native-mate/core': path.resolve(monorepoRoot, 'packages/core'),
}

// Make sure core's dependencies resolve from demo's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
]

module.exports = config
