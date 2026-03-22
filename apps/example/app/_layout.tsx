import { useState, createContext, useContext } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider } from '@native-mate/core'
import { ToastProvider } from '../components/ui/toast'
import 'react-native-reanimated'

type Preset = 'zinc' | 'slate' | 'rose' | 'midnight'
type ColorScheme = 'light' | 'dark'

interface ThemeControl {
  preset: Preset
  colorScheme: ColorScheme
  setPreset: (p: Preset) => void
  setColorScheme: (c: ColorScheme) => void
}

export const ThemeControlContext = createContext<ThemeControl>({
  preset: 'zinc',
  colorScheme: 'light',
  setPreset: () => {},
  setColorScheme: () => {},
})

export const useThemeControl = () => useContext(ThemeControlContext)

export default function RootLayout() {
  const [preset, setPreset] = useState<Preset>('zinc')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')

  return (
    <ThemeControlContext.Provider value={{ preset, colorScheme, setPreset, setColorScheme }}>
      <ThemeProvider preset={preset} forcedColorScheme={colorScheme}>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="forms" />
            <Stack.Screen name="overlays" />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ToastProvider>
      </ThemeProvider>
    </ThemeControlContext.Provider>
  )
}
