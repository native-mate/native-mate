export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070709]">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-white">404</h1>
        <p className="mt-3 text-zinc-400">This page could not be found.</p>
        <a
          href="/"
          className="mt-6 inline-block text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors"
        >
          &larr; Back to home
        </a>
      </div>
    </div>
  )
}
