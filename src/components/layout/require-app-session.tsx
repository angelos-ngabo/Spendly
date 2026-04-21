import { Loader2 } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LANDING_PATH, SIGN_IN_PATH } from '@/components/layout/nav'
import { useAuth } from '@/context/auth-context'
import { userMayAccessWorkspace } from '@/lib/auth-access'
import { readGuestSessionFlag } from '@/lib/guest-storage'

export function RequireAppSession() {
  const { user, guestSession, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Preparing your workspace…
        </div>
      </div>
    )
  }

  const guestFromStorage = readGuestSessionFlag()

  if (userMayAccessWorkspace(user, guestSession, guestFromStorage)) {
    return <Outlet />
  }

  if (user && !user.emailVerified) {
    return (
      <Navigate
        to={SIGN_IN_PATH}
        replace
        state={{ from: location.pathname, reason: 'email-not-verified' }}
      />
    )
  }

  return <Navigate to={LANDING_PATH} replace state={{ from: location.pathname }} />
}
