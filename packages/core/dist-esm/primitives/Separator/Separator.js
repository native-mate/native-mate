import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
export const Separator = ({ orientation = 'horizontal', style }) => {
    const theme = useTheme();
    return (_jsx(View, { accessible: false, style: [
            {
                backgroundColor: theme.colors.border,
                ...(orientation === 'horizontal'
                    ? { height: 1, width: '100%' }
                    : { width: 1, height: '100%' }),
            },
            style,
        ] }));
};
//# sourceMappingURL=Separator.js.map