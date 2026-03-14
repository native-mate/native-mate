export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}
