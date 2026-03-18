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
    '@react-native/assets-registry',
    '@native-mate/core',
    '@expo/vector-icons',
  ],
}

module.exports = nextConfig
