import { createContext, useContext } from 'react';
import { defaultStrings } from './strings';
export const StringsContext = createContext(defaultStrings);
/** Library copy for the current app. Falls back to English outside a provider. */
export function useStrings() {
    return useContext(StringsContext);
}
//# sourceMappingURL=StringsContext.js.map