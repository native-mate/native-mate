import { registerRootComponent } from 'expo'
import { AppRegistry } from 'react-native'

const STORYBOOK_ENABLED = process.env.STORYBOOK_ENABLED === 'true'

async function main() {
  let App

  if (STORYBOOK_ENABLED) {
    const sb = await import('./.storybook')
    App = sb.default
  } else {
    App = (await import('./src/App')).default
  }

  registerRootComponent(App)
}

main()
