import { createContext, useContext } from 'react'
import { defaultStrings } from './strings'
import type { NativeMateStrings } from './strings'

export const StringsContext = createContext<NativeMateStrings>(defaultStrings)

/** Library copy for the current app. Falls back to English outside a provider. */
export function useStrings(): NativeMateStrings {
  return useContext(StringsContext)
}
