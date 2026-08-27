import { jsx as _jsx } from "react/jsx-runtime";
import { Text as RNText } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontStyle, textLineHeight } from '../../tokens';
const variantMap = {
    body: { sizeKey: 'md', weightKey: 'regular' },
    label: { sizeKey: 'sm', weightKey: 'medium' },
    caption: { sizeKey: 'xs', weightKey: 'regular' },
    heading: { sizeKey: 'xl', weightKey: 'bold' },
    title: { sizeKey: '2xl', weightKey: 'bold' },
    display: { sizeKey: '3xl', weightKey: 'bold' },
};
export const Text = ({ variant = 'body', size, weight, color, muted = false, style, children, ...rest }) => {
    const theme = useTheme();
    const { sizeKey, weightKey } = variantMap[variant];
    return (_jsx(RNText, { style: [
            {
                color: color ?? (muted ? theme.colors.muted : theme.colors.foreground),
                fontSize: theme.typography.size[size ?? sizeKey],
                ...fontStyle(theme.typography, weight ?? weightKey),
                lineHeight: textLineHeight(theme.typography, theme.typography.size[size ?? sizeKey]),
            },
            style,
        ], ...rest, children: children }));
};
//# sourceMappingURL=Text.js.map