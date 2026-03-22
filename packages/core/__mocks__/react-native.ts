export const Platform = {
  OS: 'ios' as string,
  select: (obj: any) => obj[Platform.OS] ?? obj.default,
}

export const StyleSheet = {
  create: (styles: any) => styles,
  flatten: (style: any) => style,
  hairlineWidth: 0.5,
}

export const useColorScheme = () => 'dark'

export const Dimensions = {
  get: () => ({ width: 390, height: 844 }),
  addEventListener: () => ({ remove: () => {} }),
}
