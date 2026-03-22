import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Checkbox, CheckboxGroup } from '../components/ui/checkbox'
import { Slider } from '../components/ui/slider'
import { Select } from '../components/ui/select'
import { Button } from '../components/ui/button'
import { useToast } from '../components/ui/toast'
import { Icon } from '../components/ui/icon'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'France', value: 'fr' },
  { label: 'India', value: 'in' },
]

const interestOptions = [
  { label: 'Frontend', value: 'frontend', description: 'React, Vue, Angular' },
  { label: 'Backend', value: 'backend', description: 'Node, Python, Go' },
  { label: 'Mobile', value: 'mobile', description: 'React Native, Flutter' },
  { label: 'DevOps', value: 'devops', description: 'Docker, K8s, CI/CD' },
]

export default function FormsScreen() {
  const router = useRouter()
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [experience, setExperience] = useState(5)
  const [country, setCountry] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [nameTouched, setNameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const nameError = nameTouched && name.trim().length === 0 ? 'Name is required' : undefined
  const emailError = emailTouched && email.length > 0 && !isValidEmail(email)
    ? 'Please enter a valid email'
    : emailTouched && email.length === 0 ? 'Email is required' : undefined

  const canSubmit = name.trim().length > 0 && isValidEmail(email) && agreed && country.length > 0

  const handleSubmit = () => {
    toast.show({
      message: 'Form submitted successfully!',
      description: `${name} from ${countryOptions.find(c => c.value === country)?.label}. Experience: ${experience}/10.`,
      variant: 'success',
      duration: 4000,
    })
  }

  const handleReset = () => {
    setName(''); setEmail(''); setBio(''); setAgreed(false)
    setExperience(5); setCountry(''); setInterests([])
    setNameTouched(false); setEmailTouched(false)
    toast.show({ message: 'Form reset', variant: 'default', duration: 2000 })
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="h3">Forms</Text>
              <Text variant="caption" color="muted">Input components playground</Text>
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

          <Card>
            <CardHeader title="Personal Info" subtitle="Fields with validation and hints" />
            <CardContent>
              <View style={{ gap: 14 }}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  onBlur={() => setNameTouched(true)}
                  error={nameError}
                  prefix={<Icon name="person-outline" size={18} />}
                  clearable
                  onClear={() => setName('')}
                  required
                />

                <Input
                  label="Email"
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={emailError}
                  hint={!emailError && email.length > 0 ? 'Looks good!' : undefined}
                  prefix={<Icon name="mail-outline" size={18} />}
                  clearable
                  onClear={() => setEmail('')}
                  required
                />

                <Input
                  label="Website"
                  placeholder="example.com"
                  prefixText="https://"
                  value=""
                  onChangeText={() => {}}
                  hint="Optional"
                />
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Bio" subtitle="Textarea with character count" />
            <CardContent>
              <Textarea
                label="About you"
                placeholder="Tell us about yourself, your skills, and what you're passionate about..."
                value={bio}
                onChangeText={setBio}
                maxLength={200}
                showCount
                countWarnAt={0.8}
                minRows={4}
                hint="Brief description for your profile"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Preferences" subtitle="Checkboxes, slider, and select" />
            <CardContent>
              <View style={{ gap: 16 }}>
                <View style={{ gap: 4 }}>
                  <Text variant="label">Experience Level: {experience}/10</Text>
                  <Slider
                    value={experience}
                    min={1}
                    max={10}
                    step={1}
                    onChange={setExperience}
                    showValue
                    marks
                  />
                </View>

                <Separator />

                <Select
                  label="Country"
                  options={countryOptions}
                  value={country}
                  onChange={setCountry}
                  placeholder="Select your country"
                  searchable
                  searchPlaceholder="Search countries..."
                  required
                  error={!country && nameTouched ? 'Please select a country' : undefined}
                />

                <Separator />

                <CheckboxGroup
                  label="Areas of Interest"
                  options={interestOptions}
                  value={interests}
                  onChange={setInterests}
                />

                <Separator />

                <Checkbox
                  label="I agree to the terms and conditions"
                  description="By checking this box, you agree to our Terms of Service and Privacy Policy."
                  checked={agreed}
                  onChange={setAgreed}
                />
              </View>
            </CardContent>
          </Card>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button variant="outline" onPress={handleReset} style={{ flex: 1 }}>
              Reset
            </Button>
            <Button onPress={handleSubmit} disabled={!canSubmit} style={{ flex: 1 }}>
              Submit
            </Button>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
