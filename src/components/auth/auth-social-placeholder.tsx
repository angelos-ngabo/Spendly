import { Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Decorative only — matches common e-wallet login templates; no OAuth wired. */
export function AuthSocialPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-border/80 bg-background font-medium shadow-sm"
          disabled
          aria-disabled
        >
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
            G
          </span>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-border/80 bg-background font-medium shadow-sm"
          disabled
          aria-disabled
        >
          <Apple className="mr-2 h-4 w-4" strokeWidth={1.75} aria-hidden />
          Apple
        </Button>
      </div>
      <p className="text-center text-[11px] leading-snug text-muted-foreground">
        Social sign-in is not enabled for Spendly yet. Use email and password.
      </p>
    </div>
  )
}
