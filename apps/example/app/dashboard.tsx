import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { Tabs } from '../components/ui/tabs'
import { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar } from '../components/ui/skeleton'
import { EmptyState } from '../components/ui/empty-state'
import { Accordion } from '../components/ui/accordion'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'

const tabItems = [
  { key: 'overview', label: 'Overview', icon: <Icon name="analytics-outline" size={16} /> },
  { key: 'activity', label: 'Activity', icon: <Icon name="time-outline" size={16} /> },
  { key: 'loading', label: 'Loading', icon: <Icon name="hourglass-outline" size={16} />, badge: 3 },
]

const stats = [
  { title: 'Total Users', value: '12,345', change: '+12%', badge: 'success' as const, icon: 'people-outline' },
  { title: 'Revenue', value: '$48.2K', change: 'Pending', badge: 'warning' as const, icon: 'wallet-outline' },
  { title: 'Active Now', value: '573', change: 'Live', badge: 'default' as const, icon: 'pulse-outline' },
]

const faqItems = [
  {
    key: '1',
    title: 'How do I reset my password?',
    content: <Text variant="bodySmall" color="muted">Go to Settings → Security → Reset Password. You'll receive an email with a reset link within 5 minutes.</Text>,
    icon: <Icon name="key-outline" size={18} />,
  },
  {
    key: '2',
    title: 'Can I export my data?',
    content: <Text variant="bodySmall" color="muted">Yes! Navigate to Settings → Data → Export. Your data will be delivered as a CSV file within 24 hours. Exports are available for the last 12 months.</Text>,
    icon: <Icon name="download-outline" size={18} />,
  },
  {
    key: '3',
    title: 'What payment methods are accepted?',
    content: <Text variant="bodySmall" color="muted">We accept Visa, Mastercard, American Express, PayPal, and bank transfers. All transactions are encrypted with TLS 1.3.</Text>,
    icon: <Icon name="card-outline" size={18} />,
  },
  {
    key: '4',
    title: 'How do I contact support?',
    content: <Text variant="bodySmall" color="muted">Email support@example.com or use the in-app chat. Business hours: Mon–Fri, 9 AM – 6 PM EST. Average response time: 2 hours.</Text>,
    icon: <Icon name="chatbubble-outline" size={18} />,
  },
]

export default function DashboardScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState('overview')
  const [goalProgress] = useState(75)

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Dashboard</Text>
              <Text variant="caption" color="muted">Welcome back, Jane</Text>
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

          <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} variant="pill" />

          {activeTab === 'overview' && (
            <View style={{ gap: 14 }}>
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent style={{ paddingTop: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 14 }}>
                      <View style={{
                        width: 40, height: 40, borderRadius: 10,
                        backgroundColor: theme.colors.primary + '15',
                        alignItems: 'center', justifyContent: 'center',
                        marginTop: 2,
                      }}>
                        <Icon name={stat.icon} size={20} color={theme.colors.primary} />
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text variant="caption" color="muted">{stat.title}</Text>
                        <Text variant="h4">{stat.value}</Text>
                      </View>
                      <View style={{ justifyContent: 'center' }}>
                        <Badge variant={stat.badge} size="sm">{stat.change}</Badge>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader title="Monthly Goal" subtitle="Revenue target for March 2026" />
                <CardContent>
                  <Progress value={goalProgress} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text variant="caption" color="muted">{goalProgress}% complete</Text>
                    <Text variant="caption" color="muted">$48.2K / $65K</Text>
                  </View>
                </CardContent>
                <CardFooter>
                  <Text variant="caption" color="muted">On track to hit goal by March 28</Text>
                </CardFooter>
              </Card>

              <Separator label="FAQ" />

              <Accordion items={faqItems} variant="card" allowMultiple />
            </View>
          )}

          {activeTab === 'activity' && (
            <EmptyState
              title="No recent activity"
              description="When you start using the app, your activity feed will appear here. Try creating a project or inviting a team member."
              icon={<Icon name="file-tray-outline" size={48} color={theme.colors.muted} />}
              action={{ label: 'Create Project', onPress: () => {} }}
              secondaryAction={{ label: 'Invite Team', onPress: () => {} }}
            />
          )}

          {activeTab === 'loading' && (
            <View style={{ gap: 16 }}>
              <Text variant="h5">Skeleton Loaders</Text>
              <Text variant="bodySmall" color="muted">These pulse to indicate content is loading.</Text>

              <SkeletonAvatar size={64} showText textLines={2} />
              <SkeletonCard imageHeight={120} lines={3} />
              <SkeletonText lines={4} />

              <Separator />

              <Text variant="caption" color="muted">Individual skeleton shapes:</Text>
              <Skeleton width="100%" height={48} borderRadius={8} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Skeleton width="30%" height={32} borderRadius={16} />
                <Skeleton width="40%" height={32} borderRadius={16} />
                <Skeleton width="25%" height={32} borderRadius={16} />
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
