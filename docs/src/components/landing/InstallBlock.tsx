'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CodeBlock } from '../CodeBlock'

const steps = [
  {
    n: '01',
    title: 'Initialize',
    description: 'Sets up native-mate.json, installs @native-mate/core, and configures your AI editor rules.',
    code: 'npx native-mate init',
    lang: 'bash',
  },
  {
    n: '02',
    title: 'Add components',
    description: 'Fetches component source, resolves dependencies, and writes it directly to your project.',
    code: 'npx native-mate add button card input badge avatar',
    lang: 'bash',
  },
  {
    n: '03',
    title: 'Import and ship',
    description: 'The code is yours. Import from your components directory, fork anything you need.',
    code: `import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardContent } from '~/components/ui/card'

export function MyScreen() {
  return (
    <Card variant="elevated">
      <CardHeader title="Welcome" subtitle="Get building" />
      <CardContent>
        <Button onPress={() => {}}>Let's go</Button>
      </CardContent>
    </Card>
  )
}`,
    lang: 'tsx',
  },
]

const stepVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export function InstallBlock() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-4 sm:px-5 py-16 sm:py-28">
      <div className="section-divider mb-0" />

      <div className="mx-auto max-w-3xl pt-14 sm:pt-28" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-[0.2em] mb-4">Quick start</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
            Up in
            <span className="gradient-text"> three steps</span>
          </h2>
          <p className="text-zinc-500 leading-relaxed">
            From zero to production components in under 60 seconds.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent hidden sm:block" />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                custom={i}
                variants={stepVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="flex gap-6 sm:gap-8"
              >
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div className="relative w-9 h-9 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono">{s.n}</span>
                  </div>
                </div>

                <div className="flex-1 pb-2">
                  <h3 className="font-semibold text-zinc-100 mb-1">{s.title}</h3>
                  <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{s.description}</p>
                  <CodeBlock code={s.code} language={s.lang} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
