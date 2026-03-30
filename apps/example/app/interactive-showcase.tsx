import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'
import { DraggableList } from '../components/ui/draggable-list'
import { BottomSheetList } from '../components/ui/bottom-sheet-list'
import { SegmentedControl } from '../components/ui/segmented-control'
import { Stepper } from '../components/ui/stepper'
import { Countdown } from '../components/ui/countdown'

const stepperSteps = [
  { key: 'select', label: 'Select', icon: <Icon name="checkmark-circle-outline" size={18} /> },
  { key: 'customize', label: 'Customize', icon: <Icon name="color-palette-outline" size={18} /> },
  { key: 'confirm', label: 'Confirm', icon: <Icon name="shield-checkmark-outline" size={18} /> },
]

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
  { label: 'India', value: 'in' },
  { label: 'South Korea', value: 'kr' },
]

const initialTasks = [
  { key: '1', label: 'Design system review', priority: 'High' },
  { key: '2', label: 'API integration tests', priority: 'Medium' },
  { key: '3', label: 'Update documentation', priority: 'Low' },
  { key: '4', label: 'Performance audit', priority: 'High' },
  { key: '5', label: 'Accessibility check', priority: 'Medium' },
]

const segmentOptions = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
]

export default function InteractiveShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [sheetVisible, setSheetVisible] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [tasks, setTasks] = useState(initialTasks)
  const [segment, setSegment] = useState('all')

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(value)
    setSheetVisible(false)
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return theme.colors.error
      case 'Medium': return theme.colors.warning
      case 'Low': return theme.colors.success
      default: return theme.colors.muted
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Interactive</Text>
              <Text variant="caption" color="muted">Drag, tap, and explore</Text>
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

          {/* Stepper */}
          <View style={{ gap: 8 }}>
            <Text variant="h5">Setup Wizard</Text>
            <Stepper
              steps={stepperSteps}
              activeStep={activeStep}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setActiveStep((s) => Math.max(0, s - 1))}
                disabled={activeStep === 0}
                style={{ flex: 1 }}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onPress={() => setActiveStep((s) => Math.min(stepperSteps.length - 1, s + 1))}
                disabled={activeStep === stepperSteps.length - 1}
                style={{ flex: 1 }}
              >
                Next
              </Button>
            </View>
          </View>

          {/* BottomSheetList */}
          <View style={{ gap: 8 }}>
            <Text variant="h5">Country Selector</Text>
            <Text variant="bodySmall" color="muted">
              {selectedCountry
                ? `Selected: ${countries.find((c) => c.value === selectedCountry)?.label}`
                : 'No country selected'}
            </Text>
            <Button
              variant="outline"
              onPress={() => setSheetVisible(true)}
              iconLeft={<Icon name="globe-outline" size={18} />}
            >
              Choose Country
            </Button>
          </View>

          <BottomSheetList
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            items={countries}
            onSelect={handleCountrySelect}
            selected={selectedCountry}
            searchable
            title="Select Country"
            searchPlaceholder="Search countries..."
          />

          {/* Segmented Control */}
          <View style={{ gap: 8 }}>
            <Text variant="h5">Filter</Text>
            <SegmentedControl
              options={segmentOptions}
              value={segment}
              onChange={setSegment}
            />
          </View>

          <Separator label="Reorder" />

          {/* Draggable List */}
          <DraggableList
            items={tasks}
            onReorder={setTasks}
            renderItem={(item) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <Text variant="body">{item.label}</Text>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                  backgroundColor: priorityColor(item.priority) + '20',
                }}>
                  <Text variant="caption" style={{ color: priorityColor(item.priority) }}>
                    {item.priority}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Countdown to end of day */}
          <View style={{ gap: 8 }}>
            <Text variant="h5">Time Left Today</Text>
            <Countdown
              targetDate={endOfDay}
              variant="minimal"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
