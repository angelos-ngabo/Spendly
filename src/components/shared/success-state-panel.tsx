import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SuccessStatePanel({
  icon,
  title,
  subtitle,
  children,
  className,
}: {
  icon: ReactNode
  title: string
  subtitle: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'spendly-animate-enter mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-10 text-center shadow-lg shadow-black/[0.04] sm:px-10 sm:py-12 dark:shadow-black/30',
        className,
      )}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
        {icon}
      </div>
      <h1 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
      <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
        {subtitle}
      </p>
      {children ? <div className="mt-8 w-full max-w-xs">{children}</div> : null}
    </div>
  )
}
