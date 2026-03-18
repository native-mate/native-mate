const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      // Map expo-haptics to a no-op stub on web
      'expo-haptics': path.resolve(__dirname, 'src/stubs/expo-haptics.js'),
    }
    config.resolve.extensions = [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      ...config.resolve.extensions,
    ]
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
