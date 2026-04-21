import { BarChart3, Cloud, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'Secure & Private' },
  { icon: BarChart3, title: 'Smart Insights' },
  { icon: Cloud, title: 'Sync Everywhere' },
] as const

export function AuthSupportingHighlights({
  className,
  density = 'comfortable',
}: {
  className?: string
  /** `compact` fits under dense sign-up forms on one desktop screen. */
  density?: 'comfortable' | 'compact'
}) {
  if (density === 'compact') {
    return (
      <ul
        className={cn(
          'grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-4',
          'rounded-2xl border border-border/45 bg-muted/25 p-3 shadow-md shadow-primary/[0.04] sm:p-4',
          className,
        )}
      >
        {HIGHLIGHTS.map(({ icon: Icon, title }) => (
          <li
            key={title}
            className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-border/30 bg-background/80 px-2.5 py-3 text-center shadow-sm sm:gap-2.5 sm:px-3 sm:py-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 shrink-0 sm:h-[1.15rem] sm:w-[1.15rem]" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-[0.6875rem] font-bold leading-snug text-foreground sm:text-xs">{title}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul
      className={cn(
        'grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4 md:gap-5',
        className,
      )}
    >
      {HIGHLIGHTS.map(({ icon: Icon, title }) => (
        <li
          key={title}
          className={cn(
            'flex w-full min-w-0 flex-col items-center gap-2.5 rounded-2xl border border-border/45 bg-card/90 p-4 text-center shadow-md shadow-black/[0.06] ring-1 ring-black/[0.02] backdrop-blur-sm',
            'sm:gap-3 sm:p-5 md:p-5',
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary sm:h-11 sm:w-11 md:h-12 md:w-12">
            <Icon className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-sm font-bold leading-tight tracking-tight text-foreground sm:text-[0.9375rem]">
            {title}
          </p>
        </li>
      ))}
    </ul>
  )
}
