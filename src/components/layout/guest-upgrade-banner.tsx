import { Cloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export function GuestUpgradeBanner() {
  const { guestSession, firebaseEnabled, firebaseMissingEnvVars } = useAuth()

  if (!guestSession) return null

  return (
    <div
      className={cn(
        'mb-8 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-card via-card to-primary/[0.04] p-1 shadow-sm',
        firebaseEnabled && 'from-card via-primary/[0.03] to-card',
      )}
    >
      <div className="flex flex-col gap-4 rounded-[0.9rem] bg-card/80 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Cloud className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight text-foreground">Browsing as a guest</div>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Data stays on this device. Create a free account to sync privately across devices with Firebase.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          {firebaseEnabled ? (
            <>
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/sign-up">Create account</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link to="/sign-in">Sign in</Link>
              </Button>
            </>
          ) : (
            <div className="max-w-md text-xs leading-relaxed text-muted-foreground">
              <p>
                Add six <code className="rounded bg-muted px-1 font-mono text-[10px]">VITE_FIREBASE_*</code>{' '}
                variables to <code className="rounded bg-muted px-1 font-mono text-[10px]">.env</code> in the
                project root, then restart <code className="rounded bg-muted px-1 font-mono text-[10px]">npm run dev</code>.
              </p>
              {firebaseMissingEnvVars.length > 0 ? (
                <p className="mt-1.5 break-words font-mono text-[10px] text-foreground/80">
                  Missing: {firebaseMissingEnvVars.join(', ')}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
