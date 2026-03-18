import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider } from '@native-mate/core'
import 'react-native-reanimated'

export default function RootLayout() {
  return (
    <ThemeProvider preset="zinc" forcedColorScheme="dark">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#09090b' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#09090b' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'native-mate' }} />
        <Stack.Screen name="preview/[component]" options={{ title: 'Preview' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  )
}
