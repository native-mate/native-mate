import Link from 'next/link'
import { Nav } from '@/components/Nav'

const components = [
  // Primitives
  { name: 'Button', slug: 'button', category: 'Primitives', description: 'Tap interactions with variants, loading state, and icons.' },
  { name: 'Text', slug: 'text', category: 'Primitives', description: 'Typed typography with size, weight, and color tokens.' },
  { name: 'Icon', slug: 'icon', category: 'Primitives', description: 'SVG icon wrapper with size and color from tokens.' },
  { name: 'Spinner', slug: 'spinner', category: 'Primitives', description: 'Animated loading indicator in three sizes.' },
  { name: 'Separator', slug: 'separator', category: 'Primitives', description: 'Horizontal or vertical divider line.' },
  // Forms
  { name: 'Input', slug: 'input', category: 'Forms', description: 'Text input with label, error state, and prefix/suffix.' },
  { name: 'Textarea', slug: 'textarea', category: 'Forms', description: 'Auto-growing multi-line text input.' },
  { name: 'Checkbox', slug: 'checkbox', category: 'Forms', description: 'Animated checkbox with indeterminate state.' },
  { name: 'Radio', slug: 'radio', category: 'Forms', description: 'Radio group with animated selection indicator.' },
  { name: 'Switch', slug: 'switch', category: 'Forms', description: 'Toggle switch with smooth Reanimated transition.' },
  { name: 'Slider', slug: 'slider', category: 'Forms', description: 'Range slider with haptic feedback at extremes.' },
  { name: 'Select', slug: 'select', category: 'Forms', description: 'Bottom-sheet select built on Sheet. Searchable.' },
  { name: 'OTP Input', slug: 'otp-input', category: 'Forms', description: 'Shake animation, haptic feedback, smooth focus transitions.' },
  // Layout
  { name: 'Screen', slug: 'screen', category: 'Layout', description: 'Safe-area root wrapper with themed background.' },
  { name: 'Card', slug: 'card', category: 'Layout', description: 'Container with header, content, and footer slots.' },
  { name: 'Accordion', slug: 'accordion', category: 'Layout', description: 'Animated height expansion, single or multi-open.' },
  { name: 'Tabs', slug: 'tabs', category: 'Layout', description: 'Horizontal tabs with sliding indicator animation.' },
  // Display
  { name: 'Badge', slug: 'badge', category: 'Display', description: '5 semantic variants + dot indicator.' },
  { name: 'Avatar', slug: 'avatar', category: 'Display', description: 'Image, initials fallback, status dot, and group stack.' },
  { name: 'Tag', slug: 'tag', category: 'Display', description: 'Compact dismissible label chip.' },
  { name: 'EmptyState', slug: 'empty-state', category: 'Display', description: 'Icon + heading + description + action.' },
  // Overlay
  { name: 'Modal', slug: 'modal', category: 'Overlay', description: 'Animated modal dialog with backdrop dismiss.' },
  { name: 'ActionSheet', slug: 'action-sheet', category: 'Overlay', description: 'iOS-style action sheet built on Sheet.' },
  { name: 'Sheet', slug: 'sheet', category: 'Overlay', description: 'Bottom sheet with snap points and drag-to-close.' },
  // Feedback
  { name: 'Toast', slug: 'toast', category: 'Feedback', description: 'Auto-dismissing notification with success/error/warning.' },
  { name: 'Progress', slug: 'progress', category: 'Feedback', description: 'Linear bar and circular ring variants.' },
  { name: 'SkeletonLoader', slug: 'skeleton', category: 'Feedback', description: 'Shimmer placeholder for loading content.' },
  { name: 'Alert', slug: 'alert', category: 'Feedback', description: 'Info, warning, and destructive alert banners.' },
  { name: 'Cart Item', slug: 'cart-item', category: 'Display', description: 'Shopping cart row with image, quantity stepper, and swipe-to-remove.' },
  { name: 'Payment Card', slug: 'payment-card', category: 'Display', description: 'Credit card display with brand detection, or a validated card input form.' },
  { name: 'Pricing Card', slug: 'pricing-card', category: 'Display', description: 'Subscription plan card with price, feature checklist, popular badge, and CTA.' },
  { name: 'Product Card', slug: 'product-card', category: 'Display', description: 'E-commerce product card with pricing, ratings, favorite toggle, and add-to-cart.' },
  { name: 'Quantity Stepper', slug: 'quantity-stepper', category: 'Forms', description: 'Plus/minus quantity control with bounds, sizes, and long-press rapid increment.' },
  { name: 'Review Card', slug: 'review-card', category: 'Display', description: 'User review card with star rating, expandable text, images, and helpful voting.' },
  { name: 'Stat Card', slug: 'stat-card', category: 'Display', description: 'KPI metric card with animated counter, trend indicator, and skeleton loading.' },
  { name: 'Countdown', slug: 'countdown', category: 'Display', description: 'Countdown timer with animated digit flip and card, inline, or minimal variants.' },
  { name: 'Notification Card', slug: 'notification-card', category: 'Display', description: 'Notification list item with category accent, unread indicator, and swipe dismiss.' },
  { name: 'Chip', slug: 'chip', category: 'Forms', description: 'Selectable chip with animated fill, icon/avatar support, and closable mode.' },
  { name: 'Color Picker', slug: 'color-picker', category: 'Forms', description: 'Color picker with preset swatches, HSL sliders, and hex input.' },
  { name: 'Date Picker', slug: 'date-picker', category: 'Forms', description: 'Calendar and time picker with month navigation and range limits.' },
  { name: 'Mention Input', slug: 'mention-input', category: 'Forms', description: 'Text input with @mention autocomplete and a filterable user dropdown.' },
  { name: 'Phone Input', slug: 'phone-input', category: 'Forms', description: 'International phone input with country picker and auto-formatting.' },
  { name: 'PIN Lock', slug: 'pin-lock', category: 'Forms', description: 'PIN entry screen with animated dots, keypad, shake-on-error, and biometric button.' },
  { name: 'Rating', slug: 'rating', category: 'Forms', description: 'Star rating with spring animation, half-star support, and read-only mode.' },
  { name: 'Search Bar', slug: 'search-bar', category: 'Forms', description: 'Animated search input with slide-in cancel button and suggestions dropdown.' },
  { name: 'Segmented Control', slug: 'segmented-control', category: 'Forms', description: 'iOS-style segmented toggle with an animated sliding pill indicator.' },
  { name: 'Social Login Button', slug: 'social-login-button', category: 'Forms', description: 'Branded Google, Apple, GitHub, Facebook, Twitter, and Discord auth buttons.' },
  { name: 'Toggle Group', slug: 'toggle-group', category: 'Forms', description: 'Segmented toggle with animated indicator for single or multiple selection.' },
  { name: 'Stepper', slug: 'stepper', category: 'Forms', description: 'Multi-step progress indicator with animated connecting lines.' },
  { name: 'File Upload', slug: 'file-upload', category: 'Forms', description: 'File/image picker with dropzone, previews, and progress bars.' },
  { name: 'Draggable List', slug: 'draggable-list', category: 'Interaction', description: 'Long-press drag-to-reorder list with shadow lift and spring animations.' },
  { name: 'Swipeable Row', slug: 'swipeable-row', category: 'Interaction', description: 'Swipe-to-reveal action row with spring physics and full-swipe delete.' },
  { name: 'FAB', slug: 'fab', category: 'Navigation', description: 'Floating action button with speed-dial fan-out and extended label mode.' },
  { name: 'Speed Dial', slug: 'speed-dial', category: 'Navigation', description: 'FAB speed dial with rotating icon, staggered actions, and backdrop dismiss.' },
  { name: 'Audio Player', slug: 'audio-player', category: 'Display', description: 'Play/pause audio player with progress bar, artwork, and a compact mode.' },
  { name: 'Banner', slug: 'banner', category: 'Feedback', description: 'Slide-in banner with info/warning/success/error variants and auto-dismiss.' },
  { name: 'Carousel', slug: 'carousel', category: 'Display', description: 'Snap-scrolling carousel with animated pagination dots and auto-play.' },
  { name: 'Chat Bubble', slug: 'chat-bubble', category: 'Display', description: 'Message bubble with sender alignment, delivery status, and avatar support.' },
  { name: 'Comment', slug: 'comment', category: 'Display', description: 'Threaded comment with nested replies, like/reply actions, and relative timestamps.' },
  { name: 'Data Table', slug: 'data-table', category: 'Display', description: 'Sortable data table with sticky header, striped rows, and loading skeletons.' },
  { name: 'Image', slug: 'image', category: 'Display', description: 'Image with fade-in loading, shimmer/blur placeholders, and fallback source.' },
  { name: 'List Item', slug: 'list-item', category: 'Display', description: 'Universal list row with leading/trailing slots, divider, and destructive style.' },
  { name: 'Markdown', slug: 'markdown', category: 'Display', description: 'Lightweight markdown renderer for headings, lists, links, and code blocks.' },
  { name: 'Timeline', slug: 'timeline', category: 'Display', description: 'Vertical status timeline with animated entrance and connecting lines.' },
  { name: 'Video Player', slug: 'video-player', category: 'Display', description: 'Inline video player with animated controls, progress bar, and poster state.' },
  { name: 'Reaction Bar', slug: 'reaction-bar', category: 'Display', description: 'Emoji reaction pills with counts, reacted state, and overflow handling.' },
  { name: 'Divider Label', slug: 'divider-label', category: 'Layout', description: 'Horizontal divider with a centered or aligned text label.' },
  { name: 'Biometric Prompt', slug: 'biometric-prompt', category: 'Overlay', description: 'Full-screen biometric authentication modal with success/error states.' },
  { name: 'Bottom Sheet List', slug: 'bottom-sheet-list', category: 'Overlay', description: 'Searchable single/multi-select list presented in a bottom sheet.' },
  { name: 'Dialog', slug: 'dialog', category: 'Overlay', description: 'Centered confirm/cancel dialog with destructive variant and icon support.' },
  { name: 'Dropdown Menu', slug: 'dropdown-menu', category: 'Overlay', description: 'Anchored context menu with icons, dividers, and destructive items.' },
  { name: 'Popover', slug: 'popover', category: 'Overlay', description: 'Anchored popover with arrow, auto-flip positioning, and scrollable content.' },
  { name: 'Bottom Bar', slug: 'bottom-bar', category: 'Navigation', description: 'Animated bottom tab bar with sliding indicator, badges, and haptics.' },
  { name: 'Breadcrumb', slug: 'breadcrumb', category: 'Navigation', description: 'Navigation path trail with separators, icons, and middle truncation.' },
  { name: 'Header', slug: 'header', category: 'Navigation', description: 'Custom nav header with collapsing large title, transparent mode, and safe area support.' },
  { name: 'Collapsible', slug: 'collapsible', category: 'Layout', description: 'Expand/collapse section with animated height and rotating chevron.' },
  { name: 'Onboarding Screen', slug: 'onboarding-screen', category: 'Layout', description: 'Full-screen onboarding slide with animated dots and next/skip controls.' },
  { name: 'Infinite Scroll', slug: 'infinite-scroll', category: 'Layout', description: 'FlatList wrapper with load-more triggers, footer spinner, and empty state.' },
  { name: 'Pull to Refresh', slug: 'pull-to-refresh', category: 'Feedback', description: 'Custom pull-to-refresh gesture with animated progress arc and haptics.' },
  { name: 'Tooltip', slug: 'tooltip', category: 'Overlay', description: 'Hover/long-press tooltip with auto-positioning, arrow, and rich content.' },
]

const categories = ['Primitives', 'Forms', 'Layout', 'Display', 'Overlay', 'Feedback', 'Navigation', 'Interaction']

const categoryColor: Record<string, string> = {
  Primitives: 'text-blue-400 bg-blue-900/30',
  Forms: 'text-purple-400 bg-purple-900/30',
  Layout: 'text-green-400 bg-green-900/30',
  Display: 'text-amber-400 bg-amber-900/30',
  Overlay: 'text-red-400 bg-red-900/30',
  Feedback: 'text-cyan-400 bg-cyan-900/30',
  Navigation: 'text-pink-400 bg-pink-900/30',
  Interaction: 'text-teal-400 bg-teal-900/30',
}

export const metadata = {
  title: 'Components — native-mate',
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 pt-20 sm:pt-20">
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Components</h1>
        <p className="mb-8 sm:mb-10 text-zinc-400">80 production-ready components. Click any to see docs and usage.</p>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">{cat}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {components
                .filter((c) => c.category === cat)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/components/${c.slug}`}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-600 hover:bg-zinc-800/60"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-zinc-50">{c.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColor[cat]}`}>{cat}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">{c.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
