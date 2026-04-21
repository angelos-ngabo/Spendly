import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AuthCard({
  title,
  description,
  children,
  className,
  variant = 'plain',
  preTitle,
  /** Tighter header and padding for dense desktop forms (e.g. sign-up). */
  dense = false,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
  /** `plain` matches Figma (no elevated card). `elevated` keeps a subtle panel for dense forms. */
  variant?: 'plain' | 'elevated'
  /** e.g. waving-hand emoji block */
  preTitle?: ReactNode
  dense?: boolean
}) {
  const shell =
    variant === 'elevated'
      ? cn(
          'rounded-3xl border border-border/50 bg-card shadow-lg shadow-primary/[0.04] dark:shadow-black/25',
          dense ? 'p-5 sm:p-6' : 'p-6 sm:p-8',
        )
      : 'p-0'

  return (
    <div className={cn('w-full overflow-hidden', shell, className)}>
      <div
        className={cn(
          'flex flex-col',
          variant === 'plain' ? 'gap-3 pb-2' : dense ? 'space-y-1 pb-3' : 'space-y-2 pb-6',
        )}
      >
        {preTitle ? <div className="flex h-9 w-9 items-center justify-center text-2xl leading-none">{preTitle}</div> : null}
        <h1
          className={cn(
            'font-bold tracking-tight text-foreground',
            variant === 'plain'
              ? 'text-[1.75rem] leading-tight sm:text-[2rem]'
              : dense
                ? 'text-[1.5rem] leading-tight sm:text-[1.55rem]'
                : 'text-[1.65rem] leading-tight',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              'leading-relaxed text-muted-foreground',
              dense ? 'text-xs sm:text-[0.8125rem]' : 'text-sm sm:text-[0.95rem]',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
