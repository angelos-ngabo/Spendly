import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AuthCard({
  title,
  description,
  children,
  className,
  variant = 'plain',
  preTitle,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
  /** `plain` matches Figma (no elevated card). `elevated` keeps a subtle panel for dense forms. */
  variant?: 'plain' | 'elevated'
  /** e.g. waving-hand emoji block */
  preTitle?: ReactNode
}) {
  const shell =
    variant === 'elevated'
      ? 'rounded-3xl border border-border/50 bg-card p-6 shadow-lg shadow-primary/[0.04] sm:p-8 dark:shadow-black/25'
      : 'p-0'

  return (
    <div className={cn('w-full overflow-hidden', shell, className)}>
      <div className={cn('flex flex-col', variant === 'plain' ? 'gap-3 pb-2' : 'space-y-2 pb-6')}>
        {preTitle ? <div className="flex h-9 w-9 items-center justify-center text-2xl leading-none">{preTitle}</div> : null}
        <h1
          className={cn(
            'font-bold tracking-tight text-foreground',
            variant === 'plain' ? 'text-[1.75rem] leading-tight sm:text-[2rem]' : 'text-[1.65rem] leading-tight',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
