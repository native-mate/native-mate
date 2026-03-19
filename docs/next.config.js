const path = require('path')
const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Next.js 16 uses React 19 types; project uses @types/react 18. Mismatch is harmless.
    ignoreBuildErrors: true,
  },
  // Turbopack config for Next.js 16+ (replaces webpack aliases/extensions)
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'expo-haptics': './src/stubs/expo-haptics.js',
      '@react-native/assets-registry': './src/stubs/assets-registry.js',
      '@react-native/assets-registry/registry': './src/stubs/assets-registry.js',
    },
    resolveExtensions: [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      '.js', '.jsx', '.ts', '.tsx',
    ],
  },
  // Keep webpack config as fallback (used when --webpack flag is passed)
  webpack: (config) => {
    // Define React Native globals
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      })
    )
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      // Map expo-haptics to a no-op stub on web
      'expo-haptics': path.resolve(__dirname, 'src/stubs/expo-haptics.js'),
      // @react-native/assets-registry uses Flow types which webpack can't parse
      '@react-native/assets-registry$': path.resolve(__dirname, 'src/stubs/assets-registry.js'),
      '@react-native/assets-registry/registry': path.resolve(__dirname, 'src/stubs/assets-registry.js'),
    }
    config.resolve.extensions = [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      ...config.resolve.extensions,
    ]
    // Handle font files from @expo/vector-icons and react-native-vector-icons
    config.module.rules.push({
      test: /\.(ttf|otf|woff|woff2|eot)$/,
      type: 'asset/resource',
    })
    return config
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    '@native-mate/core',
    '@expo/vector-icons',
  ],
}

module.exports = nextConfig
