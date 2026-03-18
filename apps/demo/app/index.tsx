import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

const components = [
  { name: 'button', label: 'Button', category: 'Forms' },
  { name: 'input', label: 'Input', category: 'Forms' },
  { name: 'textarea', label: 'Textarea', category: 'Forms' },
  { name: 'checkbox', label: 'Checkbox', category: 'Forms' },
  { name: 'radio', label: 'Radio', category: 'Forms' },
  { name: 'switch', label: 'Switch', category: 'Forms' },
  { name: 'slider', label: 'Slider', category: 'Forms' },
  { name: 'select', label: 'Select', category: 'Forms' },
  { name: 'otp-input', label: 'OTP Input', category: 'Forms' },
  { name: 'badge', label: 'Badge', category: 'Display' },
  { name: 'avatar', label: 'Avatar', category: 'Display' },
  { name: 'tag', label: 'Tag', category: 'Display' },
  { name: 'progress', label: 'Progress', category: 'Display' },
  { name: 'skeleton', label: 'Skeleton', category: 'Display' },
  { name: 'alert', label: 'Alert', category: 'Display' },
  { name: 'card', label: 'Card', category: 'Display' },
  { name: 'tabs', label: 'Tabs', category: 'Display' },
  { name: 'accordion', label: 'Accordion', category: 'Display' },
  { name: 'empty-state', label: 'Empty State', category: 'Display' },
  { name: 'sheet', label: 'Sheet', category: 'Overlay' },
  { name: 'modal', label: 'Modal', category: 'Overlay' },
  { name: 'action-sheet', label: 'Action Sheet', category: 'Overlay' },
  { name: 'toast', label: 'Toast', category: 'Overlay' },
  { name: 'tooltip', label: 'Tooltip', category: 'Overlay' },
]

const categories = ['Forms', 'Display', 'Overlay']

export default function Gallery() {
  const router = useRouter()

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.hero}>Component Gallery</Text>
      <Text style={s.sub}>25 components — tap to preview</Text>

      {categories.map((cat) => (
        <View key={cat} style={s.section}>
          <Text style={s.catLabel}>{cat}</Text>
          <View style={s.grid}>
            {components
              .filter((c) => c.category === cat)
              .map((c) => (
                <Pressable
                  key={c.name}
                  style={({ pressed }) => [s.card, pressed && s.cardPressed]}
                  onPress={() => router.push(`/preview/${c.name}`)}
                >
                  <Text style={s.cardText}>{c.label}</Text>
                </Pressable>
              ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 20, paddingBottom: 60 },
  hero: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 },
  sub: { color: '#71717a', fontSize: 14, marginTop: 4, marginBottom: 24 },
  section: { marginBottom: 24 },
  catLabel: { color: '#a1a1aa', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: '47%',
    flexGrow: 1,
  },
  cardPressed: { backgroundColor: '#27272a' },
  cardText: { color: '#fafafa', fontSize: 15, fontWeight: '500' },
})
