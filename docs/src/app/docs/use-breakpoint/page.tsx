import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'useBreakpoint — native-mate' }

export default function UseBreakpointPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">useBreakpoint</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Returns the current responsive breakpoint based on screen width. Useful for adapting layouts
        on tablets and larger screens.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Breakpoints</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800 mb-8">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Breakpoint</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Min width</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Typical device</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['"sm"', '0px', 'Phone (default)'],
              ['"md"', '768px', 'Large phone / small tablet'],
              ['"lg"', '1024px', 'Tablet / iPad Pro'],
            ].map(([bp, w, device], i) => (
              <tr key={bp} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{bp}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{w}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="tsx" code={`import { useBreakpoint } from '@native-mate/core'

function ProductGrid() {
  const bp = useBreakpoint()

  const columns = bp === 'lg' ? 4 : bp === 'md' ? 3 : 2

  return (
    <FlatList
      numColumns={columns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard item={item} />}
    />
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Conditional styles</h2>
      <CodeBlock language="tsx" code={`function ResponsiveContainer({ children }) {
  const bp = useBreakpoint()
  const isTablet = bp !== 'sm'

  return (
    <View style={{
      maxWidth: isTablet ? 600 : undefined,
      alignSelf: isTablet ? 'center' : 'stretch',
      padding: isTablet ? 24 : 16,
    }}>
      {children}
    </View>
  )
}`} />
    </article>
  )
}
