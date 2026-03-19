'use client'

import React, { useState, useRef, useEffect } from 'react'
import { View, Text as RNText } from 'react-native'
import { ThemeCustomizerProvider, useThemeCustomizer } from '../ThemeCustomizerContext'
import { PreviewWrapper } from '../PreviewWrapper'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useTheme as _useTheme } from '@native-mate/core'
import type { ThemePreset } from '@native-mate/core'
const useTheme = _useTheme as () => { colors: Record<string, string> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const c = <T,>(x: T) => x as React.FC<any>

import { Button      as _Button      } from '../../../../packages/registry/components/button/button'
import { Input       as _Input       } from '../../../../packages/registry/components/input/input'
import { Checkbox    as _Checkbox    } from '../../../../packages/registry/components/checkbox/checkbox'
import { Avatar      as _Avatar,
         AvatarGroup as _AvatarGroup } from '../../../../packages/registry/components/avatar/avatar'
import { Badge       as _Badge       } from '../../../../packages/registry/components/badge/badge'
import { Progress    as _Progress    } from '../../../../packages/registry/components/progress/progress'
import { Tag         as _Tag         } from '../../../../packages/registry/components/tag/tag'
import { Skeleton    as _Skeleton    } from '../../../../packages/registry/components/skeleton/skeleton'
import { Switch      as _Switch      } from '../../../../packages/registry/components/switch/switch'
import { Select      as _Select      } from '../../../../packages/registry/components/select/select'
import { Slider      as _Slider      } from '../../../../packages/registry/components/slider/slider'
import { RadioGroup  as _RadioGroup  } from '../../../../packages/registry/components/radio/radio'
import {
  Card        as _Card,
  CardHeader  as _CardHeader,
  CardContent as _CardContent,
  CardFooter  as _CardFooter,
} from '../../../../packages/registry/components/card/card'

const Button      = c(_Button)
const Input       = c(_Input)
const Checkbox    = c(_Checkbox)
const Avatar      = c(_Avatar)
const AvatarGroup = c(_AvatarGroup)
const Badge       = c(_Badge)
const Progress    = c(_Progress)
const Tag         = c(_Tag)
const Skeleton    = c(_Skeleton)
const Switch      = c(_Switch)
const Select      = c(_Select)
const Slider      = c(_Slider)
const RadioGroup  = c(_RadioGroup)
const Card        = c(_Card)
const CardHeader  = c(_CardHeader)
const CardContent = c(_CardContent)
const CardFooter  = c(_CardFooter)

// ─── Types & constants ─────────────────────────────────────────────────────────

const PRESETS: { id: ThemePreset; label: string; color: string }[] = [
  { id: 'zinc',     label: 'Zinc',     color: '#71717a' },
  { id: 'slate',    label: 'Slate',    color: '#64748b' },
  { id: 'rose',     label: 'Rose',     color: '#e11d48' },
  { id: 'midnight', label: 'Midnight', color: '#818cf8' },
]

const TABS = ['Examples', 'Forms', 'Authentication', 'Dashboard'] as const

// ─── Icons ─────────────────────────────────────────────────────────────────────

function ChevronDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// ─── Theme selector dropdown ───────────────────────────────────────────────────

function ThemeSelector() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const ctx = useThemeCustomizer()!
  const current = PRESETS.find(p => p.id === ctx.state.preset) ?? PRESETS[0]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
      >
        <span className="h-3 w-3 rounded-[3px] flex-shrink-0" style={{ background: current.color }} />
        <span>{current.label}</span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-lg border border-zinc-700 bg-zinc-950 py-1 shadow-xl z-50">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { ctx.setPreset(p.id); setOpen(false) }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                ctx.state.preset === p.id
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <span className="h-3 w-3 rounded-[3px] flex-shrink-0" style={{ background: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ModeToggle() {
  const ctx = useThemeCustomizer()!
  const isDark = ctx.state.mode === 'dark'
  return (
    <button
      onClick={() => ctx.setMode(isDark ? 'light' : 'dark')}
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

// ─── EXAMPLES TAB panels ───────────────────────────────────────────────────────

// Payment Method
function PaymentContent() {
  const [month, setMonth] = useState('')
  const [year, setYear]   = useState('')
  const [same, setSame]   = useState(true)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    .map((l, i) => ({ label: l, value: String(i + 1) }))
  const years = [2025,2026,2027,2028,2029].map(y => ({ label: String(y), value: String(y) }))
  return (
    <View style={{ gap: 12 }}>
      <Input label="Name on card" placeholder="John Doe" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 2 }}><Input label="Card number" placeholder="1234 5678 9012 3456" /></View>
        <View style={{ flex: 1 }}><Input label="CVV" placeholder="123" /></View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Select label="Month" placeholder="MM" value={month} onChange={setMonth} options={months} />
        </View>
        <View style={{ flex: 1 }}>
          <Select label="Year" placeholder="YYYY" value={year} onChange={setYear} options={years} />
        </View>
      </View>
      <Checkbox label="Same as shipping address" checked={same} onChange={setSame} />
    </View>
  )
}

function PaymentPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Payment Method" subtitle="All transactions are secure & encrypted" />
          <CardContent><PaymentContent /></CardContent>
          <CardFooter>
            <Button style={{ flex: 1 }}>Submit</Button>
            <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Unsplash portrait URLs (stable photo IDs, 100×100 face crop)
const AVATARS = {
  alex:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format',
  sara:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format',
  jay:    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces&auto=format',
  thomas: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format',
  maya:   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format',
}

// Team Members
function TeamContent() {
  const theme = useTheme()
  const members = [
    { src: AVATARS.alex,  name: 'Alex Chen',    role: 'Frontend',  status: 'online'  as const, tag: 'Admin'  },
    { src: AVATARS.sara,  name: 'Sara Rashid',  role: 'Design',    status: 'busy'    as const, tag: 'Editor' },
    { src: AVATARS.jay,   name: 'Jay Kim',      role: 'Backend',   status: undefined,           tag: 'Viewer' },
  ]
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AvatarGroup
          avatars={[
            { src: AVATARS.alex,   name: 'Alex Chen',    status: 'online' },
            { src: AVATARS.sara,   name: 'Sara Rashid',  status: 'busy'   },
            { src: AVATARS.jay,    name: 'Jay Kim'                        },
            { src: AVATARS.thomas, name: 'Thomas Miller'                  },
          ]}
          size="sm"
          max={4}
        />
        <View style={{ flex: 1 }}>
          <RNText style={{ fontWeight: '600', color: theme.colors.foreground, fontSize: 13 }}>
            4 members
          </RNText>
          <RNText style={{ color: theme.colors.muted, fontSize: 11 }}>2 online now</RNText>
        </View>
        <Badge variant="success" size="sm" appearance="soft">Active</Badge>
      </View>

      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Badge variant="secondary" size="sm">Syncing</Badge>
        <Badge variant="warning" size="sm" appearance="soft">Updating</Badge>
        <Badge variant="info" size="sm" appearance="soft">Loading</Badge>
      </View>

      {members.map(m => (
        <View key={m.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar src={m.src} name={m.name} size="sm" status={m.status} />
          <View style={{ flex: 1, gap: 1 }}>
            <RNText style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>{m.name}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.muted }}>{m.role}</RNText>
          </View>
          <Tag label={m.tag} size="sm" />
        </View>
      ))}
    </View>
  )
}

function TeamPanel() {
  const theme = useTheme()
  const stats = [
    { label: 'Commits', value: '124' },
    { label: 'PRs',     value: '18'  },
    { label: 'Issues',  value: '7'   },
  ]
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Team Members" subtitle="Collaborate on this project" />
          <CardContent><TeamContent /></CardContent>
          <CardFooter>
            <Button size="sm" style={{ flex: 1 }}>+ Invite Members</Button>
          </CardFooter>
          {/* Stats strip */}
          <View style={{
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: theme.colors.border ?? '#27272a',
            marginHorizontal: 16,
            paddingVertical: 12,
          }}>
            {stats.map((s, i) => (
              <View key={s.label} style={{
                flex: 1,
                alignItems: 'center',
                borderLeftWidth: i > 0 ? 1 : 0,
                borderLeftColor: theme.colors.border ?? '#27272a',
              }}>
                <RNText style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground }}>{s.value}</RNText>
                <RNText style={{ fontSize: 10, color: theme.colors.muted, marginTop: 1 }}>{s.label}</RNText>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Profile
function ProfileContent() {
  const theme = useTheme()
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar src={AVATARS.thomas} name="Thomas Miller" size="lg" shape="square" status="online" />
        <View style={{ flex: 1 }}>
          <RNText style={{ fontWeight: '600', color: theme.colors.foreground, fontSize: 15, lineHeight: 22 }}>
            Thomas Miller
          </RNText>
          <RNText style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>
            Senior Engineer
          </RNText>
        </View>
        <Badge variant="success" size="sm">Active</Badge>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        <Tag label="React Native" size="sm" />
        <Tag label="TypeScript" size="sm" />
        <Tag label="Expo" size="sm" />
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <RNText style={{ fontSize: 11, color: theme.colors.muted }}>Profile completion</RNText>
          <RNText style={{ fontSize: 11, color: theme.colors.muted }}>78%</RNText>
        </View>
        <Progress value={78} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button variant="outline" size="sm" style={{ flex: 1 }}>Message</Button>
        <Button size="sm" style={{ flex: 1 }}>Follow</Button>
      </View>
      {/* Stat row */}
      <View style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border ?? '#27272a',
        paddingTop: 12,
        gap: 0,
      }}>
        {[
          { label: 'Followers', value: '2.4k' },
          { label: 'Commits',   value: '891'  },
          { label: 'Repos',     value: '34'   },
        ].map((s, i) => (
          <View key={s.label} style={{
            flex: 1,
            alignItems: 'center',
            borderLeftWidth: i > 0 ? 1 : 0,
            borderLeftColor: theme.colors.border ?? '#27272a',
          }}>
            <RNText style={{ fontSize: 15, fontWeight: '700', color: theme.colors.foreground }}>{s.value}</RNText>
            <RNText style={{ fontSize: 10, color: theme.colors.muted, marginTop: 1 }}>{s.label}</RNText>
          </View>
        ))}
      </View>
    </View>
  )
}

function ProfilePanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Thomas Miller" subtitle="Senior Engineer · native-mate" />
          <CardContent><ProfileContent /></CardContent>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Activity
function ActivityContent() {
  const [notify, setNotify] = useState(true)
  const theme = useTheme()
  const items = [
    { src: AVATARS.alex,  name: 'Alex Chen',   action: 'pushed a new component'   },
    { src: AVATARS.sara,  name: 'Sara Rashid', action: 'updated the design tokens' },
    { src: AVATARS.jay,   name: 'Jay Kim',     action: 'opened a pull request'     },
  ]
  return (
    <View style={{ gap: 14 }}>
      {items.map((item, i) => (
        <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar src={item.src} name={item.name} size="sm" />
          <View style={{ flex: 1, gap: 4 }}>
            <RNText style={{ fontSize: 12, fontWeight: '500', color: theme.colors.foreground }}>
              {item.name}{' '}
              <RNText style={{ fontWeight: '400', color: theme.colors.muted }}>{item.action}</RNText>
            </RNText>
            <Skeleton width={`${60 - i * 10}%`} height={9} radius={4} />
          </View>
          <Badge variant="secondary" size="sm" appearance="soft">New</Badge>
        </View>
      ))}
      <View style={{ marginTop: 4 }}>
        <Checkbox label="Notify me on new activity" checked={notify} onChange={setNotify} />
      </View>
    </View>
  )
}

function ActivityPanel() {
  return (
    <PreviewWrapper>
      <View style={{ width: '100%' }}>
        <Card variant="outline">
          <CardHeader title="Recent Activity" subtitle="Latest team actions" />
          <CardContent><ActivityContent /></CardContent>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// ─── FORMS TAB panels ──────────────────────────────────────────────────────────

// Contact info
function ContactContent() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Input label="First name" placeholder="Alex" /></View>
        <View style={{ flex: 1 }}><Input label="Last name" placeholder="Chen" /></View>
      </View>
      <Input label="Email" placeholder="alex@company.com" />
      <Input label="Company" placeholder="Acme Inc." />
      <Input label="Role" placeholder="Senior Engineer" />
    </View>
  )
}

function ContactPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Contact Info" subtitle="Update your profile details" />
          <CardContent><ContactContent /></CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Survey
function SurveyContent() {
  const [source, setSource] = useState('social')
  const [agreed, setAgreed] = useState(false)
  return (
    <View style={{ gap: 16 }}>
      <RadioGroup
        value={source}
        onChange={setSource}
        options={[
          { label: 'Social Media',   value: 'social',   description: 'Twitter, Instagram, LinkedIn' },
          { label: 'Search Engine',  value: 'search',   description: 'Google, Bing, DuckDuckGo'    },
          { label: 'Referral',       value: 'referral', description: 'A friend or colleague'        },
          { label: 'Other',          value: 'other'                                                  },
        ]}
        card
      />
      <Checkbox label="I agree to the terms and conditions" checked={agreed} onChange={setAgreed} />
    </View>
  )
}

function SurveyPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="How did you hear about us?" subtitle="Select the option that best describes you" />
          <CardContent><SurveyContent /></CardContent>
          <CardFooter>
            <Button>Continue</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Notifications
function NotificationsPanel() {
  const [email,   setEmail]   = useState(true)
  const [push,    setPush]    = useState(false)
  const [weekly,  setWeekly]  = useState(true)
  const [updates, setUpdates] = useState(true)
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Notifications" subtitle="Choose what you want to hear about" />
          <CardContent>
            <View style={{ gap: 14 }}>
              <Checkbox label="Email notifications"    checked={email}   onChange={setEmail}   />
              <Checkbox label="Push notifications"     checked={push}    onChange={setPush}    />
              <Checkbox label="Weekly digest"          checked={weekly}  onChange={setWeekly}  />
              <Checkbox label="Product announcements"  checked={updates} onChange={setUpdates} />
            </View>
          </CardContent>
          <CardFooter>
            <Button size="sm">Update preferences</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// ─── AUTHENTICATION TAB panels ─────────────────────────────────────────────────

// Sign In
function SignInContent() {
  const [remember, setRemember] = useState(false)
  return (
    <View style={{ gap: 12 }}>
      <Input label="Email" placeholder="you@example.com" />
      <Input label="Password" placeholder="••••••••" />
      <Checkbox label="Remember me for 30 days" checked={remember} onChange={setRemember} />
      <View style={{ marginTop: 4 }}><Button>Sign in</Button></View>
    </View>
  )
}

function SignInPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Sign in" subtitle="Welcome back! Enter your details." />
          <CardContent><SignInContent /></CardContent>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// OTP
function OtpContent() {
  const theme = useTheme()
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View key={i} style={{
            width: 44, height: 52, borderRadius: 8, borderWidth: 1,
            borderColor: i === 3 ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.surface,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <RNText style={{ fontSize: 20, fontWeight: '600', color: i < 3 ? theme.colors.foreground : theme.colors.border }}>
              {i < 3 ? '•' : ''}
            </RNText>
          </View>
        ))}
      </View>
      <Button>Verify Code</Button>
      <View style={{ alignItems: 'center' }}>
        <RNText style={{ fontSize: 12, color: theme.colors.muted }}>
          Didn't receive a code?{' '}
          <RNText style={{ color: theme.colors.foreground, textDecorationLine: 'underline' }}>Resend</RNText>
        </RNText>
      </View>
    </View>
  )
}

function OtpPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Two-Factor Auth" subtitle="Enter the 6-digit code from your app" />
          <CardContent><OtpContent /></CardContent>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Security Settings
function SecurityContent() {
  const [twofa,     setTwofa]     = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [alerts,    setAlerts]    = useState(true)
  const [sessions,  setSessions]  = useState(false)
  const theme = useTheme()

  const rows = [
    { label: 'Two-factor authentication', desc: 'Verify via email or phone',      val: twofa,     set: setTwofa     },
    { label: 'Biometric login',           desc: 'Use Face ID or fingerprint',      val: biometric, set: setBiometric },
    { label: 'Login alerts',              desc: 'Get notified on new sign-ins',    val: alerts,    set: setAlerts    },
    { label: 'Active sessions',           desc: 'Manage trusted devices',          val: sessions,  set: setSessions  },
  ]

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Badge variant="success" appearance="soft">Profile verified</Badge>
        <Badge variant="info" appearance="soft" size="sm">2FA recommended</Badge>
      </View>
      {rows.map((row, i) => (
        <View key={row.label} style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          paddingVertical: 10,
          borderBottomWidth: i < rows.length - 1 ? 1 : 0,
          borderBottomColor: theme.colors.border,
        }}>
          <View style={{ flex: 1, gap: 2 }}>
            <RNText style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>{row.label}</RNText>
            <RNText style={{ fontSize: 11, color: theme.colors.muted }}>{row.desc}</RNText>
          </View>
          <Switch value={row.val} onValueChange={row.set} size="sm" />
        </View>
      ))}
    </View>
  )
}

function SecurityPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Security" subtitle="Manage your account security" />
          <CardContent><SecurityContent /></CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Manage devices</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// ─── DASHBOARD TAB panels ──────────────────────────────────────────────────────

// Metrics with circular progress
function MetricsContent() {
  const theme = useTheme()
  const stats = [
    { label: 'Storage',  value: 65, color: theme.colors.primary   },
    { label: 'Memory',   value: 42, color: theme.colors.success    },
    { label: 'CPU',      value: 88, color: theme.colors.destructive },
  ]
  const kpis = [
    { label: 'Uptime',   value: '99.9%' },
    { label: 'Requests', value: '1.2M'  },
    { label: 'Errors',   value: '0.01%' },
  ]
  return (
    <View style={{ gap: 20 }}>
      {/* Circular progress row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        {stats.map(s => (
          <View key={s.label} style={{ alignItems: 'center', gap: 8 }}>
            <Progress variant="circular" value={s.value} size="lg" showValue color={s.color} />
            <RNText style={{ fontSize: 11, color: theme.colors.muted }}>{s.label}</RNText>
          </View>
        ))}
      </View>
      {/* KPI strip */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {kpis.map((k, i) => (
          <View key={k.label} style={{
            flex: 1, borderRadius: 10, borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            padding: 10, alignItems: 'center', gap: 2,
          }}>
            <RNText style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>{k.value}</RNText>
            <RNText style={{ fontSize: 10, color: theme.colors.muted }}>{k.label}</RNText>
          </View>
        ))}
      </View>
    </View>
  )
}

function MetricsPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="System Metrics" subtitle="Live cluster overview" />
          <CardContent><MetricsContent /></CardContent>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Storage
function StorageContent() {
  const theme = useTheme()
  const items = [
    { label: 'Documents', value: 47 },
    { label: 'Media',     value: 72 },
    { label: 'Backups',   value: 23 },
  ]
  return (
    <View style={{ gap: 14 }}>
      {items.map(item => (
        <View key={item.label}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <RNText style={{ fontSize: 12, color: theme.colors.foreground }}>{item.label}</RNText>
            <RNText style={{ fontSize: 12, color: theme.colors.muted }}>{item.value} GB</RNText>
          </View>
          <Progress value={item.value} />
        </View>
      ))}
    </View>
  )
}

function StoragePanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Storage" subtitle="Team plan · 100 GB total" />
          <CardContent><StorageContent /></CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Upgrade plan</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// Compute / Filter panel — Slider + RadioGroup
function FilterContent() {
  const [budget, setBudget] = useState(450)
  const [compute, setCompute] = useState('k8s')
  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 8 }}>
        <Slider
          label="Price Range"
          value={budget}
          min={200}
          max={800}
          step={50}
          onChange={setBudget}
          showValue
        />
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <Tag label="Budget" size="sm" />
          <Tag label="Mid-range" size="sm" />
          <Tag label="Premium" size="sm" />
        </View>
      </View>

      <RadioGroup
        value={compute}
        onChange={setCompute}
        label="Compute Environment"
        options={[
          { label: 'Kubernetes',      value: 'k8s', description: 'GPU workloads on K8s. Default.' },
          { label: 'Virtual Machine', value: 'vm',  description: 'VM cluster. Coming soon.',       disabled: true },
        ]}
        card
      />
    </View>
  )
}

function FilterPanel() {
  return (
    <PreviewWrapper>
      <View style={{ flex: 1, width: '100%' }}>
        <Card variant="outline" style={{ flex: 1 }}>
          <CardHeader title="Configure" subtitle="Set compute & budget preferences" />
          <CardContent><FilterContent /></CardContent>
          <CardFooter>
            <Button size="sm">Apply filters</Button>
            <Button variant="outline" size="sm">Reset</Button>
          </CardFooter>
        </Card>
      </View>
    </PreviewWrapper>
  )
}

// ─── Block wrapper ─────────────────────────────────────────────────────────────

function BlockPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-[#111111] p-4">
      {children}
    </div>
  )
}

// ─── Tab grids ─────────────────────────────────────────────────────────────────

function ExamplesGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-stretch">
        <BlockPanel><PaymentPanel /></BlockPanel>
        <BlockPanel><TeamPanel /></BlockPanel>
        <BlockPanel><ProfilePanel /></BlockPanel>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-[#111111] p-4">
        <ActivityPanel />
      </div>
    </>
  )
}

function FormsGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-stretch">
        <BlockPanel><ContactPanel /></BlockPanel>
        <BlockPanel><PaymentPanel /></BlockPanel>
        <BlockPanel><SurveyPanel /></BlockPanel>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-[#111111] p-4">
        <NotificationsPanel />
      </div>
    </>
  )
}

function AuthGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-stretch">
      <BlockPanel><SignInPanel /></BlockPanel>
      <BlockPanel><OtpPanel /></BlockPanel>
      <BlockPanel><SecurityPanel /></BlockPanel>
    </div>
  )
}

function DashboardGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-stretch">
        <BlockPanel><MetricsPanel /></BlockPanel>
        <BlockPanel><StoragePanel /></BlockPanel>
        <BlockPanel><FilterPanel /></BlockPanel>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-[#111111] p-4">
        <ActivityPanel />
      </div>
    </>
  )
}

// ─── Inner showcase (needs context) ───────────────────────────────────────────

function ShowcaseInner() {
  const [tab, setTab] = useState<typeof TABS[number]>('Examples')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center border-b border-zinc-800 mb-6">
        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-px" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 pl-4 pb-px relative z-30">
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>

      {tab === 'Examples'       && <ExamplesGrid />}
      {tab === 'Forms'          && <FormsGrid />}
      {tab === 'Authentication' && <AuthGrid />}
      {tab === 'Dashboard'      && <DashboardGrid />}
    </div>
  )
}

// ─── Public export ─────────────────────────────────────────────────────────────

export function HomeShowcase() {
  return (
    <section className="px-4 sm:px-5 pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 mb-2">Live preview</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">See it in action</h2>
        </div>

        <ThemeCustomizerProvider>
          <ShowcaseInner />
        </ThemeCustomizerProvider>
      </div>
    </section>
  )
}
