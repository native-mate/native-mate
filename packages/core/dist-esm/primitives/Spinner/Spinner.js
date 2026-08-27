import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
const sizes = { sm: 16, md: 24, lg: 32 };
export const Spinner = ({ size = 'md', color }) => {
    const theme = useTheme();
    const rotation = useSharedValue(0);
    const px = sizes[size];
    const spinnerColor = color ?? theme.colors.primary;
    useEffect(() => {
        rotation.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    return (_jsx(View, { style: { width: px, height: px }, children: _jsx(Animated.View, { style: [
                animatedStyle,
                {
                    width: px,
                    height: px,
                    borderRadius: px / 2,
                    borderWidth: 2,
                    borderColor: spinnerColor,
                    borderTopColor: 'transparent',
                },
            ] }) }));
};
//# sourceMappingURL=Spinner.js.map