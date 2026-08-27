import { useWindowDimensions } from 'react-native';
export function useBreakpoint() {
    const { width } = useWindowDimensions();
    if (width >= 1024)
        return 'lg';
    if (width >= 768)
        return 'md';
    return 'sm';
}
//# sourceMappingURL=useBreakpoint.js.map