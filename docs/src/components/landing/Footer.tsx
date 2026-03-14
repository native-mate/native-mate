import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Docs</p>
            <ul className="space-y-2">
              {['Getting started', 'Configuration', 'Theming', 'CLI'].map((item) => (
                <li key={item}>
                  <Link href="/docs" className="text-sm text-zinc-400 hover:text-zinc-50">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Components</p>
            <ul className="space-y-2">
              {['Button', 'Input', 'Card', 'Sheet', 'All 25 →'].map((item) => (
                <li key={item}>
                  <Link href="/components" className="text-sm text-zinc-400 hover:text-zinc-50">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Tools</p>
            <ul className="space-y-2">
              {['Theme Studio', 'MCP Server', 'Figma Plugin', 'VS Code'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-50">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Community</p>
            <ul className="space-y-2">
              {['GitHub', 'Discord', 'Twitter / X', 'Contributing'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-zinc-50">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-sm font-bold text-zinc-50">native-mate</p>
          <p className="text-xs text-zinc-600">
            MIT License · Built for the React Native community
          </p>
        </div>
      </div>
    </footer>
  )
}
