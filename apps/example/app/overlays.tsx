import { useState, useEffect, useRef } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Modal } from '../components/ui/modal'
import { Sheet } from '../components/ui/sheet'
import { ActionSheet } from '../components/ui/action-sheet'
import { Alert } from '../components/ui/alert'
import { useToast } from '../components/ui/toast'
import { Spinner } from '../components/ui/spinner'
import { Progress } from '../components/ui/progress'
import { Icon } from '../components/ui/icon'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

export default function OverlaysScreen() {
  const router = useRouter()
  const theme = useTheme()
  const toast = useToast()
  const [modalVisible, setModalVisible] = useState(false)
  const [sheetVisible, setSheetVisible] = useState(false)
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAlerts, setShowAlerts] = useState(true)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const animateProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current)
          setTimeout(() => toast.show({ message: 'Progress complete!', variant: 'success', duration: 2000 }), 0)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [])

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="h3">Overlays</Text>
              <Text variant="caption" color="muted">Modals, sheets, alerts, and feedback</Text>
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

          {/* Overlays section */}
          <Card>
            <CardHeader title="Overlay Components" subtitle="Tap to trigger each overlay type" />
            <CardContent>
              <View style={{ gap: 10 }}>
                <Button
                  variant="outline"
                  onPress={() => setModalVisible(true)}
                  iconLeft={<Icon name="albums-outline" size={18} />}
                >
                  Open Modal
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setSheetVisible(true)}
                  iconLeft={<Icon name="document-outline" size={18} />}
                >
                  Open Bottom Sheet
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setActionSheetOpen(true)}
                  iconLeft={<Icon name="list-outline" size={18} />}
                >
                  Open Action Sheet
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Toast section */}
          <Card>
            <CardHeader title="Toast Notifications" subtitle="Non-blocking feedback messages" />
            <CardContent>
              <View style={{ gap: 10 }}>
                <Button
                  variant="outline"
                  onPress={() => toast.show({
                    message: 'Changes saved',
                    description: 'Your profile has been updated successfully.',
                    variant: 'success',
                    duration: 3000,
                  })}
                  iconLeft={<Icon name="checkmark-circle-outline" size={18} />}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  onPress={() => toast.show({
                    message: 'Something went wrong',
                    description: 'Please try again or contact support.',
                    variant: 'destructive',
                    duration: 4000,
                  })}
                  iconLeft={<Icon name="close-circle-outline" size={18} />}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  onPress={() => toast.show({
                    message: 'Update available',
                    description: 'A new version is ready to install.',
                    variant: 'warning',
                    duration: 5000,
                    action: { label: 'Update', onPress: () => {} },
                  })}
                  iconLeft={<Icon name="warning-outline" size={18} />}
                >
                  Warning Toast with Action
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Alerts section */}
          <Card>
            <CardHeader
              title="Inline Alerts"
              subtitle="Persistent in-page notifications"
              trailing={
                <Button variant="ghost" size="sm" onPress={() => setShowAlerts(!showAlerts)}>
                  {showAlerts ? 'Hide' : 'Show'}
                </Button>
              }
            />
            {showAlerts && (
              <CardContent>
                <View style={{ gap: 10 }}>
                  <Alert
                    variant="success"
                    title="Payment received"
                    description="Your transaction of $48.20 has been processed."
                    icon={<Icon name="checkmark-circle" size={20} />}
                    action={{ label: 'View receipt', onPress: () => {} }}
                  />
                  <Alert
                    variant="warning"
                    title="Storage almost full"
                    description="You've used 90% of your storage. Consider upgrading."
                    icon={<Icon name="alert-circle" size={20} />}
                  />
                  <Alert
                    variant="destructive"
                    title="Account suspended"
                    description="Please contact support to resolve this issue."
                    icon={<Icon name="ban" size={20} />}
                    onDismiss={() => {}}
                  />
                </View>
              </CardContent>
            )}
          </Card>

          {/* Loading section */}
          <Card>
            <CardHeader title="Loading & Progress" subtitle="Spinners and progress bars" />
            <CardContent>
              <View style={{ gap: 16 }}>
                <Button
                  variant="outline"
                  onPress={() => setShowSpinner(!showSpinner)}
                  iconLeft={<Icon name="sync-outline" size={18} />}
                >
                  {showSpinner ? 'Hide Spinners' : 'Show Spinners'}
                </Button>

                {showSpinner && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12 }}>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <Spinner size="sm" />
                      <Text variant="caption" color="muted">Small</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <Spinner size="md" />
                      <Text variant="caption" color="muted">Medium</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 6 }}>
                      <Spinner size="lg" />
                      <Text variant="caption" color="muted">Large</Text>
                    </View>
                  </View>
                )}

                <Separator />

                <Button
                  variant="outline"
                  onPress={animateProgress}
                  iconLeft={<Icon name="play-outline" size={18} />}
                  disabled={progress > 0 && progress < 100}
                >
                  {progress > 0 && progress < 100 ? 'Running...' : 'Animate Progress'}
                </Button>
                <Progress value={progress} />
                <Text variant="caption" color="muted" align="center">{progress}%</Text>
              </View>
            </CardContent>
          </Card>

          {/* Modal */}
          <Modal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title="Confirm Action"
            description="Are you sure you want to proceed? This action cannot be undone."
            showCloseButton
            actions={[
              { label: 'Cancel', onPress: () => setModalVisible(false), variant: 'outline' },
              { label: 'Confirm', onPress: () => {
                setModalVisible(false)
                toast.show({ message: 'Action confirmed', variant: 'success', duration: 2000 })
              }},
            ]}
          >
            <View style={{ gap: 8, paddingVertical: 8 }}>
              <Text variant="body">This modal demonstrates:</Text>
              <Text variant="bodySmall" color="muted">• Close button in header</Text>
              <Text variant="bodySmall" color="muted">• Custom content area</Text>
              <Text variant="bodySmall" color="muted">• Footer action buttons</Text>
              <Text variant="bodySmall" color="muted">• Backdrop dismissal</Text>
            </View>
          </Modal>

          {/* Sheet */}
          <Sheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            title="Settings"
            height={400}
          >
            <View style={{ gap: 16, paddingBottom: 40 }}>
              <Text variant="body">This bottom sheet slides up with a drag handle. You can customize:</Text>
              <Text variant="bodySmall" color="muted">• Height — set via the height prop</Text>
              <Text variant="bodySmall" color="muted">• Animation — slide, spring, or fade</Text>
              <Text variant="bodySmall" color="muted">• Drag handle visibility</Text>
              <Text variant="bodySmall" color="muted">• Backdrop close behavior</Text>
              <Separator />
              <Button onPress={() => setSheetVisible(false)}>Done</Button>
            </View>
          </Sheet>

          {/* Action Sheet */}
          <ActionSheet
            isOpen={actionSheetOpen}
            onClose={() => setActionSheetOpen(false)}
            title="Photo Options"
            message="Choose how you'd like to update your profile photo"
            actions={[
              { label: 'Take Photo', onPress: () => setActionSheetOpen(false), icon: <Icon name="camera-outline" size={20} /> },
              { label: 'Choose from Library', onPress: () => setActionSheetOpen(false), icon: <Icon name="images-outline" size={20} /> },
              { label: 'View Photo', onPress: () => setActionSheetOpen(false), icon: <Icon name="eye-outline" size={20} /> },
              { label: 'Remove Photo', onPress: () => setActionSheetOpen(false), variant: 'destructive', icon: <Icon name="trash-outline" size={20} /> },
            ]}
            cancelLabel="Cancel"
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
