import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

/**
 * Email verification completion page: respect system light/dark (unlike marketing auth shell).
 */
export function VerifyEmailThemeLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="spendly-verify-email-theme"
    >
      <Outlet />
    </ThemeProvider>
  )
}
