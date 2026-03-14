import { Platform } from 'react-native'

export function shadow(level: 1 | 2 | 3 | 4 = 1) {
  const config = {
    1: { opacity: 0.06, radius: 4,  offsetY: 1, elevation: 2 },
    2: { opacity: 0.10, radius: 8,  offsetY: 2, elevation: 4 },
    3: { opacity: 0.14, radius: 16, offsetY: 4, elevation: 8 },
    4: { opacity: 0.18, radius: 24, offsetY: 8, elevation: 12 },
  }[level]

  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOpacity: config.opacity,
      shadowRadius: config.radius,
      shadowOffset: { width: 0, height: config.offsetY },
    }
  }
  return { elevation: config.elevation }
}
