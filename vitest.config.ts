import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/__tests__/**/*.test.ts', 'packages/**/__tests__/**/*.test.tsx'],
    alias: {
      'react-native': './packages/core/__mocks__/react-native.ts',
    },
  },
})
