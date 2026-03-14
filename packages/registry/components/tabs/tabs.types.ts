export interface TabItem { key: string; label: string }

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}
