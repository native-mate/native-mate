const Platform = {
  OS: 'ios',
  select: (obj) => obj[Platform.OS] ?? obj.default,
}

module.exports = {
  Platform,
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    hairlineWidth: 0.5,
  },
  useColorScheme: () => 'dark',
  Dimensions: {
    get: () => ({ width: 390, height: 844 }),
    addEventListener: () => ({ remove: () => {} }),
  },
}
