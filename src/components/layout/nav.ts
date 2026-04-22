import { BarChart3, LayoutDashboard, List, PiggyBank, Settings } from 'lucide-react'

/** Public marketing / landing (`/`). Use for “Back to home” and post–sign-out — never `APP_BASE`. */
export const LANDING_PATH = '/' as const

/** Primary email sign-up route (aliases exist in `App.tsx`). */
export const SIGN_UP_PATH = '/sign-up' as const

/** Primary sign-in route (aliases exist in `App.tsx`). */
export const SIGN_IN_PATH = '/sign-in' as const

/** Firebase email verification continue URL (must be an authorized domain in Firebase console). */
export const VERIFY_EMAIL_PATH = '/verify-email' as const

/** Password reset request (linked from sign-in). */
export const FORGOT_PASSWORD_PATH = '/forgot-password' as const

/** Firebase password reset handler: email link should land here with `oobCode` (and usually `mode=resetPassword`). */
export const RESET_PASSWORD_PATH = '/reset-password' as const

export const APP_BASE = '/app' as const

export const NAV_ITEMS = [
  { to: `${APP_BASE}`, label: 'Dashboard', icon: LayoutDashboard },
  { to: `${APP_BASE}/transactions`, label: 'Transactions', icon: List },
  { to: `${APP_BASE}/savings`, label: 'Savings', icon: PiggyBank },
  { to: `${APP_BASE}/analytics`, label: 'Analytics', icon: BarChart3 },
  { to: `${APP_BASE}/settings`, label: 'Settings', icon: Settings },
] as const
