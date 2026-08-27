import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Internationalization — native-mate' }

export default function I18nPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Internationalization</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Every user-facing string the registry renders comes from one small dictionary. Components
        read it through <code className="text-zinc-300">useStrings()</code>, so an app can translate
        the library without patching a single component file.
      </p>

      <div className="mb-8 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Note:</strong> only English ships. No other locale data is bundled — apps that need
        more pass their own through the <code className="text-amber-200">strings</code> prop, since
        they already have an i18n library and a translation pipeline.
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Translating the library</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">ThemeProvider</code> takes a{' '}
        <code className="text-zinc-300">Partial&lt;NativeMateStrings&gt;</code> and merges it over
        the English defaults. Pass only the keys you want to change:
      </p>
      <CodeBlock language="tsx" code={`import { ThemeProvider } from '@native-mate/core'

const es = {
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  clear: 'Borrar',
  close: 'Cerrar',
  done: 'Listo',
  retry: 'Reintentar',
  resend: 'Reenviar',
  resendPrompt: '¿No recibiste el código?',
  resendIn: (seconds: number) => \`Reenviar en \${seconds}s\`,
  search: 'Buscar',
  today: 'Hoy',
  monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
}

export function App() {
  return (
    <ThemeProvider preset="zinc" strings={es}>
      <RootNavigator />
    </ThemeProvider>
  )
}`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        If your app already has an i18n library, build the object from it — the slot is a plain
        object, so nothing stops you from wiring it to whatever the user's current locale is:
      </p>
      <CodeBlock language="tsx" code={`const { t } = useTranslation()

<ThemeProvider
  strings={{
    cancel: t('common.cancel'),
    confirm: t('common.confirm'),
    resendIn: (seconds) => t('otp.resendIn', { seconds }),
  }}
>
  <RootNavigator />
</ThemeProvider>`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Reading strings in your own components</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">useStrings()</code> returns the fully-merged{' '}
        <code className="text-zinc-300">NativeMateStrings</code>. Outside a provider it falls back
        to English, so it never throws:
      </p>
      <CodeBlock language="tsx" code={`import { useStrings } from '@native-mate/core'

function ClearButton({ onPress }: { onPress: () => void }) {
  const strings = useStrings()

  return (
    <Pressable onPress={onPress} accessibilityLabel={strings.clear}>
      <Text>{strings.clear}</Text>
    </Pressable>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Override precedence</h2>
      <div className="mb-3 space-y-3 text-sm text-zinc-400">
        <p>
          Most components that render one of these strings also take a local prop for it. The order
          is always the same:
        </p>
        <p className="text-zinc-300">
          component prop → <code>strings</code> slot → English default
        </p>
        <p>
          So <code className="text-zinc-300">&lt;Dialog cancelLabel="Not now" /&gt;</code> wins over
          a translated <code className="text-zinc-300">cancel</code>, which in turn wins over{' '}
          <code className="text-zinc-300">&quot;Cancel&quot;</code>. The prop is for one-off
          wording; the slot is for translating the whole app.
        </p>
      </div>
      <CodeBlock language="tsx" code={`// strings.cancel = 'Cancelar'

<Dialog {...props} />                      // → "Cancelar"
<Dialog {...props} cancelLabel="Ahora no" /> // → "Ahora no"`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">The full dictionary</h2>
      <p className="mb-3 text-sm text-zinc-400">
        These are all the keys in <code className="text-zinc-300">NativeMateStrings</code>. Most are
        plain strings; <code className="text-zinc-300">resendIn</code> is a function so the number
        can be placed correctly for the language, and three keys are arrays used by the date picker.
      </p>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Key</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">English default</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['cancel', 'string', 'Cancel'],
              ['confirm', 'string', 'Confirm'],
              ['clear', 'string', 'Clear'],
              ['close', 'string', 'Close'],
              ['done', 'string', 'Done'],
              ['dismiss', 'string', 'Dismiss'],
              ['retry', 'string', 'Retry'],
              ['resend', 'string', 'Resend'],
              ['resendPrompt', 'string', "Didn't receive the code?"],
              ['resendIn', '(seconds: number) => string', 'Resend in {n}s'],
              ['loadingMore', 'string', 'Loading more…'],
              ['empty', 'string', 'No items yet'],
              ['emptyBody', 'string', 'Check back later.'],
              ['readMore', 'string', 'Read more'],
              ['readLess', 'string', 'Read less'],
              ['search', 'string', 'Search'],
              ['selectAll', 'string', 'Select all'],
              ['outOfStock', 'string', 'Out of Stock'],
              ['showPassword', 'string', 'Show password'],
              ['hidePassword', 'string', 'Hide password'],
              ['verificationCode', 'string', 'Verification code'],
              ['today', 'string', 'Today'],
              ['months', 'string[]', 'January … December'],
              ['monthsShort', 'string[]', 'Jan … Dec'],
              ['weekdaysShort', 'string[]', 'Sun … Sat'],
            ].map(([key, type, value], i) => (
              <tr key={key} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{key}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{type}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">defaultStrings and mergeStrings</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Both are exported. <code className="text-zinc-300">defaultStrings</code> is the English
        dictionary itself — useful as a checklist of keys, or as a base to spread from.{' '}
        <code className="text-zinc-300">mergeStrings(overrides?)</code> is what ThemeProvider calls
        internally: a shallow merge over the defaults, returning{' '}
        <code className="text-zinc-300">defaultStrings</code> untouched when nothing is passed.
      </p>
      <CodeBlock language="ts" code={`import { defaultStrings, mergeStrings } from '@native-mate/core'
import type { NativeMateStrings } from '@native-mate/core'

const fr: NativeMateStrings = mergeStrings({
  cancel: 'Annuler',
  confirm: 'Confirmer',
})

fr.cancel   // 'Annuler'
fr.retry    // 'Retry' — untouched English default`} />
      <p className="mt-3 text-sm text-zinc-400">
        The merge is shallow, so array keys such as{' '}
        <code className="text-zinc-300">months</code> replace the default array wholesale — pass all
        twelve entries, not a partial list.
      </p>
    </article>
  )
}
