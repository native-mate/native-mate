/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
  transpilePackages: ['react-native', 'react-native-web', 'react-native-reanimated'],
}

module.exports = nextConfig
