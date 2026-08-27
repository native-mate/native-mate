# native-mate v2 Roadmap

> Goal: The most complete, production-ready React Native UI system. Not just components — screens, hooks, animations, CLI superpowers, and AI-native tooling. Make shadcn look like a starter kit.

## Current State (v2 — in progress)

**80 components** shipped. 28 from v1 + 52 new across Phase 1–3.
**15 example app screens** (6 original + 9 new showcases).
**4 theme presets** (zinc, slate, rose, midnight).

---

## Phase 1 — Core Mobile Essentials ✅ COMPLETE

High-impact components every mobile app needs.

### Components

- [x] **header** — Custom nav header with back button, title, action icons, safe area aware
- [x] **bottom-bar** — Bottom navigation bar with icons, badges, animated active indicator
- [x] **fab** — Floating action button with speed dial fan-out animation
- [x] **search-bar** — Animated search input with cancel button and suggestion list
- [x] **list-item** — List row with leading icon/avatar, title, subtitle, trailing chevron
- [x] **chip** — Selectable/filterable chip with animated selection state
- [x] **toggle-group** — Multi-option toggle (single or multi select) with sliding indicator
- [x] **dialog** — Confirm/cancel dialog with scale + fade animation
- [x] **dropdown-menu** — Context menu with scale animation from trigger
- [x] **rating** — Star rating display + interactive input with haptic per star
- [x] **banner** — Top/bottom app banner with slide in/out animation
- [x] **image** — Enhanced image with placeholder, error fallback, fade-in on load
- [x] **carousel** — Horizontal swipeable carousel with animated pagination dots
- [x] **divider-label** — "OR" style divider / section header with line
- [x] **tooltip** — Tooltip on long press with arrow and auto-positioning
- [x] **popover** — Rich popover with interactive content, scale + fade animation

### Showcase

- [x] `navigation-showcase.tsx` — Header, BottomBar, FAB, SearchBar, Breadcrumb, Stepper
- [x] `lists-showcase.tsx` — ListItem, Chip, ToggleGroup, SegmentedControl, Collapsible, SwipeableRow
- [x] `media-showcase.tsx` — Carousel, Rating, Banner, Dialog, DropdownMenu, Tooltip, Popover

### Themes

- [ ] **ocean** — Deep blue tones, calm (fintech, health)
- [ ] **forest** — Green earth tones (sustainability, wellness)
- [ ] **sunset** — Warm orange/amber (social, creative)
- [ ] **lavender** — Purple/violet (modern, gen-z)

### Customization

- [x] Custom font family support in token system — `typography.family` token + `fontStyle()` helper (core 0.2.0)
- [ ] Border width tokens (hairline, thin, medium, thick)
- [ ] Opacity tokens (disabled, hover, backdrop)
- [x] Reduced-motion support — `useMotion()` + ThemeProvider collapses `animation.speed` (core 0.4.0)
- [x] `withAlpha()` color helper replacing hex-string concatenation (core 0.4.0)
- [x] `readableOn()` / `relativeLuminance()` — WCAG contrast pick for caller-supplied fills, the case no `on*` token can cover (core 0.4.0)
- [x] `typography.family.mono` + `monoFontFamily()` for code/tabular text (core 0.4.0)
- [x] CI gates: `audit-hex` (no hardcoded semantic colors — every literal is a white-label bug),
      `audit-fonts` (no `fontFamily` literals or `undefined`), `audit-availability`
      (the registry index can never advertise what the CLI cannot install)
- [x] **v0.5 wave shipped** — see `docs/superpowers/specs/2026-08-27-v05-contracts-i18n-a11y-design.md`
  - [x] `error`/`haptic`/`icon` prop contracts + `npx @native-mate/cli migrate v0.5` codemod
  - [x] i18n `strings` slot (`useStrings`, ThemeProvider `strings`), English-only defaults
  - [x] RTL logical-property sweep + directional icons + `audit-rtl` CI gate
  - [x] date-picker composes the real Sheet; `firstDayOfWeek`/`locale`/`hour12`
  - [x] sheet drag + real `snapPoints` via optional RNGH, graceful without it
  - [x] app-wide haptics kill switch (`<ThemeProvider haptics={false}>`)
  - [ ] Remaining a11y: modal focus restore, `otp-input` VoiceOver polish
  - [ ] Remaining perf: worklets capturing whole `theme`, segmented-control
        `translateX`/`scaleX` indicator, stepper percentage-width connector
  - [ ] RTL: 16 files still on physical properties (listed in `audit-rtl`'s
        `PENDING_OTHER_AGENTS`); color-picker's flipped gradient track needs
        `direction: 'ltr'` pinned
  - [ ] `toast` swipe still on PanResponder — move to RNGH so action buttons win their taps

---

## Phase 2 — Common App Patterns ✅ COMPLETE

Components for standard app flows: onboarding, settings, notifications.

### Components

- [x] **swipeable-row** — Swipe-to-reveal actions with spring physics, full-swipe destructive
- [x] **stepper** — Multi-step progress indicator (horizontal/vertical, numbered/icon/dot)
- [x] **segmented-control** — iOS-style segmented toggle with sliding pill animation
- [x] **date-picker** — Custom calendar grid + time spinners, bottom sheet presentation
- [x] **phone-input** — International phone input with country picker, flag emoji, auto-format
- [x] **notification-card** — Notification item with category accent, unread dot, relative time
- [x] **chat-bubble** — Message bubble with self/other alignment, status checkmarks, bubble tails
- [x] **stat-card** — KPI card with animated number counter, trend arrows, skeleton loading
- [x] **timeline** — Vertical timeline with status nodes, stagger entrance, active pulse
- [x] **draggable-list** — Reorderable list with shadow lift, smooth 60fps reorder, haptic
- [x] **countdown** — Countdown timer with card/inline/minimal variants, animated digit flip
- [x] **collapsible** — Animated expand/collapse with chevron rotation
- [x] **pull-to-refresh** — Custom refresh indicator with progress arc and spring-back
- [x] **infinite-scroll** — FlatList wrapper with threshold trigger and loading footer
- [x] **bottom-sheet-list** — Searchable bottom sheet with multi-select and keyboard avoidance

### Showcase

- [x] `social-showcase.tsx` — ChatBubble, NotificationCard, Timeline, Comment, ReactionBar, MentionInput
- [x] `data-showcase.tsx` — StatCard, Countdown, DataTable, PhoneInput, DatePicker
- [x] `interactive-showcase.tsx` — DraggableList, BottomSheetList, SegmentedControl, Stepper

### Themes

- [ ] **monochrome** — Pure black & white, high contrast (minimal, luxury)
- [ ] **neon** — Bright accents on dark background (gaming, music)

### Customization

- [ ] Z-index tokens for consistent layering
- [ ] Gradient presets per theme
- [ ] Semantic component tokens (card.background, input.border, button.primary)

---

## Phase 3 — Domain-Specific ✅ COMPLETE

Components for specific app types: e-commerce, auth, social, media.

### Components

- [x] **product-card** — Product image, price/strikethrough, rating, animated favorite heart, add-to-cart
- [x] **cart-item** — Cart row with image thumbnail, inline quantity stepper, swipe-to-remove
- [x] **quantity-stepper** — +/- control with spring feedback, long-press rapid increment
- [x] **pricing-card** — Subscription plan with feature list, "Most Popular" badge, CTA
- [x] **payment-card** — Display mode (gradient card, masked number) + input mode (formatted fields)
- [x] **review-card** — Star rating, author info, expandable text, image thumbnails, helpful voting
- [x] **onboarding-screen** — Full-screen slide with animated dot indicator, skip/next/finish
- [x] **pin-lock** — Animated dot fill, number keypad, shake on error, biometric button, lockout
- [x] **biometric-prompt** — Modal with fingerprint/face icon, pulse animation, success/error states
- [x] **social-login-button** — Google/Apple/GitHub/Facebook/Twitter/Discord with brand colors
- [x] **video-player** — Play/pause overlay, progress bar, time display, fullscreen, poster
- [x] **audio-player** — Full + compact modes, artwork, play/pause/skip, progress bar
- [x] **file-upload** — Dropzone/button/compact variants, file preview thumbnails, progress bars
- [x] **markdown** — Full parser for headings, bold, italic, code, links, lists, blockquotes, images
- [x] **comment** — Threaded replies with indentation, like/reply, relative timestamps
- [x] **mention-input** — @mention autocomplete dropdown, user search, cursor-aware replacement
- [x] **reaction-bar** — Emoji pills with animated count, own-reaction highlight, add button
- [x] **color-picker** — Preset swatches, hue/saturation/lightness sliders, hex input
- [x] **speed-dial** — Rotating FAB, staggered spring action fan-out, backdrop dim, labels
- [x] **breadcrumb** — Configurable separators, middle truncation, icon support
- [x] **data-table** — Sortable columns, horizontal scroll, sticky header, striped, loading skeleton

### Showcase

- [x] `ecommerce-showcase.tsx` — ProductCard, CartItem, QuantityStepper, PricingCard, PaymentCard, ReviewCard
- [x] `auth-showcase.tsx` — SocialLoginButton, PinLock, BiometricPrompt, OnboardingScreen
- [x] `content-showcase.tsx` — Markdown, VideoPlayer, AudioPlayer, FileUpload, ColorPicker, SpeedDial, Breadcrumb

### Themes

- [ ] **pastel** — Soft muted colors (kids, education)
- [ ] **corporate** — Conservative blue/gray (enterprise, B2B)

### Customization

- [ ] Theme Studio — Visual theme builder in docs (pick colors, live preview, export config)
- [ ] Icon theme support — Lucide, Phosphor, Heroicons alongside Ionicons

---

## Phase 4 — Hooks Library (`native-mate add hook:useX`)

shadcn has zero hooks. This is where we pull ahead. Every hook is copy-paste like components.

### Device & Platform

- [ ] **useKeyboard** — Keyboard height, visibility, dismiss handler
- [ ] **useOrientation** — Portrait/landscape detection + lock helpers
- [ ] **useDeviceInfo** — Screen size, platform, model, safe area insets
- [ ] **useAppState** — App foreground/background/inactive state
- [ ] **useNetworkStatus** — Online/offline, connection type (wifi/cellular), speed
- [ ] **useBatteryLevel** — Battery %, charging state
- [ ] **usePermissions** — Camera, location, notifications permission request flow

### Gestures & Interaction

- [ ] **useLongPress** — Long press with configurable delay and haptic
- [ ] **useDoubleTap** — Double tap detection (Instagram heart)
- [ ] **usePinchZoom** — Pinch-to-zoom gesture handler
- [ ] **useSwipeGesture** — Directional swipe detection (left/right/up/down)
- [ ] **useDragToReorder** — Drag reorder logic for lists
- [ ] **useShake** — Device shake detection (undo, easter eggs)
- [ ] **usePanResponder** — Simplified pan responder setup

### Animation

- [ ] **useAnimatedValue** — Simplified reanimated shared value with common presets
- [ ] **useSpringAnimation** — Spring physics with sensible defaults
- [ ] **useStaggeredList** — Staggered entrance animation for list items
- [ ] **useParallax** — Parallax scroll effect for headers/images
- [ ] **useCountUp** — Animated number counter (stats, dashboards)
- [ ] **useTypewriter** — Typewriter text reveal effect
- [ ] **useShimmer** — Shimmer/shine animation for loading states
- [ ] **useConfetti** — Confetti burst animation trigger
- [ ] **usePulse** — Pulsing animation (notifications, live indicators)
- [ ] **useSlideIn** — Slide-in entrance from any direction
- [ ] **useFlipCard** — 3D card flip animation

### Data & State

- [ ] **useDebounce** — Debounced value (search inputs)
- [ ] **useThrottle** — Throttled callback (scroll handlers)
- [ ] **useLocalStorage** — AsyncStorage with type safety and default values
- [ ] **useClipboard** — Copy/paste with feedback
- [ ] **useForm** — Lightweight form state, validation, error handling
- [ ] **useInfiniteQuery** — Pagination helper for FlatList
- [ ] **usePrevious** — Previous value reference
- [ ] **useInterval** — Safe setInterval with cleanup
- [ ] **useTimeout** — Safe setTimeout with cleanup
- [ ] **useToggle** — Boolean toggle with optional callback
- [ ] **useArray** — Array state helpers (push, remove, update, filter)
- [ ] **useMap** — Map state helpers
- [ ] **useQueue** — Queue data structure state
- [ ] **useUndoRedo** — Undo/redo state management

### UI & Layout

- [ ] **useResponsive** — Responsive values based on screen size (like Tailwind breakpoints)
- [ ] **useSafeArea** — Safe area insets with platform awareness
- [ ] **useScrollPosition** — Scroll offset tracking for animated headers
- [ ] **useRefreshControl** — Pull-to-refresh state management
- [ ] **useHeaderHeight** — Dynamic header height for collapsible headers
- [ ] **useBottomSheetState** — Bottom sheet open/close/snap state
- [ ] **useKeyboardAvoiding** — Keyboard avoiding behavior without the janky KeyboardAvoidingView
- [ ] **useLayout** — onLayout callback with dimensions state
- [ ] **useColorScheme** — Enhanced dark/light mode with system + manual override + persistence
- [ ] **useStatusBar** — Declarative status bar style per screen

### Utility

- [ ] **useHaptic** — Haptic feedback triggers (light, medium, heavy, success, error)
- [ ] **useShare** — Native share sheet
- [ ] **useLinking** — Deep link handler
- [ ] **useImagePicker** — Camera/gallery picker
- [ ] **useBiometric** — Face ID / fingerprint authentication
- [ ] **useNotifications** — Push notification registration + handlers
- [ ] **useLocation** — Current location with permission flow
- [ ] **useCamera** — Camera access with preview

---

## Phase 5 — Ready-Made Screens (`native-mate add screen:login`)

Full screens you can drop in and customize. No other component library does this.

### Auth Screens

- [ ] **screen:login** — Email/password login with social buttons, forgot password link
- [ ] **screen:signup** — Registration with name, email, password, terms checkbox
- [ ] **screen:forgot-password** — Email input + "check your inbox" state
- [ ] **screen:otp-verify** — OTP input screen with resend timer
- [ ] **screen:pin-entry** — PIN/passcode screen with biometric option
- [ ] **screen:lock-screen** — App lock with PIN + biometric

### Onboarding Screens

- [ ] **screen:onboarding** — Multi-slide onboarding with dots, skip, next
- [ ] **screen:permissions** — Permission request flow (camera, notifications, location)
- [ ] **screen:welcome** — Welcome screen with app logo and get-started CTA

### Profile & Settings

- [ ] **screen:profile** — User profile with avatar, stats, edit button
- [ ] **screen:edit-profile** — Edit profile form with image picker
- [ ] **screen:settings** — Settings list with toggles, navigation rows, sections
- [ ] **screen:appearance** — Theme picker, dark mode toggle, font size
- [ ] **screen:notifications-settings** — Notification preference toggles by category

### Content Screens

- [ ] **screen:feed** — Social feed with pull-to-refresh, infinite scroll
- [ ] **screen:detail** — Content detail with parallax header image
- [ ] **screen:gallery** — Image gallery grid with full-screen viewer
- [ ] **screen:search** — Search screen with recent, trending, results sections
- [ ] **screen:empty** — Empty state screen with illustration and CTA
- [ ] **screen:error** — Error/404 screen with retry button
- [ ] **screen:maintenance** — App maintenance / update required screen

### E-Commerce Screens

- [ ] **screen:product-list** — Product grid/list with filters and sort
- [ ] **screen:product-detail** — Product page with image carousel, variants, add-to-cart
- [ ] **screen:cart** — Shopping cart with items, quantity, total, checkout button
- [ ] **screen:checkout** — Checkout flow with address, payment, review steps
- [ ] **screen:order-history** — Order list with status badges
- [ ] **screen:order-detail** — Order detail with timeline tracker

### Chat & Messaging

- [ ] **screen:chat-list** — Conversation list with avatar, last message, unread badge
- [ ] **screen:chat** — Chat screen with message bubbles, input bar, attachments
- [ ] **screen:contacts** — Contact list with alphabet index and search

### Dashboard

- [ ] **screen:dashboard** — Stats grid, recent activity, quick actions
- [ ] **screen:analytics** — Charts, metrics, date range picker

---

## Phase 6 — Animation Presets (`native-mate add animation:fadeIn`)

Pre-built animation configs. Drop-in, customizable, Reanimated-based.

### Entrance Animations

- [ ] **animation:fadeIn** — Opacity 0 → 1 with optional direction (up, down, left, right)
- [ ] **animation:slideIn** — Slide from edge with spring physics
- [ ] **animation:scaleIn** — Scale from 0 → 1 with bounce
- [ ] **animation:flipIn** — 3D flip entrance
- [ ] **animation:rotateIn** — Rotation entrance
- [ ] **animation:bounceIn** — Bounce entrance from any direction

### Exit Animations

- [ ] **animation:fadeOut** — Reverse of fadeIn
- [ ] **animation:slideOut** — Slide to edge
- [ ] **animation:scaleOut** — Shrink to 0
- [ ] **animation:flipOut** — 3D flip exit

### Attention Animations

- [ ] **animation:bounce** — Bouncing loop
- [ ] **animation:pulse** — Scale pulse loop
- [ ] **animation:shake** — Horizontal shake (error feedback)
- [ ] **animation:wiggle** — Rotation wiggle (notification badge)
- [ ] **animation:glow** — Glowing shadow pulse
- [ ] **animation:heartbeat** — Heartbeat scale animation

### Transition Animations

- [ ] **animation:morphCard** — Shared element card expand/collapse
- [ ] **animation:heroTransition** — Shared element page transition
- [ ] **animation:listReorder** — Smooth list reorder transition
- [ ] **animation:layoutTransition** — Smooth layout change animation
- [ ] **animation:crossFade** — Cross-fade between two views

### Scroll Animations

- [ ] **animation:parallaxHeader** — Collapsing parallax header on scroll
- [ ] **animation:stickyHeader** — Scroll-aware sticky header with fade
- [ ] **animation:revealOnScroll** — Elements appear as they scroll into view
- [ ] **animation:scrollProgress** — Progress bar tied to scroll position

### Micro-Interactions

- [ ] **animation:tapFeedback** — Scale + opacity on press
- [ ] **animation:swipeReveal** — Swipe to reveal hidden content
- [ ] **animation:pullToRefresh** — Custom pull-to-refresh animation
- [ ] **animation:skeletonShimmer** — Skeleton loading shimmer
- [ ] **animation:confetti** — Confetti burst for success states
- [ ] **animation:ripple** — Material-style ripple on press
- [ ] **animation:likeButton** — Instagram-style heart animation

---

## Phase 7 — CLI & Tooling Superpowers

Make the CLI the best in the ecosystem. shadcn CLI is basic — ours should be magic.

### CLI Enhancements

- [ ] **`native-mate doctor`** — Diagnose project setup, missing deps, version mismatches, common issues
- [ ] **`native-mate diff <component>`** — Show diff between your local component and latest registry version
- [ ] **`native-mate migrate`** — Auto-migrate components when breaking changes happen between versions
- [ ] **`native-mate eject <component>`** — Remove native-mate header comments, fully detach from registry
- [ ] **`native-mate create <app-name>`** — Scaffold a new Expo app pre-configured with native-mate
- [ ] **`native-mate add screen:<name>`** — Install full screen templates
- [ ] **`native-mate add hook:<name>`** — Install hooks just like components
- [ ] **`native-mate add animation:<name>`** — Install animation presets
- [ ] **`native-mate theme`** — Interactive terminal theme customizer (preview colors in terminal)
- [ ] **`native-mate theme export`** — Export theme as Figma tokens, Tailwind config, or CSS variables
- [ ] **`native-mate stats`** — Show installed components, versions, sizes, dep tree
- [ ] **`native-mate search <query>`** — Fuzzy search all components, hooks, screens, animations
- [ ] **`native-mate update`** — Update all installed components to latest in one command
- [ ] **`native-mate test <component>`** — Generate and run tests for installed components

### Registry Enhancements

- [ ] Component versioning with changelogs
- [ ] Component dependency graph visualization
- [ ] Component size/bundle impact display
- [ ] Community component submissions (open registry)
- [ ] Private registry support for teams

### VS Code Extension Enhancements

- [ ] Component preview panel (see component rendered in extension)
- [ ] IntelliSense for native-mate token values (autocomplete colors, spacing)
- [ ] Inline color swatches for theme tokens
- [ ] "Go to component source" from imports
- [ ] Theme switcher in status bar
- [ ] Snippet generation for installed components
- [ ] Component tree view in sidebar

### MCP Server Enhancements

- [ ] **install_component** — AI can install components directly (not just get_add_command)
- [ ] **scaffold_screen** — AI generates full screens using installed components
- [ ] **suggest_components** — AI analyzes code and suggests relevant components
- [ ] **generate_form** — AI builds a form from a schema using native-mate inputs
- [ ] **explain_component** — AI explains component API with examples
- [ ] **debug_theme** — AI helps debug theme/styling issues

---

## Phase 8 — Platform & Ecosystem

### Platform-Adaptive Components

- [ ] iOS-native feel variants (SF Symbols, system fonts, iOS blur)
- [ ] Android Material You variants (dynamic color, Material 3 shapes)
- [ ] `<Adaptive>` wrapper — automatically picks iOS or Android variant
- [ ] Web support via react-native-web for universal apps

### Accessibility

- [ ] Full WCAG 2.1 AA compliance across all components
- [ ] Screen reader announcements built into every interactive component
- [ ] Reduce motion support (respect system setting, provide static fallbacks)
- [ ] Dynamic type / font scaling support
- [ ] High contrast mode
- [ ] Focus trap management for modals/sheets
- [ ] **`native-mate a11y-audit`** — CLI command to check accessibility in installed components

### Testing Utilities (`native-mate add test:button`)

- [ ] Pre-written test files for every component (Jest + RNTL)
- [ ] Snapshot tests
- [ ] Interaction tests (press, swipe, type)
- [ ] Accessibility tests
- [ ] Theme compliance tests
- [ ] **`native-mate test`** — Run tests for installed components

### Documentation Site Enhancements

- [ ] Interactive playground — edit component props live in browser
- [ ] Copy-paste code snippets with theme-aware previews
- [ ] Component comparison tool (show variants side by side)
- [ ] AI chatbot on docs site powered by MCP (ask questions, get code)
- [ ] Expo Snack embeds — run components directly in browser
- [ ] Contribution guide + component authoring docs
- [ ] Changelog page auto-generated from registry versions

### Figma Plugin Enhancements

- [ ] Bidirectional sync — Figma changes update code, code changes update Figma
- [ ] Auto-generate Figma components from registry
- [ ] Token sync — push native-mate tokens to Figma variables
- [ ] Design handoff — developers see exact component name + props from Figma selection

---

## Phase 9 — Blocks (Multi-Component Patterns)

Pre-composed combinations of 2-5 components that form common UI patterns.

### Form Blocks

- [ ] **block:login-form** — Email + password inputs, submit button, forgot link
- [ ] **block:signup-form** — Name + email + password + confirm + terms
- [ ] **block:contact-form** — Name + email + message textarea + submit
- [ ] **block:search-filter** — Search bar + chip filters + sort dropdown
- [ ] **block:address-form** — Street, city, state, zip with autocomplete
- [ ] **block:credit-card-form** — Card number, expiry, CVV with formatting

### List Blocks

- [ ] **block:settings-list** — Section header + list items with toggles/chevrons
- [ ] **block:notification-list** — Notification cards with swipe actions
- [ ] **block:chat-list** — Conversation rows with avatars and badges
- [ ] **block:product-grid** — Product cards in responsive grid
- [ ] **block:user-list** — User rows with avatar, name, action button

### Content Blocks

- [ ] **block:hero-banner** — Full-width image/gradient with title and CTA
- [ ] **block:stats-row** — 3-4 stat cards in a horizontal row
- [ ] **block:feature-grid** — Icon + title + description feature cards
- [ ] **block:testimonial** — Quote with avatar and name
- [ ] **block:pricing-table** — Side-by-side pricing cards with highlight
- [ ] **block:faq** — Accordion-based FAQ section

### Navigation Blocks

- [ ] **block:tab-header** — Header with back button + centered tabs
- [ ] **block:profile-header** — Avatar + name + stats + follow/edit button
- [ ] **block:bottom-nav** — Bottom bar with 4-5 items + FAB center
- [ ] **block:drawer-menu** — Side drawer with avatar, nav items, logout

---

## Progress Summary

| Phase | Status | Components | Showcase Screens |
|---|---|---|---|
| Phase 1 — Core Essentials | ✅ Complete | 16 shipped | 3 screens |
| Phase 2 — App Patterns | ✅ Complete | 15 shipped | 3 screens |
| Phase 3 — Domain-Specific | ✅ Complete | 21 shipped | 3 screens |
| Phase 4 — Hooks | Planned | 56 hooks | — |
| Phase 5 — Screens | Planned | 31 screens | — |
| Phase 6 — Animations | Planned | 29 presets | — |
| Phase 7 — CLI & Tooling | Planned | 14 CLI commands + extensions | — |
| Phase 8 — Platform & Ecosystem | Planned | a11y, adaptive, tests, docs | — |
| Phase 9 — Blocks | Planned | 21 blocks | — |

### What's Done

- **80 components** in the registry (28 v1 + 52 new)
- **9 new showcase screens** in the example app (15 total)
- **~18,000+ lines** of new component code
- Every component: spring animations, haptics, accessibility, iOS + Android handling
- All code on `mate/v2` branch with clean, meaningful commits

### What's Next

- 8 new theme presets (ocean, forest, sunset, lavender, monochrome, neon, pastel, corporate)
- Token system expansion (fonts, borders, opacity, z-index, gradients, component-level tokens)
- Hooks library (56 hooks)
- Ready-made screens (31 screens)
- Animation presets (29 animations)
- CLI superpowers (doctor, diff, migrate, create, theme export)
- Blocks (21 multi-component patterns)

---

## Totals

| Phase | Components | Hooks | Screens | Animations | Blocks | Themes |
|---|---|---|---|---|---|---|
| v1 (shipped) | 28 | 0 | 0 | 0 | 0 | 4 |
| Phase 1 ✅ | +16 | — | — | — | — | +4 planned |
| Phase 2 ✅ | +15 | — | — | — | — | +2 planned |
| Phase 3 ✅ | +21 | — | — | — | — | +2 planned |
| Phase 4 | — | +56 | — | — | — | — |
| Phase 5 | — | — | +31 | — | — | — |
| Phase 6 | — | — | — | +29 | — | — |
| Phase 7 | CLI, VS Code, MCP, Registry upgrades | | | | | |
| Phase 8 | Platform-adaptive, a11y, testing, docs, Figma | | | | | |
| Phase 9 | — | — | — | — | +21 | — |
| **v2 Total** | **80** | **56** | **31** | **29** | **21** | **12** |

### Grand Total: **217 installable items** + massive tooling upgrades

---

## What Makes This Better Than shadcn

| Feature | shadcn/ui | native-mate v2 |
|---|---|---|
| Platform | Web only | Mobile-first (iOS + Android + Web) |
| Components | ~50 | 80 (shipped) |
| Hooks | 0 | 56 (planned) |
| Ready-made screens | 0 | 31 (planned) |
| Animation presets | 0 | 29 (planned) |
| Blocks (patterns) | ~12 | 21 (planned) |
| Themes | 1 (+ manual) | 12 presets (4 shipped, 8 planned) |
| CLI commands | 3 (init, add, diff) | 14 (4 shipped, 10 planned) |
| AI integration | 0 | MCP server + VS Code + Cursor (shipped) |
| Figma integration | 0 | Full plugin with token sync (shipped) |
| Platform-adaptive | N/A | iOS + Android native feel (planned) |
| Accessibility audit | 0 | Built-in CLI audit (planned) |
| Testing utilities | 0 | Pre-written tests for all components (planned) |
| Documentation | Good | Interactive playground + AI chatbot + Expo Snack (planned) |
