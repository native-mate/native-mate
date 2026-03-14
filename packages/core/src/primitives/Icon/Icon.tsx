import React from 'react'
import { useTheme } from '../../theme/useTheme'
import type { IconProps } from './Icon.types'

const sizePx = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }

export const Icon: React.FC<IconProps> = ({ as: IconComponent, name, size = 'md', color, ...rest }) => {
  const theme = useTheme()
  if (!IconComponent) return null
  return <IconComponent name={name} size={sizePx[size]} color={color ?? theme.colors.foreground} {...rest} />
}
