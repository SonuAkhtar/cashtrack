# CashTrack

A Progressive Web App for tracking money you lend to other people. Built mobile-first with Next.js (App Router), TypeScript, CSS Modules, Framer Motion, Recharts, and Zustand.

## Highlights

- Fintech-style UI with dark and light themes
- Full PWA structure (manifest, icons folder, service worker via `next-pwa`)
- Mobile-first, scales to tablet and desktop
- Animated dashboard, analytics, repayment timelines, charts
- Centralized design tokens (`styles/tokens.css` + `styles/theme.ts`)
- CSS Modules using the `block_element-modifier` naming convention
- Zustand stores for ledger and preferences (ready for backend integration)

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- CSS Modules only (no Tailwind, no styled-components)
- Framer Motion for page, card, list, modal animations
- Recharts for area, donut, and bar charts
- React Icons (`hi2` set), no emojis
- Zustand for state, `date-fns` for dates
- `next-pwa` for PWA / service worker

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Available Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run start`: start production server
- `npm run type-check`: TypeScript type checking

## Project Structure

```
app/                       Next.js App Router pages
  layout.tsx               Root layout (fonts, theme, AppShell)
  page.tsx                 Dashboard
  people/                  People list and detail
  transactions/[id]/       Transaction detail
  add/                     Add / edit entry
  analytics/               Analytics
  settings/                Settings
components/                One folder per component: <Name>/<Name>.tsx + <Name>.module.css
  AppShell/                TopBar/                BottomNavigation/
  Avatar/                  Badge/                 Button/
  Card/                    Divider/               EmptyState/
  ProgressBar/             SectionHeader/         SegmentedControl/
  Toggle/                  TextField/             TextArea/
  Modal/                   ConfirmDialog/
  StatCard/                BorrowerCard/          TransactionRow/
  ChartLegend/             MonthlyTrendChart/     CategoryDonutChart/
  BorrowerComparisonChart/ RecoveryGauge/
features/                  One folder per feature view
  DashboardView/           PeopleListView/        BorrowerDetailView/
  TransactionDetailView/   EntryFormView/         AnalyticsView/
  SettingsView/
  selectors.ts             Shared transaction/borrower selectors
store/                     Zustand stores (ledger, preferences)
hooks/                     useHasMounted, useThemeSync
utils/                     format, date, id, currency
lib/                       constants (status / category labels)
styles/                    tokens.css, globals.css, theme.ts,
                           chart.module.css, chartTheme.ts
data/                      Mock data (borrowers, transactions, repayments)
types/                     Shared TypeScript types
public/                    manifest.json, icons/
```

## Design System

All visual primitives live in two central files:

- `styles/tokens.css`: CSS variables for color, surface, spacing, type scale, motion, shadows, gradients, themes. Both `[data-theme="dark"]` and `[data-theme="light"]` are defined here.
- `styles/theme.ts`: TypeScript mirror used by Recharts and other JS-driven visuals. Updating chart colors, status palette, breakpoints, or motion easings happens here.

Fonts are loaded via `next/font/google` (Inter, Manrope, Sora) in `app/layout.tsx`.

### CSS Module Naming

All class names follow `block_element-modifier`:

```
dashboard_card-primary
borrower_item-active
navigation_button-active
analytics_chart-large
```

## PWA

- `public/manifest.json`: installable metadata (name, icons, theme color, shortcuts)
- `next.config.mjs`: wires `next-pwa` for service-worker generation in production
- `app/layout.tsx`: viewport, `theme-color`, Apple meta tags
- `public/icons/`: drop in `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

Service worker is disabled in development by default. Build the app to generate `sw.js`.

## State & Backend Readiness

The UI talks to two Zustand stores:

- `store/useLedgerStore.ts`: borrowers, transactions, repayments, with `addTransaction`, `updateTransaction`, `deleteTransaction`, `addRepayment` mutators.
- `store/usePreferencesStore.ts`: theme, currency, notifications, profile.

These are seeded from `data/mock.ts`. To swap in a real backend, replace the seed and wrap mutators with API calls. The component layer does not need to change.

## Accessibility

- Semantic HTML and ARIA labels on nav, dialogs, forms, charts
- Focus-visible outlines via design tokens
- Reduced-motion support (`prefers-reduced-motion`)
- 44px minimum touch targets in primary navigation and buttons
