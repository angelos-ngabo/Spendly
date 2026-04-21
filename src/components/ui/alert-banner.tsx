import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Variant = 'success' | 'destructive' | 'default'

const variantStyles: Record<Variant, string> = {
  success:
    'border-emerald-500/30 bg-emerald-500/[0.1] text-emerald-950 dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-50',
  destructive:
    'border-destructive/30 bg-destructive/10 text-foreground dark:bg-destructive/20',
  default: 'border-border bg-muted/50 text-foreground',
}

export function AlertBanner({
  variant = 'default',
  message,
  className,
  dismissible = true,
  onDismiss,
  autoHideMs,
}: {
  variant?: Variant
  message: ReactNode
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  /** When set, hides the banner after this many ms (in addition to manual dismiss). */
  autoHideMs?: number
}) {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (!autoHideMs || !onDismiss) return
    const t = window.setTimeout(() => onDismissRef.current?.(), autoHideMs)
    return () => window.clearTimeout(t)
  }, [autoHideMs, onDismiss])

  return (
    <div
      role="status"
      className={cn(
        'spendly-animate-enter flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm',
        variantStyles[variant],
        className,
      )}
    >
      <p className="min-w-0 flex-1 leading-relaxed">{message}</p>
      {dismissible && onDismiss ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-current hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
