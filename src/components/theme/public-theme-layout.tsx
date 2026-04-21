import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

/**
 * Marketing / auth routes: always light so the public site is not tied to workspace dark mode.
 */
export function PublicThemeLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      storageKey="spendly-public-marketing"
    >
      <Outlet />
    </ThemeProvider>
  )
}
