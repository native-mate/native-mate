import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'
import { StatCard } from '../components/ui/stat-card'
import { Countdown } from '../components/ui/countdown'
import { DatePicker } from '../components/ui/date-picker'
import { DataTable } from '../components/ui/data-table'
import { PhoneInput } from '../components/ui/phone-input'

const tableColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true },
  { key: 'growth', label: 'Growth', sortable: true },
]

const tableData = [
  { name: 'Acme Corp', status: 'Active', revenue: '$12,400', growth: '+24%' },
  { name: 'Globex Inc', status: 'Active', revenue: '$9,800', growth: '+18%' },
  { name: 'Initech', status: 'Inactive', revenue: '$4,200', growth: '-5%' },
  { name: 'Umbrella Co', status: 'Active', revenue: '$15,600', growth: '+31%' },
  { name: 'Stark Industries', status: 'Pending', revenue: '$6,100', growth: '+8%' },
]

export default function DataShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [phone, setPhone] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('US')

  const countdownTarget = new Date()
  countdownTarget.setDate(countdownTarget.getDate() + 3)

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Data</Text>
              <Text variant="caption" color="muted">Stats, tables, and data input</Text>
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

          {/* Stat Cards */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <StatCard
                title="Revenue"
                value="$48.2K"
                change="+12%"
                trend="up"
                icon={<Icon name="wallet-outline" size={20} color={theme.colors.primary} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                title="Users"
                value="12,345"
                change="+8%"
                trend="up"
                icon={<Icon name="people-outline" size={20} color={theme.colors.primary} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                title="Orders"
                value="856"
                change="-3%"
                trend="down"
                icon={<Icon name="cart-outline" size={20} color={theme.colors.primary} />}
              />
            </View>
          </View>

          {/* Countdown */}
          <View style={{ gap: 8 }}>
            <Text variant="h5">Countdown</Text>
            <Text variant="bodySmall" color="muted">Time remaining until launch event</Text>
            <Countdown
              targetDate={countdownTarget}
              variant="card"
            />
          </View>

          <Separator label="Analytics" />

          {/* Data Table */}
          <DataTable
            columns={tableColumns}
            data={tableData}
            sortable
          />

          <Separator label="Input" />

          {/* Phone Input */}
          <View style={{ gap: 8 }}>
            <Text variant="label">Phone Number</Text>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              defaultCountry="US"
              country={phoneCountry}
              onChangeCountry={setPhoneCountry}
            />
          </View>

          {/* Date Picker */}
          <View style={{ gap: 8 }}>
            <Text variant="label">Select Date</Text>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
