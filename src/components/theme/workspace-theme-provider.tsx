import { useMemo, type ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuth } from '@/context/auth-context'

/**
 * /app workspace: appearance is isolated from the public marketing site.
 * Signed-in users get their own localStorage key per account; toggles also persist `colorMode` to Firestore.
 * Guests use a separate guest storage key.
 */
export function WorkspaceThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const storageKey = useMemo(
    () => (user?.uid ? `spendly-theme-u-${user.uid}` : 'spendly-theme-guest'),
    [user?.uid],
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey={storageKey}>
      {children}
    </ThemeProvider>
  )
}
