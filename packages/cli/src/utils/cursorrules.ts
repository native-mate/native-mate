import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

const CURSORRULES_BLOCK = `
# native-mate
- Import components from your components directory, not from npm
- Use \`makeStyles(theme => ({...}))\` for styles, never inline StyleSheet.create
- Use \`useTheme()\` to access design tokens inside components
- Animations: use Reanimated 4 (\`useSharedValue\`, \`useAnimatedStyle\`, \`withSpring\`, \`withTiming\`)
- Never use NativeWind or className props — this codebase uses the StyleSheet token system
- Run \`native-mate add <component>\` to add new components, never copy from npm packages
- Run \`native-mate upgrade\` to check for component updates
`.trim()

const CURSOR_MARKER_START = '# native-mate'

export function writeCursorRules(cwd: string = process.cwd()): void {
  const rulesPath = join(cwd, '.cursorrules')

  if (existsSync(rulesPath)) {
    const existing = readFileSync(rulesPath, 'utf-8')
    // Don't duplicate if already present
    if (existing.includes(CURSOR_MARKER_START)) return
    writeFileSync(rulesPath, existing.trimEnd() + '\n\n' + CURSORRULES_BLOCK + '\n', 'utf-8')
  } else {
    writeFileSync(rulesPath, CURSORRULES_BLOCK + '\n', 'utf-8')
  }
}
