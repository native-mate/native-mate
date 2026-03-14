import type { Meta, StoryObj } from '@storybook/react-native'
import { Accordion } from '../../../packages/registry/components/accordion/accordion'

const ITEMS = [
  { key: 'a', title: 'What is native-mate?', content: 'A copy-paste component library for React Native built on the New Architecture.' },
  { key: 'b', title: 'Does it work with Expo?', content: 'Yes — fully compatible with Expo SDK 51 and above.' },
  { key: 'c', title: 'Can I customise the tokens?', content: 'Absolutely. Add a tokens field to native-mate.json to override any colour.' },
]

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  args: { items: ITEMS, allowMultiple: false },
  argTypes: {
    allowMultiple: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}
export const MultiOpen: Story = { args: { allowMultiple: true } }
