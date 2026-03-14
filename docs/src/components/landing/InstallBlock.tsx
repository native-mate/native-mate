import { CodeBlock } from '../CodeBlock'

const steps = [
  {
    step: '01',
    title: 'Run init',
    description: 'Sets up native-mate.json, installs @native-mate/core, and updates .cursorrules.',
    code: 'npx native-mate init',
    language: 'bash',
  },
  {
    step: '02',
    title: 'Add components',
    description: 'Fetches the component source, resolves dependencies, and writes it to your project.',
    code: 'npx native-mate add button card input badge',
    language: 'bash',
  },
  {
    step: '03',
    title: 'Use it',
    description: 'Import directly from your components directory. Fork anything you need.',
    code: `import { Button } from '~/components/ui/button'

export function MyScreen() {
  return (
    <Button variant="default" onPress={() => {}}>
      Get started
    </Button>
  )
}`,
    language: 'tsx',
  },
]

export function InstallBlock() {
  return (
    <section className="border-t border-zinc-800 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-zinc-50">
          Up in three steps
        </h2>
        <p className="mb-12 text-center text-zinc-400">
          From zero to production components in under 60 seconds.
        </p>

        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-6">
              <div className="flex-shrink-0 pt-1">
                <span className="text-xs font-mono font-bold text-zinc-600">{s.step}</span>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-zinc-50">{s.title}</h3>
                <p className="mb-3 text-sm text-zinc-400">{s.description}</p>
                <CodeBlock code={s.code} language={s.language} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
