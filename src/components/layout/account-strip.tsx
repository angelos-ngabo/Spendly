import { Shield } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export function AccountStrip() {
  const { user, guestSession, displayLabel } = useAuth()
  if (!user || guestSession) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-500/15 bg-gradient-to-r from-emerald-500/[0.06] via-card to-card px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-100">
        <Shield className="h-4 w-4 shrink-0 opacity-80" />
        <span className="font-medium">Cloud sync active</span>
      </div>
      <span className="text-muted-foreground">·</span>
      <span className="truncate font-medium text-foreground">{displayLabel}</span>
      {user.email && user.email !== displayLabel ? (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="truncate text-muted-foreground">{user.email}</span>
        </>
      ) : null}
    </div>
  )
}
