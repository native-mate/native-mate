import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from '../../theme/useTheme';
const sizePx = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 };
export const Icon = ({ as: IconComponent, name, size = 'md', color, ...rest }) => {
    const theme = useTheme();
    if (!IconComponent)
        return null;
    return _jsx(IconComponent, { name: name, size: sizePx[size], color: color ?? theme.colors.foreground, ...rest });
};
//# sourceMappingURL=Icon.js.map