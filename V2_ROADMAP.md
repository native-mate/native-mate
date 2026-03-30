# native-mate v2 Roadmap

> Goal: The most complete, production-ready React Native UI system. Not just components — screens, hooks, animations, CLI superpowers, and AI-native tooling. Make shadcn look like a starter kit.

## Current State (v1)

28 components: accordion, action-sheet, alert, avatar, badge, button, card, checkbox, empty-state, icon, input, modal, otp-input, popover*, progress, radio, screen, select, separator, sheet, skeleton, slider, spinner, switch, tabs, tag, text, textarea, toast, tooltip*

(*coming soon — not yet implemented)

---

## Phase 1 — Core Mobile Essentials

High-impact components every mobile app needs. Ship these first.

### Components

- [ ] **header** — Custom nav header with back button, title, action icons
- [ ] **bottom-bar** — Bottom navigation bar with icons, badges, animated active indicator
- [ ] **fab** — Floating action button (single + speed dial expand)
- [ ] **search-bar** — Animated search input with cancel button and suggestion list
- [ ] **list-item** — List row with leading icon/avatar, title, subtitle, trailing chevron, press state
- [ ] **chip** — Selectable/filterable chip for multi-select tag UIs
- [ ] **toggle-group** — Multi-option toggle (single or multi select mode)
- [ ] **dialog** — Simple confirm/cancel dialog (lighter than modal)
- [ ] **dropdown-menu** — Context menu triggered from a button press
- [ ] **rating** — Star rating display + interactive input (tap or swipe)
- [ ] **banner** — Top/bottom app banner for announcements, offline status, promos
- [ ] **image** — Cached image with placeholder, blur hash, error fallback
- [ ] **carousel** — Horizontal swipeable image/card carousel with pagination dots
- [ ] **divider-label** — "OR" style divider / section header with line
- [ ] **tooltip** — Finish existing planned component
- [ ] **popover** — Finish existing planned component

### Themes

- [ ] **ocean** — Deep blue tones, calm (fintech, health)
- [ ] **forest** — Green earth tones (sustainability, wellness)
- [ ] **sunset** — Warm orange/amber (social, creative)
- [ ] **lavender** — Purple/violet (modern, gen-z)

### Customization

- [ ] Custom font family support in token system
- [ ] Border width tokens (hairline, thin, medium, thick)
- [ ] Opacity tokens (disabled, hover, backdrop)

---

## Phase 2 — Common App Patterns

Components for standard app flows: onboarding, settings, notifications.

### Components

- [ ] **swipeable-row** — Swipe-to-delete / swipe-to-archive list actions
- [ ] **stepper** — Multi-step wizard / onboarding flow progress indicator
- [ ] **segmented-control** — iOS-style segmented toggle (distinct from tabs)
- [ ] **date-picker** — Date and time selection
- [ ] **phone-input** — International phone number input with country code picker
- [ ] **notification-card** — In-app notification item with icon, timestamp, read/unread state
- [ ] **chat-bubble** — Message bubble (sent/received) with timestamp and delivery status
- [ ] **stat-card** — KPI / metric display card with value, label, trend arrow
- [ ] **timeline** — Vertical timeline for order tracking, activity feeds
- [ ] **draggable-list** — Reorderable list with drag handles
- [ ] **countdown** — Countdown timer display (OTP expiry, sales, events)
- [ ] **collapsible** — Simple expand/collapse (lighter than accordion)
- [ ] **pull-to-refresh** — Custom pull-to-refresh indicator
- [ ] **infinite-scroll** — Load-more trigger at list bottom
- [ ] **bottom-sheet-list** — Pre-built bottom sheet with searchable list

### Themes

- [ ] **monochrome** — Pure black & white, high contrast (minimal, luxury)
- [ ] **neon** — Bright accents on dark background (gaming, music)

### Customization

- [ ] Z-index tokens for consistent layering
- [ ] Gradient presets per theme
- [ ] Semantic component tokens (card.background, input.border, button.primary)

---

## Phase 3 — Domain-Specific

Components for specific app types: e-commerce, auth, social, media.

### Components

- [ ] **product-card** — Product image, price, rating, add-to-cart button
- [ ] **cart-item** — Cart row with image, quantity stepper, remove button
- [ ] **quantity-stepper** — +/- increment control
- [ ] **pricing-card** — Subscription / plan pricing display with feature list
- [ ] **payment-card** — Credit card display and input form
- [ ] **review-card** — User review with avatar, stars, text, date
- [ ] **onboarding-screen** — Full-screen onboarding slide with image, title, description, CTA
- [ ] **pin-lock** — PIN / passcode entry screen (banking apps)
- [ ] **biometric-prompt** — Face ID / fingerprint trigger UI
- [ ] **social-login-button** — Google / Apple / GitHub sign-in with brand colors
- [ ] **video-player** — Inline video player with controls
- [ ] **audio-player** — Mini audio player bar
- [ ] **file-upload** — File/image picker with preview and upload progress
- [ ] **markdown** — Render markdown content (chat, docs, notes)
- [ ] **comment** — Comment thread with avatar, timestamp, reply action
- [ ] **mention-input** — Text input with @mention autocomplete
- [ ] **reaction-bar** — Emoji reaction row (Slack / iMessage style)
- [ ] **color-picker** — Color selection input
- [ ] **speed-dial** — FAB that expands into multiple action buttons
- [ ] **breadcrumb** — Nested navigation path indicator
- [ ] **data-table** — Sortable, scrollable data table

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

## Totals

| Phase | Components | Hooks | Screens | Animations | Blocks | Themes |
|---|---|---|---|---|---|---|
| v1 (current) | 28 | 0 | 0 | 0 | 0 | 4 |
| Phase 1 | +16 | — | — | — | — | +4 |
| Phase 2 | +15 | — | — | — | — | +2 |
| Phase 3 | +21 | — | — | — | — | +2 |
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
| Components | ~50 | 80 |
| Hooks | 0 | 56 |
| Ready-made screens | 0 | 31 |
| Animation presets | 0 | 29 |
| Blocks (patterns) | ~12 | 21 |
| Themes | 1 (+ manual) | 12 presets |
| CLI commands | 3 (init, add, diff) | 14 |
| AI integration | 0 | MCP server + VS Code + Cursor |
| Figma integration | 0 | Full plugin with token sync |
| Platform-adaptive | N/A | iOS + Android native feel |
| Accessibility audit | 0 | Built-in CLI audit |
| Testing utilities | 0 | Pre-written tests for all components |
| Documentation | Good | Interactive playground + AI chatbot + Expo Snack |
