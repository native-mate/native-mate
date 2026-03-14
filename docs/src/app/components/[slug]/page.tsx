import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { CodeBlock } from '@/components/CodeBlock'
import Link from 'next/link'

interface ComponentDoc {
  name: string
  slug: string
  description: string
  category: string
  npmDeps: string[]
  componentDeps: string[]
  props: Array<{ name: string; type: string; default?: string; description: string }>
  addCommand: string
  usageCode: string
  exampleCode: string
}

const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    name: 'Button',
    slug: 'button',
    description: 'A pressable button with multiple variants, loading state, optional icon support, and spring animations on press.',
    category: 'Primitives',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add button',
    props: [
      { name: 'variant', type: '"default" | "outline" | "ghost" | "destructive"', default: '"default"', description: 'Visual style of the button.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls height and padding.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows an ActivityIndicator and disables press.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
      { name: 'leftIcon', type: 'React.ReactNode', description: 'Element rendered before the label.' },
      { name: 'rightIcon', type: 'React.ReactNode', description: 'Element rendered after the label.' },
      { name: 'onPress', type: '() => void', description: 'Press handler.' },
    ],
    usageCode: `import { Button } from '~/components/ui/button'

// Default
<Button onPress={handleSubmit}>Submit</Button>

// Outline variant
<Button variant="outline" onPress={handleCancel}>Cancel</Button>

// Loading state
<Button loading onPress={handleSave}>Save</Button>

// Small destructive
<Button variant="destructive" size="sm" onPress={handleDelete}>Delete</Button>`,
    exampleCode: `import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function ButtonExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button loading>Loading…</Button>
      <Button disabled>Disabled</Button>
    </View>
  )
}`,
  },
  card: {
    name: 'Card',
    slug: 'card',
    description: 'A surface container with optional header, content, and footer slots. Supports shadows via the platform utility.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add card',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'Card content. Use CardHeader, CardContent, CardFooter sub-components.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles for the card container.' },
    ],
    usageCode: `import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Text } from '@native-mate/core'

<Card>
  <CardHeader>
    <Text weight="semibold" size="lg">Card Title</Text>
    <Text color="muted">Card subtitle</Text>
  </CardHeader>
  <CardContent>
    <Text>Your content here.</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>`,
    exampleCode: `import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'

export function CardExample() {
  return (
    <Card style={{ margin: 16 }}>
      <CardHeader>
        <Text weight="semibold" size="lg">Invitation</Text>
        <Text color="muted">You have been invited to join Acme Corp</Text>
      </CardHeader>
      <CardContent>
        <Text>Accept the invitation to start collaborating with your team.</Text>
      </CardContent>
      <CardFooter>
        <Button variant="outline" style={{ flex: 1 }}>Decline</Button>
        <Button style={{ flex: 1 }}>Accept</Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  input: {
    name: 'Input',
    slug: 'input',
    description: 'A text input with label, error message, prefix/suffix slots, and animated focus ring.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add input',
    props: [
      { name: 'label', type: 'string', description: 'Label shown above the input.' },
      { name: 'error', type: 'string', description: 'Error message shown below. Turns border red.' },
      { name: 'hint', type: 'string', description: 'Helper text shown below the input.' },
      { name: 'prefix', type: 'React.ReactNode', description: 'Element rendered before the text field.' },
      { name: 'suffix', type: 'React.ReactNode', description: 'Element rendered after the text field.' },
      { name: '...TextInputProps', type: 'TextInputProps', description: 'All standard RN TextInput props are forwarded.' },
    ],
    usageCode: `import { Input } from '~/components/ui/input'

// Basic
<Input label="Email" placeholder="you@example.com" />

// With error
<Input
  label="Password"
  secureTextEntry
  error="Password must be at least 8 characters"
/>

// With hint
<Input
  label="Username"
  hint="Only letters, numbers, and underscores"
  autoCapitalize="none"
/>`,
    exampleCode: `import { Input } from '~/components/ui/input'
import { View } from 'react-native'

export function InputExamples() {
  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Input label="Email" placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" secureTextEntry placeholder="••••••••" />
      <Input label="Bio" hint="Up to 160 characters" multiline />
      <Input label="Username" error="This username is taken" />
    </View>
  )
}`,
  },
  badge: {
    name: 'Badge',
    slug: 'badge',
    description: 'A compact inline label with semantic variants and an optional dot indicator.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add badge',
    props: [
      { name: 'variant', type: '"default" | "secondary" | "outline" | "success" | "destructive"', default: '"default"', description: 'Visual variant.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a coloured dot before the label.' },
      { name: 'children', type: 'string', description: 'Badge label text.' },
    ],
    usageCode: `import { Badge } from '~/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="destructive">Error</Badge>`,
    exampleCode: `import { Badge } from '~/components/ui/badge'
import { View } from 'react-native'

export function BadgeExamples() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="destructive" dot>Failed</Badge>
    </View>
  )
}`,
  },
  sheet: {
    name: 'Sheet',
    slug: 'sheet',
    description: 'A bottom sheet with configurable snap points, drag handle, backdrop dismiss, and smooth Reanimated spring animation.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add sheet',
    props: [
      { name: 'isOpen', type: 'boolean', description: 'Controls sheet visibility.' },
      { name: 'onClose', type: '() => void', description: 'Called when user dismisses the sheet.' },
      { name: 'snapPoints', type: 'Array<`${number}%`>', default: '["50%", "90%"]', description: 'Snap positions as viewport-height percentages.' },
      { name: 'children', type: 'React.ReactNode', description: 'Sheet content.' },
    ],
    usageCode: `import { Sheet } from '~/components/ui/sheet'

const [open, setOpen] = useState(false)

<Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['40%', '80%']}>
  <View style={{ padding: 16 }}>
    <Text>Sheet content</Text>
  </View>
</Sheet>`,
    exampleCode: `import { useState } from 'react'
import { Sheet } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function SheetExample() {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ padding: 16 }}>
      <Button onPress={() => setOpen(true)}>Open Sheet</Button>
      <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['50%']}>
        <View style={{ padding: 24, gap: 16 }}>
          <Text size="lg" weight="semibold">Sheet title</Text>
          <Text color="muted">Some content inside the sheet.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Sheet>
    </View>
  )
}`,
  },
}

// Generate static params for known components
export function generateStaticParams() {
  return Object.keys(COMPONENT_DOCS).map((slug) => ({ slug }))
}

export default function ComponentPage({ params }: { params: { slug: string } }) {
  const doc = COMPONENT_DOCS[params.slug]
  if (!doc) notFound()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/components" className="hover:text-zinc-300">Components</Link>
          <span>/</span>
          <span className="text-zinc-300">{doc.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{doc.name}</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {doc.category}
            </span>
          </div>
          <p className="text-zinc-400">{doc.description}</p>
        </div>

        {/* Install */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Installation</h2>
          <CodeBlock language="bash" code={doc.addCommand} />
          {(doc.npmDeps.length > 0 || doc.componentDeps.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
              {doc.npmDeps.length > 0 && <span>npm deps: {doc.npmDeps.join(', ')}</span>}
              {doc.componentDeps.length > 0 && <span>component deps: {doc.componentDeps.join(', ')}</span>}
            </div>
          )}
        </section>

        {/* Usage */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Usage</h2>
          <CodeBlock language="tsx" code={doc.usageCode} />
        </section>

        {/* Props */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Props</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900">
                <tr>
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doc.props.map((prop, i) => (
                  <tr key={prop.name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{prop.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-amber-400">{prop.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{prop.default ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Example */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Example</h2>
          <CodeBlock language="tsx" code={doc.exampleCode} />
        </section>
      </main>
    </div>
  )
}
