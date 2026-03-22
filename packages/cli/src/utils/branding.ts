import pc from 'picocolors'

const LOGO = `
  ╔╗╔┌─┐┌┬┐┬┬  ┬┌─┐  ╔╦╗┌─┐┌┬┐┌─┐
  ║║║├─┤ │ │└┐┌┘├┤   ║║║├─┤ │ ├┤
  ╝╚╝┴ ┴ ┴ ┴ └┘ └─┘  ╩ ╩┴ ┴ ┴ └─┘`

export function printBranding() {
  console.log(pc.cyan(LOGO))
  console.log(pc.dim('  Production-ready UI components for React Native\n'))
}
