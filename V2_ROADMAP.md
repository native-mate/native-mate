# native-mate v2 Roadmap

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

## Totals

| | Components | Themes | Customization |
|---|---|---|---|
| v1 (current) | 28 | 4 | Base token system |
| Phase 1 | +16 | +4 | +3 features |
| Phase 2 | +15 | +2 | +3 features |
| Phase 3 | +21 | +2 | +2 features |
| **v2 Total** | **80** | **12** | Full token + component-level theming |
