import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCurrency } from '@/components/shared/animated-currency'

const accentClass: Record<
  'default' | 'income' | 'expense' | 'balance' | 'muted' | 'savings',
  string
> = {
  default:
    'border-border/50 bg-card shadow-sm shadow-black/[0.03] dark:shadow-black/20 transition-shadow duration-300 hover:shadow-md hover:shadow-black/[0.06] dark:hover:shadow-black/30',
  income:
    'border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.07] via-card to-card shadow-sm shadow-emerald-900/[0.04] transition-shadow duration-300 hover:shadow-md',
  expense:
    'border-rose-500/12 bg-gradient-to-br from-rose-500/[0.06] via-card to-card shadow-sm shadow-rose-900/[0.03] transition-shadow duration-300 hover:shadow-md',
  balance:
    'border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-card shadow-sm shadow-primary/10 transition-shadow duration-300 hover:shadow-md',
  muted:
    'border-border/40 bg-muted/25 shadow-sm transition-shadow duration-300 hover:shadow-md',
  savings:
    'border-amber-400/25 bg-gradient-to-br from-amber-400/[0.12] via-card to-card shadow-sm shadow-amber-900/[0.04] transition-shadow duration-300 hover:shadow-md',
}

/** DataPharma-style elevated white tiles (community file kX65zNBWVX4gqIyA8aEJxV) */
const panelSurface =
  'border-[#E8ECEF] bg-white shadow-[0_2px_16px_rgba(49,138,150,0.07)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(49,138,150,0.12)] dark:border-border dark:bg-card dark:shadow-md'

export function StatCard({
  title,
  hint,
  className,
  icon: Icon,
  accent = 'default',
  surface = 'default',
  amount,
  value,
}: {
  title: string
  hint?: string
  className?: string
  icon?: LucideIcon
  accent?: keyof typeof accentClass
  /** `panel` = DataPharma-like white metric cards */
  surface?: 'default' | 'panel'
  amount?: number
  value?: string
}) {
  const main =
    typeof amount === 'number' ? (
      <AnimatedCurrency
        value={amount}
        className={cn(
          'text-2xl font-semibold tracking-tight md:text-[1.65rem]',
          surface === 'panel' && 'text-[#2D3748] dark:text-foreground',
        )}
      />
    ) : (
      <div
        className={cn(
          'text-2xl font-semibold tracking-tight md:text-[1.65rem]',
          surface === 'panel' && 'text-[#2D3748] dark:text-foreground',
        )}
      >
        {value ?? '—'}
      </div>
    )

  const shell = surface === 'panel' ? panelSurface : accentClass[accent]

  const iconWrap =
    surface === 'panel'
      ? 'rounded-xl bg-[#F2F5F5] text-[#318A96] ring-1 ring-[#318A96]/15 dark:bg-muted dark:text-primary'
      : 'rounded-xl bg-background/80 text-primary shadow-inner ring-1 ring-border/50 dark:bg-card/60'

  return (
    <div
      className={cn(
        'relative min-w-0 overflow-hidden rounded-2xl border p-5 text-foreground md:p-6',
        shell,
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p
            className={cn(
              'text-xs font-medium tracking-tight text-muted-foreground',
              surface === 'panel' && 'font-semibold text-[#718096] dark:text-muted-foreground',
            )}
          >
            {title}
          </p>
          {main}
          {hint ? (
            <p
              className={cn(
                'pt-1 text-xs leading-relaxed text-muted-foreground',
                surface === 'panel' && 'text-[#718096] dark:text-muted-foreground',
              )}
            >
              {hint}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center', iconWrap)}>
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
