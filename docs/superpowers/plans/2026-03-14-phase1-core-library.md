# Phase 1: Core Library Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish `@native-mate/core` — the token system, ThemeProvider, makeStyles, primitive components, and 25 registry components with Storybook.

**Architecture:** Turborepo monorepo with `packages/core` (published to npm), `packages/registry` (internal component source + build scripts), and `apps/storybook` (Expo app for visual QA). Token system uses typed TypeScript constants; ThemeProvider resolves light/dark at runtime via `useColorScheme()`; components consume tokens via `makeStyles` + `useTheme`; animations run on UI thread via Reanimated 3.

**Tech Stack:** React Native, Expo SDK 54, TypeScript strict, Reanimated 3, @testing-library/react-native, jest-expo, Turborepo, @storybook/react-native

---

## File Map

```
native-mate/
├── package.json                          # root — workspaces + turbo scripts
├── turbo.json                            # pipeline config
├── tsconfig.base.json                    # shared TS config
├── .gitignore
│
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   └── src/
│   │       ├── index.ts                  # all public exports
│   │       ├── tokens/
│   │       │   ├── types.ts              # TokenSet, ColorToken, ResolvedTheme, NativeMateConfig
│   │       │   ├── presets/
│   │       │   │   ├── zinc.ts
│   │       │   │   ├── slate.ts
│   │       │   │   ├── rose.ts
│   │       │   │   └── midnight.ts
│   │       │   └── index.ts              # exports all presets + resolveTokens()
│   │       ├── theme/
│   │       │   ├── ThemeContext.ts       # React context definition
│   │       │   ├── ThemeProvider.tsx     # provider, resolves tokens by mode
│   │       │   ├── useTheme.ts           # hook: returns ResolvedTheme
│   │       │   └── makeStyles.ts         # makeStyles<T>(factory) → () => T
│   │       ├── primitives/
│   │       │   ├── Text/
│   │       │   │   ├── Text.tsx
│   │       │   │   └── Text.types.ts
│   │       │   ├── Icon/
│   │       │   │   ├── Icon.tsx
│   │       │   │   └── Icon.types.ts
│   │       │   ├── Spinner/
│   │       │   │   ├── Spinner.tsx
│   │       │   │   └── Spinner.types.ts
│   │       │   └── Separator/
│   │       │       ├── Separator.tsx
│   │       │       └── Separator.types.ts
│   │       └── utils/
│   │           ├── platform.ts           # shadow helpers, haptic wrapper
│   │           └── useBreakpoint.ts      # maps window width → 'sm'|'md'|'lg'
│   │
│   └── registry/
│       ├── package.json
│       ├── tsconfig.json
│       ├── components/
│       │   ├── button/
│       │   │   ├── button.tsx
│       │   │   ├── button.types.ts
│       │   │   ├── button.stories.tsx
│       │   │   └── index.json
│       │   ├── badge/           # same structure as button
│       │   ├── avatar/
│       │   ├── input/
│       │   ├── textarea/
│       │   ├── card/
│       │   ├── sheet/
│       │   ├── modal/
│       │   ├── screen/
│       │   ├── checkbox/
│       │   ├── radio/
│       │   ├── switch/
│       │   ├── select/
│       │   ├── slider/
│       │   ├── otp-input/
│       │   ├── toast/
│       │   ├── alert/
│       │   ├── progress/
│       │   ├── skeleton/
│       │   ├── tabs/
│       │   └── accordion/
│       └── scripts/
│           └── build-registry.ts         # reads components/, outputs dist/registry/
│
└── apps/
    └── storybook/
        ├── package.json
        ├── app.json
        ├── App.tsx
        ├── babel.config.js
        └── .storybook/
            ├── main.ts
            └── preview.tsx
```

---

## Chunk 1: Monorepo Infrastructure

### Task 1: Root package.json + Turborepo config

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialise git repo**

```bash
cd "E:/Web dev/native-mate"
git init
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "native-mate",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev --parallel"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Install root deps**

```bash
npm install
```

Expected: `node_modules/` created, turbo installed.

- [ ] **Step 4: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 5: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
.turbo/
*.log
.expo/
```

- [ ] **Step 7: Commit**

```bash
git add package.json turbo.json tsconfig.base.json .gitignore
git commit -m "chore: initialise turborepo monorepo"
```

---

### Task 2: packages/core scaffold

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/jest.config.js`
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: Create packages/core directory structure**

```bash
mkdir -p "packages/core/src/tokens/presets"
mkdir -p "packages/core/src/theme"
mkdir -p "packages/core/src/primitives/Text"
mkdir -p "packages/core/src/primitives/Icon"
mkdir -p "packages/core/src/primitives/Spinner"
mkdir -p "packages/core/src/primitives/Separator"
mkdir -p "packages/core/src/utils"
mkdir -p "packages/core/__tests__"
```

- [ ] **Step 2: Create packages/core/package.json**

```json
{
  "name": "@native-mate/core",
  "version": "0.1.0",
  "description": "Token system, ThemeProvider, and primitive components for native-mate",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "test": "jest",
    "lint": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-native-reanimated": ">=3.0.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.0.0",
    "jest": "^29.0.0",
    "jest-expo": "^51.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-reanimated": "^3.6.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Create packages/core/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

- [ ] **Step 4: Create packages/core/jest.config.js**

```js
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
}
```

- [ ] **Step 5: Create placeholder src/index.ts**

```ts
// @native-mate/core
// Exports added as modules are built
export {}
```

- [ ] **Step 6: Install packages/core deps**

```bash
cd packages/core && npm install && cd ../..
```

- [ ] **Step 7: Commit**

```bash
git add packages/core/
git commit -m "chore: scaffold @native-mate/core package"
```

---

## Chunk 2: Token System

### Task 3: Token types

**Files:**
- Create: `packages/core/src/tokens/types.ts`
- Create: `packages/core/__tests__/tokens.test.ts`

- [ ] **Step 1: Write failing test for token types**

```ts
// packages/core/__tests__/tokens.test.ts
import { zinc } from '../src/tokens/presets/zinc'
import type { TokenSet, ResolvedTheme } from '../src/tokens/types'

describe('token types', () => {
  it('zinc preset satisfies TokenSet shape', () => {
    const preset: TokenSet = zinc
    expect(preset.colors.background.light).toBeDefined()
    expect(preset.colors.background.dark).toBeDefined()
    expect(preset.spacing.md).toBe(12)
    expect(preset.radius.full).toBe(9999)
    expect(preset.typography.size.md).toBe(15)
    expect(preset.animation.speed.fast).toBe(150)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/core && npm test -- --testPathPattern=tokens
```

Expected: FAIL — cannot find module `../src/tokens/presets/zinc`

- [ ] **Step 3: Create tokens/types.ts**

```ts
// packages/core/src/tokens/types.ts

export interface ColorToken {
  light: string
  dark: string
}

export interface TokenColors {
  background: ColorToken
  surface: ColorToken
  surfaceRaised: ColorToken
  border: ColorToken
  primary: ColorToken
  onPrimary: ColorToken
  foreground: ColorToken
  onBackground: ColorToken
  onSurface: ColorToken
  muted: ColorToken
  destructive: ColorToken
  onDestructive: ColorToken
  success: ColorToken
  onSuccess: ColorToken
  warning: ColorToken
  onWarning: ColorToken
}

export interface TokenSet {
  colors: TokenColors
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    '2xl': number
    '3xl': number
  }
  radius: {
    sm: number
    md: number
    lg: number
    xl: number
    full: number
  }
  typography: {
    size: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number; '3xl': number }
    weight: { regular: string; medium: string; semibold: string; bold: string }
    lineHeight: { tight: number; normal: number; relaxed: number }
  }
  animation: {
    speed: { fast: number; normal: number; slow: number }
    easing: {
      standard: readonly [number, number, number, number]
      decelerate: readonly [number, number, number, number]
      spring: { damping: number; stiffness: number; mass: number }
    }
  }
}

// ResolvedTheme: flat mode-resolved version (no light/dark objects)
export type ResolvedColors = { [K in keyof TokenColors]: string }

export interface ResolvedTheme {
  colors: ResolvedColors
  spacing: TokenSet['spacing']
  radius: TokenSet['radius']
  typography: TokenSet['typography']
  animation: TokenSet['animation']
  colorScheme: 'light' | 'dark'
}

export type ThemePreset = 'zinc' | 'slate' | 'rose' | 'midnight'

export interface NativeMateTokenOverrides {
  colors?: Partial<ResolvedColors>
  spacing?: Partial<TokenSet['spacing']>
  radius?: Partial<TokenSet['radius']>
  animation?: { speed?: Partial<TokenSet['animation']['speed']> }
}

export interface NativeMateConfig {
  theme: ThemePreset
  componentsDir: string
  registry: string
  tokens?: {
    light?: NativeMateTokenOverrides
    dark?: NativeMateTokenOverrides
  }
}
```

- [ ] **Step 4: Create tokens/presets/zinc.ts**

```ts
// packages/core/src/tokens/presets/zinc.ts
import type { TokenSet } from '../types'

export const zinc: TokenSet = {
  colors: {
    background:    { light: '#ffffff', dark: '#0a0a0a' },
    surface:       { light: '#f4f4f5', dark: '#18181b' },
    surfaceRaised: { light: '#ffffff', dark: '#27272a' },
    border:        { light: '#e4e4e7', dark: '#3f3f46' },
    primary:       { light: '#18181b', dark: '#fafafa' },
    onPrimary:     { light: '#fafafa', dark: '#18181b' },
    foreground:    { light: '#09090b', dark: '#fafafa' },
    onBackground:  { light: '#09090b', dark: '#fafafa' },
    onSurface:     { light: '#18181b', dark: '#e4e4e7' },
    muted:         { light: '#71717a', dark: '#a1a1aa' },
    destructive:   { light: '#ef4444', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  radius:  { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
  typography: {
    size:       { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30 },
    weight:     { regular: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: 18, normal: 22, relaxed: 28 },
  },
  animation: {
    speed:  { fast: 150, normal: 250, slow: 400 },
    easing: {
      standard:   [0.4, 0.0, 0.2, 1],
      decelerate: [0.0, 0.0, 0.2, 1],
      spring:     { damping: 15, stiffness: 200, mass: 1 },
    },
  },
}
```

- [ ] **Step 5: Create tokens/presets/slate.ts**

```ts
// packages/core/src/tokens/presets/slate.ts
import type { TokenSet } from '../types'
import { zinc } from './zinc'

// Slate overrides only colors — all other tokens are shared
export const slate: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#ffffff', dark: '#0f172a' },
    surface:       { light: '#f1f5f9', dark: '#1e293b' },
    surfaceRaised: { light: '#ffffff', dark: '#334155' },
    border:        { light: '#cbd5e1', dark: '#475569' },
    primary:       { light: '#0f172a', dark: '#f8fafc' },
    onPrimary:     { light: '#f8fafc', dark: '#0f172a' },
    foreground:    { light: '#020617', dark: '#f8fafc' },
    onBackground:  { light: '#020617', dark: '#f8fafc' },
    onSurface:     { light: '#0f172a', dark: '#e2e8f0' },
    muted:         { light: '#64748b', dark: '#94a3b8' },
    destructive:   { light: '#ef4444', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
}
```

- [ ] **Step 6: Create tokens/presets/rose.ts**

```ts
// packages/core/src/tokens/presets/rose.ts
import type { TokenSet } from '../types'
import { zinc } from './zinc'

export const rose: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#ffffff', dark: '#0c0a0b' },
    surface:       { light: '#fff1f2', dark: '#1c1115' },
    surfaceRaised: { light: '#ffffff', dark: '#2d1a1f' },
    border:        { light: '#fecdd3', dark: '#4c2030' },
    primary:       { light: '#e11d48', dark: '#fb7185' },
    onPrimary:     { light: '#ffffff', dark: '#1c0a0f' },
    foreground:    { light: '#0f0a0b', dark: '#fef2f4' },
    onBackground:  { light: '#0f0a0b', dark: '#fef2f4' },
    onSurface:     { light: '#881337', dark: '#fecdd3' },
    muted:         { light: '#9f4258', dark: '#be738a' },
    destructive:   { light: '#dc2626', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
}
```

- [ ] **Step 7: Create tokens/presets/midnight.ts**

```ts
// packages/core/src/tokens/presets/midnight.ts
import type { TokenSet } from '../types'
import { zinc } from './zinc'

export const midnight: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#f8fafc', dark: '#000000' },
    surface:       { light: '#f1f5f9', dark: '#111111' },
    surfaceRaised: { light: '#ffffff', dark: '#1a1a1a' },
    border:        { light: '#e2e8f0', dark: '#2a2a2a' },
    primary:       { light: '#6366f1', dark: '#818cf8' },
    onPrimary:     { light: '#ffffff', dark: '#000000' },
    foreground:    { light: '#0f172a', dark: '#f8fafc' },
    onBackground:  { light: '#0f172a', dark: '#f8fafc' },
    onSurface:     { light: '#1e293b', dark: '#e2e8f0' },
    muted:         { light: '#64748b', dark: '#6b7280' },
    destructive:   { light: '#ef4444', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
}
```

- [ ] **Step 8: Create tokens/index.ts with resolveTokens()**

```ts
// packages/core/src/tokens/index.ts
import type { TokenSet, ResolvedTheme, NativeMateTokenOverrides } from './types'
import { zinc } from './presets/zinc'
import { slate } from './presets/slate'
import { rose } from './presets/rose'
import { midnight } from './presets/midnight'

export { zinc, slate, rose, midnight }
export * from './types'

export const presets = { zinc, slate, rose, midnight } as const

export function resolveTokens(
  preset: TokenSet,
  mode: 'light' | 'dark',
  overrides?: NativeMateTokenOverrides,
): ResolvedTheme {
  const resolvedColors = Object.fromEntries(
    Object.entries(preset.colors).map(([key, token]) => [key, token[mode]])
  ) as ResolvedTheme['colors']

  // Apply overrides if provided
  const colors = overrides?.colors
    ? { ...resolvedColors, ...overrides.colors }
    : resolvedColors

  const spacing = overrides?.spacing
    ? { ...preset.spacing, ...overrides.spacing }
    : preset.spacing

  const radius = overrides?.radius
    ? { ...preset.radius, ...overrides.radius }
    : preset.radius

  const animation = overrides?.animation?.speed
    ? { ...preset.animation, speed: { ...preset.animation.speed, ...overrides.animation.speed } }
    : preset.animation

  return {
    colors,
    spacing,
    radius,
    typography: preset.typography,
    animation,
    colorScheme: mode,
  }
}
```

- [ ] **Step 9: Run token tests**

```bash
cd packages/core && npm test -- --testPathPattern=tokens
```

Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add packages/core/src/tokens/ packages/core/__tests__/tokens.test.ts
git commit -m "feat(core): add token system with 4 presets and resolveTokens()"
```

---

## Chunk 3: Theme Infrastructure

### Task 4: ThemeContext + ThemeProvider

**Files:**
- Create: `packages/core/src/theme/ThemeContext.ts`
- Create: `packages/core/src/theme/ThemeProvider.tsx`
- Create: `packages/core/__tests__/ThemeProvider.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// packages/core/__tests__/ThemeProvider.test.tsx
import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import { useTheme } from '../src/theme/useTheme'

const TestChild = () => {
  const theme = useTheme()
  return <Text testID="color">{theme.colors.background}</Text>
}

describe('ThemeProvider', () => {
  it('provides resolved light theme by default', () => {
    const { getByTestId } = render(
      <ThemeProvider preset="zinc">
        <TestChild />
      </ThemeProvider>
    )
    // zinc light background is #ffffff
    expect(getByTestId('color').props.children).toBe('#ffffff')
  })

  it('provides resolved dark theme when colorScheme is dark', () => {
    const { getByTestId } = render(
      <ThemeProvider preset="zinc" forcedColorScheme="dark">
        <TestChild />
      </ThemeProvider>
    )
    // zinc dark background is #0a0a0a
    expect(getByTestId('color').props.children).toBe('#0a0a0a')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/core && npm test -- --testPathPattern=ThemeProvider
```

Expected: FAIL — cannot find module `../src/theme/ThemeProvider`

- [ ] **Step 3: Create ThemeContext.ts**

```ts
// packages/core/src/theme/ThemeContext.ts
import { createContext } from 'react'
import type { ResolvedTheme } from '../tokens/types'
import { resolveTokens, zinc } from '../tokens'

// Default context value (zinc light) — used when no provider is present
export const defaultTheme: ResolvedTheme = resolveTokens(zinc, 'light')

export const ThemeContext = createContext<ResolvedTheme>(defaultTheme)
```

- [ ] **Step 4: Create ThemeProvider.tsx**

```tsx
// packages/core/src/theme/ThemeProvider.tsx
import React, { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { ThemeContext } from './ThemeContext'
import { presets, resolveTokens } from '../tokens'
import type { ThemePreset, NativeMateTokenOverrides } from '../tokens/types'

interface ThemeProviderProps {
  preset?: ThemePreset
  forcedColorScheme?: 'light' | 'dark'
  overrides?: { light?: NativeMateTokenOverrides; dark?: NativeMateTokenOverrides }
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  preset = 'zinc',
  forcedColorScheme,
  overrides,
  children,
}) => {
  const systemColorScheme = useColorScheme()
  const mode = forcedColorScheme ?? systemColorScheme ?? 'light'

  const theme = useMemo(
    () => resolveTokens(presets[preset], mode, overrides?.[mode]),
    [preset, mode, overrides],
  )

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
```

- [ ] **Step 5: Create useTheme.ts**

```ts
// packages/core/src/theme/useTheme.ts
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import type { ResolvedTheme } from '../tokens/types'

export function useTheme(): ResolvedTheme {
  return useContext(ThemeContext)
}
```

- [ ] **Step 6: Run tests**

```bash
cd packages/core && npm test -- --testPathPattern=ThemeProvider
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/theme/ packages/core/__tests__/ThemeProvider.test.tsx
git commit -m "feat(core): add ThemeProvider, useTheme, ThemeContext"
```

---

### Task 5: makeStyles

**Files:**
- Create: `packages/core/src/theme/makeStyles.ts`
- Create: `packages/core/__tests__/makeStyles.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// packages/core/__tests__/makeStyles.test.tsx
import React from 'react'
import { renderHook } from '@testing-library/react-native'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import { makeStyles } from '../src/theme/makeStyles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
}))

describe('makeStyles', () => {
  it('returns styles resolved with theme tokens', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider preset="zinc">{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useStyles(), { wrapper })
    // zinc light surface = #f4f4f5, spacing.md = 12, radius.md = 10
    expect(result.current.container.backgroundColor).toBe('#f4f4f5')
    expect(result.current.container.padding).toBe(12)
    expect(result.current.container.borderRadius).toBe(10)
  })

  it('updates styles when theme changes', () => {
    const darkWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider preset="zinc" forcedColorScheme="dark">{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useStyles(), { wrapper: darkWrapper })
    // zinc dark surface = #18181b
    expect(result.current.container.backgroundColor).toBe('#18181b')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/core && npm test -- --testPathPattern=makeStyles
```

Expected: FAIL

- [ ] **Step 3: Create makeStyles.ts**

```ts
// packages/core/src/theme/makeStyles.ts
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from './useTheme'
import type { ResolvedTheme } from '../tokens/types'

type StyleFactory<T extends StyleSheet.NamedStyles<T>> = (theme: ResolvedTheme) => T

export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: StyleFactory<T>,
): () => T {
  return function useStyles(): T {
    const theme = useTheme()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => StyleSheet.create(factory(theme)), [theme])
  }
}
```

- [ ] **Step 4: Run tests**

```bash
cd packages/core && npm test -- --testPathPattern=makeStyles
```

Expected: PASS

- [ ] **Step 5: Update packages/core/src/index.ts**

```ts
// @native-mate/core
export { ThemeProvider } from './theme/ThemeProvider'
export { useTheme } from './theme/useTheme'
export { makeStyles } from './theme/makeStyles'
export { presets, resolveTokens } from './tokens'
export type {
  TokenSet,
  ResolvedTheme,
  ThemePreset,
  NativeMateConfig,
  NativeMateTokenOverrides,
  TokenColors,
  ColorToken,
} from './tokens/types'
```

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/theme/makeStyles.ts packages/core/__tests__/makeStyles.test.tsx packages/core/src/index.ts
git commit -m "feat(core): add makeStyles utility"
```

---

## Chunk 4: Utility Helpers + Core Primitives

### Task 6: Platform utils + useBreakpoint

**Files:**
- Create: `packages/core/src/utils/platform.ts`
- Create: `packages/core/src/utils/useBreakpoint.ts`

- [ ] **Step 1: Create platform.ts**

```ts
// packages/core/src/utils/platform.ts
import { Platform } from 'react-native'

// iOS shadow props
export function iosShadow(
  color = '#000',
  opacity = 0.1,
  radius = 8,
  offsetY = 2,
) {
  if (Platform.OS !== 'ios') return {}
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: offsetY },
  }
}

// Android elevation
export function androidElevation(level: number) {
  if (Platform.OS !== 'android') return {}
  return { elevation: level }
}

// Cross-platform shadow
export function shadow(level: 1 | 2 | 3 | 4 = 1) {
  const config = {
    1: { opacity: 0.06, radius: 4,  offsetY: 1, elevation: 2 },
    2: { opacity: 0.10, radius: 8,  offsetY: 2, elevation: 4 },
    3: { opacity: 0.14, radius: 16, offsetY: 4, elevation: 8 },
    4: { opacity: 0.18, radius: 24, offsetY: 8, elevation: 12 },
  }[level]

  return {
    ...iosShadow('#000', config.opacity, config.radius, config.offsetY),
    ...androidElevation(config.elevation),
  }
}
```

- [ ] **Step 2: Create useBreakpoint.ts**

```ts
// packages/core/src/utils/useBreakpoint.ts
import { useWindowDimensions } from 'react-native'

export type Breakpoint = 'sm' | 'md' | 'lg'

const breakpoints = { sm: 0, md: 768, lg: 1024 } as const

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions()
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  return 'sm'
}
```

- [ ] **Step 3: Export from index.ts**

Add to `packages/core/src/index.ts`:
```ts
export { shadow, iosShadow, androidElevation } from './utils/platform'
export { useBreakpoint } from './utils/useBreakpoint'
export type { Breakpoint } from './utils/useBreakpoint'
```

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/utils/
git commit -m "feat(core): add platform shadow utils and useBreakpoint hook"
```

---

### Task 7: Primitive — Text

**Files:**
- Create: `packages/core/src/primitives/Text/Text.types.ts`
- Create: `packages/core/src/primitives/Text/Text.tsx`

- [ ] **Step 1: Create Text.types.ts**

```ts
// packages/core/src/primitives/Text/Text.types.ts
import type { TextProps as RNTextProps } from 'react-native'
import type { TokenSet } from '../../tokens/types'

export type TextVariant = 'body' | 'label' | 'caption' | 'heading' | 'title' | 'display'
export type TextSize = keyof TokenSet['typography']['size']
export type TextWeight = keyof TokenSet['typography']['weight']

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant
  size?: TextSize
  weight?: TextWeight
  color?: string
  muted?: boolean
  children: React.ReactNode
}
```

- [ ] **Step 2: Create Text.tsx**

```tsx
// packages/core/src/primitives/Text/Text.tsx
import React from 'react'
import { Text as RNText } from 'react-native'
import { makeStyles } from '../../theme/makeStyles'
import type { TextProps } from './Text.types'

const variantStyles = {
  body:    { sizeKey: 'md' as const, weightKey: 'regular' as const },
  label:   { sizeKey: 'sm' as const, weightKey: 'medium'  as const },
  caption: { sizeKey: 'xs' as const, weightKey: 'regular' as const },
  heading: { sizeKey: 'xl' as const, weightKey: 'bold'    as const },
  title:   { sizeKey: '2xl' as const, weightKey: 'bold'   as const },
  display: { sizeKey: '3xl' as const, weightKey: 'bold'   as const },
}

const useStyles = makeStyles((theme) => ({
  base: {
    color: theme.colors.foreground,
  },
}))

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  weight,
  color,
  muted = false,
  style,
  children,
  ...rest
}) => {
  const styles = useStyles()
  const { colors, typography } = require('../../theme/ThemeContext')
  // Use resolved theme via inline hook
  const { sizeKey, weightKey } = variantStyles[variant]
  const theme = require('../../theme/useTheme').useTheme()

  const textStyle = {
    color: color ?? (muted ? theme.colors.muted : theme.colors.foreground),
    fontSize: theme.typography.size[size ?? sizeKey],
    fontWeight: theme.typography.weight[weight ?? weightKey] as any,
    lineHeight: theme.typography.lineHeight.normal,
  }

  return (
    <RNText style={[styles.base, textStyle, style]} {...rest}>
      {children}
    </RNText>
  )
}
```

- [ ] **Step 3: Refactor Text.tsx to use hooks correctly**

The above has a require() anti-pattern. Replace with proper hook usage:

```tsx
// packages/core/src/primitives/Text/Text.tsx
import React from 'react'
import { Text as RNText } from 'react-native'
import { useTheme } from '../../theme/useTheme'
import type { TextProps, TextVariant } from './Text.types'

const variantMap: Record<TextVariant, { sizeKey: string; weightKey: string }> = {
  body:    { sizeKey: 'md',  weightKey: 'regular' },
  label:   { sizeKey: 'sm',  weightKey: 'medium'  },
  caption: { sizeKey: 'xs',  weightKey: 'regular' },
  heading: { sizeKey: 'xl',  weightKey: 'bold'    },
  title:   { sizeKey: '2xl', weightKey: 'bold'    },
  display: { sizeKey: '3xl', weightKey: 'bold'    },
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  weight,
  color,
  muted = false,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme()
  const { sizeKey, weightKey } = variantMap[variant]

  return (
    <RNText
      style={[
        {
          color: color ?? (muted ? theme.colors.muted : theme.colors.foreground),
          fontSize: theme.typography.size[size ?? (sizeKey as any)],
          fontWeight: theme.typography.weight[weight ?? (weightKey as any)] as any,
          lineHeight: theme.typography.lineHeight.normal,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  )
}
```

- [ ] **Step 4: Create Spinner.tsx (loading indicator)**

```tsx
// packages/core/src/primitives/Spinner/Spinner.tsx
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useTheme } from '../../theme/useTheme'
import type { SpinnerProps } from './Spinner.types'

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color,
}) => {
  const theme = useTheme()
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: theme.animation.speed.slow * 1.5, easing: Easing.linear }),
      -1,
      false,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const sizePx = { sm: 16, md: 24, lg: 32 }[size]
  const spinnerColor = color ?? theme.colors.primary

  return (
    <View style={{ width: sizePx, height: sizePx }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: sizePx,
            height: sizePx,
            borderRadius: sizePx / 2,
            borderWidth: 2,
            borderColor: spinnerColor,
            borderTopColor: 'transparent',
          },
        ]}
      />
    </View>
  )
}
```

- [ ] **Step 5: Create Separator.tsx**

```tsx
// packages/core/src/primitives/Separator/Separator.tsx
import React from 'react'
import { View } from 'react-native'
import { useTheme } from '../../theme/useTheme'
import type { SeparatorProps } from './Separator.types'

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  style,
}) => {
  const theme = useTheme()

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.border,
          ...(orientation === 'horizontal'
            ? { height: 1, width: '100%' }
            : { width: 1, height: '100%' }),
        },
        style,
      ]}
      accessibilityRole="none"
      accessible={false}
    />
  )
}
```

- [ ] **Step 6: Create types files for Spinner and Separator**

```ts
// packages/core/src/primitives/Spinner/Spinner.types.ts
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

```ts
// packages/core/src/primitives/Separator/Separator.types.ts
import type { ViewStyle } from 'react-native'
export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  style?: ViewStyle
}
```

- [ ] **Step 7: Create Icon.tsx (thin wrapper for vector icons)**

```tsx
// packages/core/src/primitives/Icon/Icon.tsx
// Icon is a thin pass-through — consumers use their preferred icon library.
// This component normalises size and color to theme tokens.
import React from 'react'
import { useTheme } from '../../theme/useTheme'
import type { IconProps } from './Icon.types'

export const Icon: React.FC<IconProps> = ({
  as: IconComponent,
  name,
  size = 'md',
  color,
  ...rest
}) => {
  const theme = useTheme()
  const sizePx = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }[size]
  const iconColor = color ?? theme.colors.foreground

  if (!IconComponent) return null

  return <IconComponent name={name} size={sizePx} color={iconColor} {...rest} />
}
```

```ts
// packages/core/src/primitives/Icon/Icon.types.ts
import type React from 'react'

export interface IconProps {
  as?: React.ComponentType<any>
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  [key: string]: any
}
```

- [ ] **Step 8: Export primitives from index.ts**

Add to `packages/core/src/index.ts`:
```ts
export { Text } from './primitives/Text/Text'
export { Icon } from './primitives/Icon/Icon'
export { Spinner } from './primitives/Spinner/Spinner'
export { Separator } from './primitives/Separator/Separator'
export type { TextProps, TextVariant, TextSize, TextWeight } from './primitives/Text/Text.types'
export type { IconProps } from './primitives/Icon/Icon.types'
export type { SpinnerProps } from './primitives/Spinner/Spinner.types'
export type { SeparatorProps } from './primitives/Separator/Separator.types'
```

- [ ] **Step 9: Run all tests**

```bash
cd packages/core && npm test
```

Expected: All PASS

- [ ] **Step 10: Commit**

```bash
git add packages/core/src/primitives/ packages/core/src/index.ts
git commit -m "feat(core): add Text, Icon, Spinner, Separator primitives"
```

---

## Chunk 5: Registry Setup + Button (Reference Component)

### Task 8: packages/registry scaffold

**Files:**
- Create: `packages/registry/package.json`
- Create: `packages/registry/tsconfig.json`

- [ ] **Step 1: Create registry package scaffold**

```bash
mkdir -p packages/registry/components
mkdir -p packages/registry/scripts
mkdir -p packages/registry/dist
```

```json
// packages/registry/package.json
{
  "name": "@native-mate/registry",
  "version": "0.1.0",
  "private": true,
  "description": "Internal — component source and registry build scripts",
  "scripts": {
    "build": "ts-node scripts/build-registry.ts",
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "@native-mate/core": "*",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-reanimated": "^3.6.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/registry/
git commit -m "chore: scaffold registry package"
```

---

### Task 9: Button — reference component implementation

Every registry component follows this exact pattern. Button is the reference.

**Files:**
- Create: `packages/registry/components/button/button.types.ts`
- Create: `packages/registry/components/button/button.tsx`
- Create: `packages/registry/components/button/button.stories.tsx`
- Create: `packages/registry/components/button/index.json`

- [ ] **Step 1: Create button.types.ts**

```ts
// packages/registry/components/button/button.types.ts
import type { PressableProps } from 'react-native'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create button.tsx**

```tsx
// native-mate: button@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ButtonProps, ButtonVariant, ButtonSize } from './button.types'

const useStyles = makeStyles((theme) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  // Variants
  default: {
    backgroundColor: theme.colors.primary,
  },
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: theme.colors.surface,
  },
  // Sizes
  sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm, minHeight: 32 },
  md: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, minHeight: 44 },
  lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, minHeight: 52 },
  // Disabled
  disabled: { opacity: 0.5 },
}))

const labelColor: Record<ButtonVariant, 'onPrimary' | 'onDestructive' | 'foreground' | 'onSurface'> = {
  default:     'onPrimary',
  destructive: 'onDestructive',
  outline:     'foreground',
  ghost:       'foreground',
  secondary:   'onSurface',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  accessibilityLabel,
  onPress,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.97 : 1, {
          damping: theme.animation.easing.spring.damping,
          stiffness: theme.animation.easing.spring.stiffness,
          mass: theme.animation.easing.spring.mass,
        }),
      },
    ],
  }))

  const isDisabled = disabled || loading
  const textColor = theme.colors[labelColor[variant]]

  return (
    <Pressable
      onPressIn={() => { pressed.value = 1 }}
      onPressOut={() => { pressed.value = 0 }}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      <Animated.View
        style={[
          styles.base,
          styles[variant],
          styles[size],
          isDisabled && styles.disabled,
          animatedStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Text
            variant="label"
            color={textColor}
            accessibilityElementsHidden
          >
            {children}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  )
}
```

- [ ] **Step 3: Create button.stories.tsx**

```tsx
// packages/registry/components/button/button.stories.tsx
import React from 'react'
import { View } from 'react-native'
import { ThemeProvider } from '@native-mate/core'
import { Button } from './button'

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story: any) => (
      <ThemeProvider preset="zinc">
        <View style={{ padding: 24 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
}

export const Default = () => <Button>Click me</Button>
export const Destructive = () => <Button variant="destructive">Delete</Button>
export const Outline = () => <Button variant="outline">Cancel</Button>
export const Ghost = () => <Button variant="ghost">Learn more</Button>
export const Loading = () => <Button loading>Loading...</Button>
export const AllSizes = () => (
  <View style={{ gap: 12 }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </View>
)
```

- [ ] **Step 4: Create index.json**

```json
{
  "name": "button",
  "version": "0.1.0",
  "description": "Pressable button with variants, sizes, loading state and spring animation",
  "files": [
    { "path": "button.tsx", "hash": "" },
    { "path": "button.types.ts", "hash": "" }
  ],
  "dependencies": {
    "npm": [],
    "components": []
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add packages/registry/components/button/
git commit -m "feat(registry): add Button component (reference implementation)"
```

---

## Chunk 6: Remaining Primitive Registry Components

> **Pattern note:** Every component below follows the identical structure established by Button in Chunk 5:
> 1. `[name].types.ts` — prop interface exports
> 2. `[name].tsx` — component with `makeStyles` + `useTheme` + Reanimated animation where applicable
> 3. `[name].stories.tsx` — Storybook stories
> 4. `index.json` — registry metadata
>
> The tasks below specify the unique implementation details for each component. Boilerplate (file headers, story decorators, index.json structure) follows the Button pattern exactly.

### Task 10: Badge

**File:** `packages/registry/components/badge/`

- [ ] **Step 1: Create badge.types.ts**

```ts
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}
```

- [ ] **Step 2: Create badge.tsx** — small pill with `borderRadius: theme.radius.full`, no animation needed. Variant drives background color. Text size `xs`, weight `medium`.

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Badge component`

---

### Task 11: Avatar

**File:** `packages/registry/components/avatar/`

- [ ] **Step 1: Create avatar.types.ts**

```ts
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export interface AvatarProps {
  src?: string
  fallback?: string   // initials or icon name
  size?: AvatarSize
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create avatar.tsx** — circular image (`borderRadius: theme.radius.full`). Show `fallback` initials text on image load error or when no `src`. Sizes: sm=32, md=40, lg=48, xl=64. Background `theme.colors.surface` for fallback.

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Avatar component`

---

### Task 12: Input

**File:** `packages/registry/components/input/`

- [ ] **Step 1: Create input.types.ts**

```ts
import type { TextInputProps } from 'react-native'
export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
}
```

- [ ] **Step 2: Create input.tsx** — `TextInput` wrapped in a `View`. Shows `label` above, `error` or `hint` below in small text. Border color: `theme.colors.border` default, `theme.colors.destructive` when `error` is set. `minHeight: 44` for tap target. Focus state: border brightens (use `useState` for focus, animate border color opacity with `withTiming`).

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Input component`

---

### Task 13: Textarea

**File:** `packages/registry/components/textarea/`

Same as Input but `multiline={true}`, `numberOfLines={4}`, `textAlignVertical="top"`, `minHeight: 96`. No separate task — extend Input pattern.

- [ ] **Step 1: Create all files following Input pattern with multiline adjustments**

- [ ] **Step 2: Commit** `feat(registry): add Textarea component`

---

### Task 14: Card

**File:** `packages/registry/components/card/`

- [ ] **Step 1: Create card.types.ts**

```ts
import type { ViewProps } from 'react-native'
export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
```

- [ ] **Step 2: Create card.tsx** — `View` with `backgroundColor: theme.colors.surfaceRaised`, `borderRadius: theme.radius.lg`, `borderWidth: 1`, `borderColor: theme.colors.border`, plus `shadow(2)` from platform utils.

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Card component`

---

### Task 15: Screen (SafeAreaView wrapper)

**File:** `packages/registry/components/screen/`

- [ ] **Step 1: Create screen.types.ts**

```ts
import type { ViewProps } from 'react-native'
export interface ScreenProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode
  backgroundColor?: string
}
```

- [ ] **Step 2: Create screen.tsx** — wraps children in `SafeAreaView` (from `react-native-safe-area-context`, listed as npm dep in index.json). Applies `backgroundColor: theme.colors.background`. This is the standard screen root component.

index.json `dependencies.npm`: `["react-native-safe-area-context"]`

- [ ] **Step 3: Commit** `feat(registry): add Screen component`

---

### Task 16: Sheet (Bottom Sheet)

**File:** `packages/registry/components/sheet/`

- [ ] **Step 1: Create sheet.types.ts**

```ts
export interface SheetProps {
  visible: boolean
  onClose: () => void
  snapPoints?: number[]   // heights in px, e.g. [300, 500]
  children: React.ReactNode
  title?: string
}
```

- [ ] **Step 2: Create sheet.tsx** — Modal-based bottom sheet (avoids `@gorhom/bottom-sheet` dependency — zero extra deps). Animated `translateY` with `withSpring` on open/close. Backdrop tap closes. `snapPoints[0]` is initial height. Drag handle at top. `borderTopLeftRadius + borderTopRightRadius: theme.radius.xl`.

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Sheet bottom sheet component`

---

### Task 17: Modal

**File:** `packages/registry/components/modal/`

- [ ] **Step 1: Create modal.types.ts**

```ts
export interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
}
```

- [ ] **Step 2: Create modal.tsx** — uses RN `Modal`. Center-aligned dialog with backdrop. Scale + opacity animation on open (`withSpring` + `withTiming`). Sizes map to `maxWidth`: sm=320, md=480, lg=640, fullscreen=100%.

- [ ] **Step 3: Create stories + index.json**

- [ ] **Step 4: Commit** `feat(registry): add Modal component`

---

## Chunk 7: Form Components

### Task 18: Checkbox

- [ ] **Step 1: Create checkbox.types.ts**

```ts
export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create checkbox.tsx** — 20×20 box, `borderRadius: theme.radius.sm`, border `theme.colors.border`. When checked: `backgroundColor: theme.colors.primary`. Checkmark drawn with a rotated `View` border trick (no SVG dep). Animate fill with `withTiming`. `accessibilityRole="checkbox"`.

- [ ] **Step 3: Commit** `feat(registry): add Checkbox component`

---

### Task 19: Radio

- [ ] Same pattern as Checkbox but circular (`borderRadius: theme.radius.full`), inner filled dot instead of checkmark. `accessibilityRole="radio"`.

- [ ] **Step 1: Create all files**

- [ ] **Step 2: Commit** `feat(registry): add Radio component`

---

### Task 20: Switch

- [ ] **Step 1: Create switch.types.ts**

```ts
export interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create switch.tsx** — Custom animated toggle (not RN's `Switch` — too platform-specific and not theme-aware). Track: 50×28, `borderRadius: theme.radius.full`. Thumb: 22×22, animated `translateX` with `withSpring`. Track color: `theme.colors.primary` (on) vs `theme.colors.border` (off). `accessibilityRole="switch"`.

- [ ] **Step 3: Commit** `feat(registry): add Switch component`

---

### Task 21: Select

- [ ] **Step 1: Create select.types.ts**

```ts
export interface SelectOption { label: string; value: string }
export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}
```

- [ ] **Step 2: Create select.tsx** — Pressable trigger showing current value/placeholder. Opens a Sheet containing a `FlatList` of options. Selected option shows a checkmark. Each option row: `minHeight: 44` for accessibility.

- [ ] **Step 3: Commit** `feat(registry): add Select component`

---

### Task 22: Slider

- [ ] **Step 1: Create slider.types.ts**

```ts
export interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create slider.tsx** — Custom gesture-based slider using `PanResponder`. Track: full width, `height: 4`. Thumb: 20×20 circle. Fill track width computed from value. `accessibilityRole="adjustable"`, `accessibilityValue={{ min, max, now: value }}`.

- [ ] **Step 3: Commit** `feat(registry): add Slider component`

---

### Task 23: OTPInput

- [ ] **Step 1: Create otp-input.types.ts**

```ts
export interface OTPInputProps {
  length?: number     // default 6
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
}
```

- [ ] **Step 2: Create otp-input.tsx** — Row of `length` individual boxes. One hidden `TextInput` captures real input. Boxes display individual characters. Active box has `borderColor: theme.colors.primary`. Filled boxes show entered digit. Error state: `borderColor: theme.colors.destructive`.

- [ ] **Step 3: Commit** `feat(registry): add OTPInput component`

---

## Chunk 8: Feedback + Disclosure Components

### Task 24: Toast

- [ ] **Step 1: Create toast.types.ts**

```ts
export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning'
export interface ToastProps {
  message: string
  description?: string
  variant?: ToastVariant
  duration?: number    // ms, default 3000
  visible: boolean
  onHide: () => void
  position?: 'top' | 'bottom'
}
```

- [ ] **Step 2: Create toast.tsx** — Floating overlay. Animates in from top/bottom with `withSpring`, auto-dismisses after `duration` with `withTiming`. Contains icon (variant-driven) + message + optional description. `accessibilityRole="alert"`.

- [ ] **Step 3: Commit** `feat(registry): add Toast component`

---

### Task 25: Alert

- [ ] **Step 1: Create alert.types.ts**

```ts
export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning'
export interface AlertProps {
  variant?: AlertVariant
  title: string
  description?: string
  children?: React.ReactNode
}
```

- [ ] **Step 2: Create alert.tsx** — Static inline alert box (not modal). Left border `width: 4` in variant color. Background is a tinted version of the variant color at low opacity. `accessibilityRole="alert"`.

- [ ] **Step 3: Commit** `feat(registry): add Alert component`

---

### Task 26: Progress

- [ ] **Step 1: Create progress.types.ts**

```ts
export interface ProgressProps {
  value: number    // 0–100
  animated?: boolean
  color?: string
  accessibilityLabel?: string
}
```

- [ ] **Step 2: Create progress.tsx** — Track: full width, `height: 8`, `borderRadius: theme.radius.full`, `backgroundColor: theme.colors.surface`. Fill: animated `width` via `useAnimatedStyle` + `withTiming`. `accessibilityRole="progressbar"`.

- [ ] **Step 3: Commit** `feat(registry): add Progress component`

---

### Task 27: Skeleton

- [ ] **Step 1: Create skeleton.types.ts**

```ts
export interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}
```

- [ ] **Step 2: Create skeleton.tsx** — Shimmer animation: two overlapping Views, top one pulses opacity `0.4 → 1 → 0.4` with `withRepeat(withTiming(...))`. Background `theme.colors.surface`.

- [ ] **Step 3: Commit** `feat(registry): add Skeleton component`

---

### Task 28: Tabs

- [ ] **Step 1: Create tabs.types.ts**

```ts
export interface TabItem { key: string; label: string }
export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}
```

- [ ] **Step 2: Create tabs.tsx** — Horizontal scrollable tab row. Active tab has animated underline indicator (animated `translateX` + `width` with `withSpring`). Tab labels use `Text` variant `label`. `accessibilityRole="tab"` on each item.

- [ ] **Step 3: Commit** `feat(registry): add Tabs component`

---

### Task 29: Accordion

- [ ] **Step 1: Create accordion.types.ts**

```ts
export interface AccordionItem { key: string; title: string; content: React.ReactNode }
export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}
```

- [ ] **Step 2: Create accordion.tsx** — Each item has a Pressable header and animated collapsible content (`height: 0 → measured`). Chevron icon rotates 180° with `withSpring` on open. `accessibilityRole="button"`, `accessibilityExpanded` on header.

- [ ] **Step 3: Run all tests**

```bash
cd packages/core && npm test
```

Expected: All PASS

- [ ] **Step 4: Commit** `feat(registry): add Accordion component — completes v1 component set`

---

## Chunk 9: Storybook App + Registry Build Script

### Task 30: apps/storybook Expo app

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/app.json`
- Create: `apps/storybook/App.tsx`
- Create: `apps/storybook/babel.config.js`
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.tsx`

- [ ] **Step 1: Create apps/storybook/package.json**

```json
{
  "name": "native-mate-storybook",
  "version": "0.1.0",
  "private": true,
  "main": "App.tsx",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "storybook": "STORYBOOK_ENABLED=true expo start"
  },
  "dependencies": {
    "@native-mate/core": "*",
    "@native-mate/registry": "*",
    "@storybook/react-native": "^7.6.0",
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-reanimated": "^3.6.0",
    "react-native-safe-area-context": "^4.10.0"
  }
}
```

- [ ] **Step 2: Create App.tsx**

```tsx
// apps/storybook/App.tsx
import { registerRootComponent } from 'expo'
import { ThemeProvider } from '@native-mate/core'
import React from 'react'

let AppComponent: React.FC

if (process.env.STORYBOOK_ENABLED) {
  const StorybookUI = require('./.storybook').default
  AppComponent = () => (
    <ThemeProvider preset="zinc">
      <StorybookUI />
    </ThemeProvider>
  )
} else {
  AppComponent = () => (
    <ThemeProvider preset="zinc">
      {/* Dev sandbox — add components here for quick testing */}
    </ThemeProvider>
  )
}

registerRootComponent(AppComponent)
export default AppComponent
```

- [ ] **Step 3: Create .storybook/main.ts**

```ts
// apps/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native'

const config: StorybookConfig = {
  stories: [
    '../../packages/registry/components/**/*.stories.tsx',
  ],
  addons: [],
}

export default config
```

- [ ] **Step 4: Create .storybook/preview.tsx**

```tsx
// apps/storybook/.storybook/preview.tsx
import React from 'react'
import { ThemeProvider } from '@native-mate/core'
import type { Preview } from '@storybook/react-native'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider preset="zinc">
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
```

- [ ] **Step 5: Create babel.config.js**

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/storybook/
git commit -m "feat(storybook): add Expo Storybook app for component development"
```

---

### Task 31: Registry build script

**Files:**
- Create: `packages/registry/scripts/build-registry.ts`

- [ ] **Step 1: Create build-registry.ts**

```ts
// packages/registry/scripts/build-registry.ts
// Reads each component's files + index.json, computes content hashes,
// and outputs versioned JSON to dist/registry/[name]/[version].json
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const COMPONENTS_DIR = path.join(__dirname, '../components')
const DIST_DIR = path.join(__dirname, '../dist/registry')

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16)
}

function buildRegistry() {
  if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true })

  const componentDirs = fs.readdirSync(COMPONENTS_DIR)

  for (const name of componentDirs) {
    const dir = path.join(COMPONENTS_DIR, name)
    const metaPath = path.join(dir, 'index.json')

    if (!fs.existsSync(metaPath)) continue

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    const files: Array<{ path: string; content: string; hash: string }> = []

    for (const file of meta.files) {
      // Skip .stories.tsx files — not distributed
      if (file.path.endsWith('.stories.tsx')) continue

      const filePath = path.join(dir, file.path)
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${filePath} not found, skipping`)
        continue
      }

      const raw = fs.readFileSync(filePath, 'utf-8')
      // Hash content WITHOUT the header line (first line)
      const lines = raw.split('\n')
      const contentWithoutHeader = lines.slice(1).join('\n')
      const hash = hashContent(contentWithoutHeader)

      // Inject real hash into first line
      const header = `// native-mate: ${name}@${meta.version} | hash:${hash}`
      const content = [header, ...lines.slice(1)].join('\n')

      files.push({ path: file.path, content, hash })
    }

    const output = {
      name,
      version: meta.version,
      description: meta.description ?? '',
      files,
      dependencies: meta.dependencies,
    }

    const outDir = path.join(DIST_DIR, name)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(
      path.join(outDir, `${meta.version}.json`),
      JSON.stringify(output, null, 2),
    )
    // Also write latest.json as alias
    fs.writeFileSync(
      path.join(outDir, 'latest.json'),
      JSON.stringify(output, null, 2),
    )

    console.log(`✓ Built ${name}@${meta.version}`)
  }

  console.log('\nRegistry build complete →', DIST_DIR)
}

buildRegistry()
```

- [ ] **Step 2: Run build**

```bash
cd packages/registry && npm run build
```

Expected: Each component prints `✓ Built [name]@0.1.0`, `dist/registry/` populated.

- [ ] **Step 3: Commit**

```bash
git add packages/registry/scripts/ packages/registry/dist/
git commit -m "feat(registry): add registry build script"
```

---

### Task 32: Final — run all tests and build @native-mate/core

- [ ] **Step 1: Run all tests from root**

```bash
npm test
```

Expected: All packages pass.

- [ ] **Step 2: Build @native-mate/core**

```bash
npm run build
```

Expected: `packages/core/dist/` populated with JS + type declarations.

- [ ] **Step 3: Verify exports**

```bash
node -e "const core = require('./packages/core/dist/index.js'); console.log(Object.keys(core))"
```

Expected: `[ 'ThemeProvider', 'useTheme', 'makeStyles', 'presets', 'resolveTokens', 'Text', 'Icon', 'Spinner', 'Separator', 'shadow', 'useBreakpoint', ... ]`

- [ ] **Step 4: Tag v0.1.0**

```bash
git tag v0.1.0-core
git commit -m "release: @native-mate/core v0.1.0 — Phase 1 complete"
```

---

## Phase 1 Done Criteria

- [ ] `@native-mate/core` builds cleanly with zero TypeScript errors
- [ ] All unit tests pass
- [ ] All 4 theme presets resolve correctly in light and dark mode
- [ ] All 25 registry components present in `packages/registry/components/`
- [ ] Registry build script outputs valid JSON for all components
- [ ] Storybook app launches in Expo Go and renders all stories
- [ ] Zero npm peer dependencies required beyond `@native-mate/core` and `react-native-reanimated` (except Screen which needs `react-native-safe-area-context`, already in most Expo projects)

---

## Next Plan

Phase 2: CLI Tool (`@native-mate/cli`) — `init`, `add`, `upgrade` commands, registry deployment to Vercel, `.cursorrules` generation.
