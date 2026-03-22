import * as p from '@clack/prompts'
import pc from 'picocolors'
import { configExists, writeConfig } from '../utils/config'
import { detectPackageManager, runInstall } from '../utils/detect-pm'
import { writeCursorRules } from '../utils/cursorrules'
import { printBranding } from '../utils/branding'

const PRESETS = [
  { value: 'zinc', label: 'Zinc', hint: 'clean, neutral grays (recommended)' },
  { value: 'slate', label: 'Slate', hint: 'cool blue-gray tones' },
  { value: 'rose', label: 'Rose', hint: 'warm rose accents' },
  { value: 'midnight', label: 'Midnight', hint: 'deep dark-mode first' },
] as const

export async function init(options: { preset?: string; yes?: boolean }) {
  printBranding()
  p.intro(pc.bgCyan(pc.black(' native-mate init ')))

  if (configExists()) {
    p.log.warn('native-mate.json already exists. Use ' + pc.cyan('native-mate add') + ' to install components.')
    p.outro('Nothing to do.')
    return
  }

  let preset = options.preset as 'zinc' | 'slate' | 'rose' | 'midnight' | undefined
  let componentsDir = 'components/ui'

  if (!options.yes) {
    const result = await p.group(
      {
        preset: () =>
          preset
            ? Promise.resolve(preset)
            : p.select({
                message: 'Which theme preset?',
                options: PRESETS.map((pr) => ({
                  value: pr.value,
                  label: pr.label,
                  hint: pr.hint,
                })),
                initialValue: 'zinc' as string,
              }),
        componentsDir: () =>
          p.text({
            message: 'Where should components be installed?',
            placeholder: 'components/ui',
            defaultValue: 'components/ui',
          }),
      },
      {
        onCancel: () => {
          p.cancel('Init cancelled.')
          process.exit(0)
        },
      }
    )

    preset = result.preset as 'zinc' | 'slate' | 'rose' | 'midnight'
    componentsDir = (result.componentsDir as string) || 'components/ui'
  } else {
    preset = preset ?? 'zinc'
  }

  writeConfig({ preset, componentsDir })

  const s = p.spinner()
  s.start('Installing @native-mate/core')
  try {
    const pm = detectPackageManager()
    runInstall(pm, ['@native-mate/core'])
    s.stop(pc.green('@native-mate/core installed'))
  } catch {
    s.stop(pc.red('Failed to install @native-mate/core — install it manually'))
  }

  writeCursorRules()

  p.log.success('native-mate.json created')
  p.log.success('.cursorrules updated')

  p.outro(
    'Run ' + pc.cyan('native-mate add button') + ' to add your first component.'
  )
}
