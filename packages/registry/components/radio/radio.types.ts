export interface RadioProps {
  selected: boolean
  onSelect: () => void
  label?: string
  disabled?: boolean
  accessibilityLabel?: string
}

export interface RadioGroupProps {
  options: Array<{ label: string; value: string }>
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}
