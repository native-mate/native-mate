export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning'

export interface AlertProps {
  variant?: AlertVariant
  title: string
  description?: string
  children?: React.ReactNode
}
