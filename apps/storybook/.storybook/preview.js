import { ThemeProvider } from '@native-mate/core'
import { View } from 'react-native'

export const decorators = [
  (Story) => (
    <ThemeProvider preset="zinc">
      <View style={{ flex: 1, padding: 16, backgroundColor: '#09090b' }}>
        <Story />
      </View>
    </ThemeProvider>
  ),
]

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
