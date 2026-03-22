# native-mate Example App

A demo Expo app showcasing all 28 native-mate components across 7 screens. Built entirely using the `@native-mate/cli` — every component was installed via `native-mate add`.

## Screens

| Screen | Components Used |
|--------|----------------|
| **Home** | Screen, Text, Button, Card, Badge, Tag, Separator, Icon |
| **Login** | Screen, Text, Input, Button, Separator, Icon |
| **OTP** | Screen, Text, OtpInput, Button, Spinner |
| **Dashboard** | Screen, Tabs, Card, Progress, Badge, Skeleton, EmptyState, Accordion |
| **Profile** | Screen, Avatar, Switch, Select, Radio, Separator, Card |
| **Forms** | Screen, Input, Textarea, Checkbox, Slider, Select, Button, Toast |
| **Overlays** | Screen, Button, Modal, Sheet, ActionSheet, Alert, Toast, Spinner, Progress |

## Theme Support

All 4 presets (zinc, slate, rose, midnight) with light/dark mode switching via the home screen. That's 8 theme combinations total.

## Run it

```bash
cd apps/example
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

## How it was built

```bash
# 1. Init native-mate
npx @native-mate/cli init -y -p zinc

# 2. Install all components
npx @native-mate/cli add --all

# 3. Build screens using the installed components
```

No component code was written manually — everything comes from the native-mate registry.
