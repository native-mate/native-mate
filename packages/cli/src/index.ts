#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init'
import { add } from './commands/add'
import { upgrade } from './commands/upgrade'

const program = new Command()

program
  .name('native-mate')
  .description('Add production-ready React Native components to your project')
  .version('0.1.0')

program
  .command('init')
  .description('Set up native-mate in the current project')
  .option('-p, --preset <preset>', 'Theme preset: zinc | slate | rose | midnight')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action((options) => init(options))

program
  .command('add [components...]')
  .description('Add one or more components from the registry')
  .option('-r, --registry <url>', 'Custom registry URL')
  .option('--overwrite', 'Overwrite existing component files')
  .action((components, options) => add(components, options))

program
  .command('upgrade [components...]')
  .description('Check for and apply component updates')
  .option('-r, --registry <url>', 'Custom registry URL')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action((components, options) => upgrade(components, options))

program.parse()
