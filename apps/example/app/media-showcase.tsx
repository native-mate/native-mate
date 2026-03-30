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
import { Image } from '../components/ui/image'
import { Carousel } from '../components/ui/carousel'
import { Rating } from '../components/ui/rating'
import { Banner } from '../components/ui/banner'
import { Dialog } from '../components/ui/dialog'
import { DropdownMenu } from '../components/ui/dropdown-menu'
import { Tooltip } from '../components/ui/tooltip'
import { Popover } from '../components/ui/popover'
import { DividerLabel } from '../components/ui/divider-label'

const carouselColors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6']
const carouselIcons = ['image-outline', 'camera-outline', 'film-outline', 'musical-notes-outline', 'brush-outline']
const carouselLabels = ['Landscapes', 'Portraits', 'Videos', 'Music', 'Art']

export default function MediaShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [rating, setRating] = useState(4)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [popoverVisible, setPopoverVisible] = useState(false)

  const dropdownItems = [
    { label: 'Share', icon: 'share-outline', onPress: () => {} },
    { label: 'Edit', icon: 'create-outline', onPress: () => {} },
    { label: 'Download', icon: 'download-outline', onPress: () => {} },
    { type: 'separator' as const },
    { label: 'Delete', icon: 'trash-outline', onPress: () => setDeleteDialogVisible(true), destructive: true },
  ]

  const carouselItems = carouselColors.map((color, index) => ({
    key: String(index),
    content: (
      <View
        style={{
          height: 200,
          borderRadius: 12,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Icon name={carouselIcons[index]} size={48} color="#ffffff" />
        <Text variant="h6" style={{ color: '#ffffff' }}>{carouselLabels[index]}</Text>
      </View>
    ),
  }))

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="h3">Media & Overlays</Text>
              <Text variant="caption" color="muted">Carousel, rating, dialog, dropdown</Text>
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

          {/* Banner */}
          {bannerVisible && (
            <Banner
              variant="info"
              title="New feature: AI photo editing is here!"
              icon={<Icon name="sparkles-outline" size={20} />}
              onDismiss={() => setBannerVisible(false)}
            />
          )}

          {!bannerVisible && (
            <Button variant="ghost" size="sm" onPress={() => setBannerVisible(true)}>
              Show Banner Again
            </Button>
          )}

          {/* Carousel */}
          <Card>
            <CardHeader title="Carousel" subtitle="Swipe through media categories" />
            <CardContent>
              <Carousel items={carouselItems} autoPlay={false} showPagination />
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader title="Image" subtitle="Optimized image with loading states" />
            <CardContent>
              <View style={{ gap: 12 }}>
                <Image
                  source={{ uri: 'https://picsum.photos/400/200' }}
                  style={{ width: '100%', height: 160, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text variant="caption" color="muted" align="center">
                  Image component with automatic loading placeholder
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Rating */}
          <DividerLabel label="Interaction" />

          <Card>
            <CardHeader title="Rating" subtitle="Tap stars to rate" />
            <CardContent>
              <View style={{ alignItems: 'center', gap: 12 }}>
                <Rating
                  value={rating}
                  onChange={setRating}
                  size={32}
                  maxStars={5}
                />
                <Text variant="body">
                  {rating} out of 5 stars
                </Text>
                <Text variant="caption" color="muted">
                  Tap a star to change the rating
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Dropdown Menu, Tooltip, Popover */}
          <DividerLabel label="Menus & Popovers" />

          <Card>
            <CardHeader title="Dropdown Menu" subtitle="Contextual actions menu" />
            <CardContent>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <DropdownMenu
                  items={dropdownItems}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={<Icon name="ellipsis-horizontal" size={18} />}
                    >
                      More Options
                    </Button>
                  }
                />

                <Tooltip content="This shows additional information about the media item">
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.colors.muted + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon name="information-circle-outline" size={22} color={theme.colors.primary} />
                  </View>
                </Tooltip>

                <Popover
                  visible={popoverVisible}
                  onClose={() => setPopoverVisible(false)}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => setPopoverVisible(true)}
                    >
                      Details
                    </Button>
                  }
                  content={
                    <View style={{ padding: 12, gap: 8, minWidth: 200 }}>
                      <Text variant="h6">Photo Details</Text>
                      <Separator />
                      <View style={{ gap: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text variant="caption" color="muted">Format</Text>
                          <Text variant="caption">JPEG</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text variant="caption" color="muted">Size</Text>
                          <Text variant="caption">2.4 MB</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text variant="caption" color="muted">Dimensions</Text>
                          <Text variant="caption">3840 x 2160</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text variant="caption" color="muted">Date</Text>
                          <Text variant="caption">Mar 15, 2026</Text>
                        </View>
                      </View>
                    </View>
                  }
                />
              </View>
            </CardContent>
          </Card>

          {/* Additional info card */}
          <Card>
            <CardHeader title="Component Notes" subtitle="How these components work together" />
            <CardContent>
              <View style={{ gap: 8 }}>
                <Text variant="bodySmall" color="muted">
                  The Dropdown Menu opens a contextual menu with actions. Selecting "Delete" triggers the confirmation Dialog below.
                </Text>
                <Text variant="bodySmall" color="muted">
                  The Tooltip appears on long-press (mobile) or hover (web) over the info icon.
                </Text>
                <Text variant="bodySmall" color="muted">
                  The Popover shows detailed metadata when pressing the "Details" button.
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Delete Dialog */}
          <Dialog
            visible={deleteDialogVisible}
            onClose={() => setDeleteDialogVisible(false)}
            title="Delete Photo"
            description="Are you sure you want to delete this photo? This action cannot be undone."
            actions={[
              { label: 'Cancel', onPress: () => setDeleteDialogVisible(false), variant: 'outline' },
              { label: 'Delete', onPress: () => setDeleteDialogVisible(false), variant: 'destructive' },
            ]}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
