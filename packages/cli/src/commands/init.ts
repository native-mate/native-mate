import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import { configExists, writeConfig } from '../utils/config'
import { detectPackageManager, runInstall } from '../utils/detect-pm'
import { writeCursorRules } from '../utils/cursorrules'

export async function init(options: { preset?: string; yes?: boolean }) {
  console.log(chalk.bold('\nnative-mate init\n'))

  if (configExists()) {
    console.log(chalk.yellow('native-mate.json already exists. Use `native-mate add` to install components.'))
    process.exit(0)
  }

  let preset = options.preset as 'zinc' | 'slate' | 'rose' | 'midnight' | undefined
  let componentsDir = 'components/ui'

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'preset',
        message: 'Which theme preset?',
        choices: [
          { name: 'Zinc   — clean, neutral grays (recommended)', value: 'zinc' },
          { name: 'Slate  — cool blue-gray tones', value: 'slate' },
          { name: 'Rose   — warm rose accents', value: 'rose' },
          { name: 'Midnight — deep dark-mode first', value: 'midnight' },
        ],
        default: preset ?? 'zinc',
        when: !preset,
      },
      {
        type: 'input',
        name: 'componentsDir',
        message: 'Where should components be installed?',
        default: componentsDir,
      },
    ])

    preset = (answers.preset ?? preset) as 'zinc' | 'slate' | 'rose' | 'midnight'
    componentsDir = answers.componentsDir ?? componentsDir
  } else {
    preset = preset ?? 'zinc'
  }

  writeConfig({ preset, componentsDir })

  const spinner = ora('Installing @native-mate/core…').start()
  try {
    const pm = detectPackageManager()
    runInstall(pm, ['@native-mate/core'])
    spinner.succeed(chalk.green('@native-mate/core installed'))
  } catch {
    spinner.fail('Failed to install @native-mate/core. Install it manually.')
  }

  writeCursorRules()

  console.log()
  console.log(chalk.green('✓') + ' native-mate.json created')
  console.log(chalk.green('✓') + ' .cursorrules updated')
  console.log()
  console.log('Run ' + chalk.cyan('native-mate add button') + ' to add your first component.')
  console.log()
}
