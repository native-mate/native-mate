import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Header } from '../components/ui/header'
import { BottomBar } from '../components/ui/bottom-bar'
import { FAB } from '../components/ui/fab'
import { SearchBar } from '../components/ui/search-bar'
import { Breadcrumb } from '../components/ui/breadcrumb'
import { Stepper } from '../components/ui/stepper'

export default function NavigationShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [fabOpen, setFabOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const breadcrumbItems = [
    { label: 'Home', onPress: () => {} },
    { label: 'Category', onPress: () => {} },
    { label: 'Item' },
  ]

  const steps = [
    { label: 'Cart' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Review' },
  ]

  const bottomBarItems = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
    { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart', badge: 3 },
    { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ]

  const fabActions = [
    { icon: 'camera-outline', label: 'Photo', onPress: () => {} },
    { icon: 'document-outline', label: 'Document', onPress: () => {} },
    { icon: 'location-outline', label: 'Location', onPress: () => {} },
  ]

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <Header
          title="Explore"
          leftAction={{
            icon: 'arrow-back',
            onPress: () => router.back(),
          }}
          rightActions={[
            { icon: 'notifications-outline', onPress: () => {} },
            { icon: 'settings-outline', onPress: () => {} },
          ]}
        />

        <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="h3">Navigation</Text>
              <Text variant="caption" color="muted">Header, bottom-bar, FAB, search, stepper</Text>
            </View>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Icon name="arrow-back" size={16} />}
              onPress={() => router.back()}
            >
              Back
            </Button>
          </View>

          {/* Search Bar */}
          <Card>
            <CardHeader title="Search Bar" subtitle="Search with auto-clear and placeholder" />
            <CardContent>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search products, categories..."
                onClear={() => setSearchQuery('')}
              />
            </CardContent>
          </Card>

          {/* Breadcrumb */}
          <Card>
            <CardHeader title="Breadcrumb" subtitle="Navigation trail for nested content" />
            <CardContent>
              <Breadcrumb items={breadcrumbItems} />
            </CardContent>
          </Card>

          {/* Stepper */}
          <Card>
            <CardHeader title="Stepper" subtitle="Multi-step checkout flow" />
            <CardContent>
              <View style={{ gap: 16 }}>
                <Stepper
                  steps={steps}
                  activeStep={activeStep}
                />
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => setActiveStep(Math.min(3, activeStep + 1))}
                    disabled={activeStep === 3}
                  >
                    Next
                  </Button>
                </View>
                <Text variant="caption" color="muted" align="center">
                  Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Header showcase */}
          <Card>
            <CardHeader title="Header Component" subtitle="Shown at the top of this screen" />
            <CardContent>
              <Text variant="bodySmall" color="muted">
                The Header above demonstrates a title with a back button on the left and notification + settings action icons on the right. It automatically adapts to theme colors and safe area insets.
              </Text>
            </CardContent>
          </Card>

          {/* FAB info */}
          <Card>
            <CardHeader title="Floating Action Button" subtitle="Bottom-right with speed-dial" />
            <CardContent>
              <Text variant="bodySmall" color="muted">
                Look at the bottom-right corner for the FAB. Tap it to reveal speed-dial actions for Photo, Document, and Location. The FAB floats above the Bottom Bar.
              </Text>
            </CardContent>
          </Card>

          {/* Bottom Bar info */}
          <Card>
            <CardHeader title="Bottom Bar" subtitle="Tab navigation with badge" />
            <CardContent>
              <Text variant="bodySmall" color="muted">
                The Bottom Bar at the bottom of the screen shows four tabs: Home, Search, Cart (with a badge count of 3), and Profile. Tap tabs to switch the active state.
              </Text>
            </CardContent>
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* FAB */}
        <FAB
          icon={fabOpen ? 'close' : 'add'}
          onPress={() => setFabOpen(!fabOpen)}
          actions={fabActions}
          open={fabOpen}
          style={{ position: 'absolute', right: 20, bottom: 80 }}
        />

        {/* Bottom Bar */}
        <BottomBar
          items={bottomBarItems}
          activeKey={activeTab}
          onTabPress={(key) => setActiveTab(key)}
        />
      </KeyboardAvoidingView>
    </Screen>
  )
}
