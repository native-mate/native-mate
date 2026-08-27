import { createContext } from 'react';
import { resolveTokens, zinc } from '../tokens';
export const defaultTheme = resolveTokens(zinc, 'light');
export const ThemeContext = createContext(defaultTheme);
//# sourceMappingURL=ThemeContext.js.map