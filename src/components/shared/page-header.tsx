import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  action,
  className,
  eyebrow,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  eyebrow?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between md:pb-10',
        className,
      )}
    >
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-tight text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-[2rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">{action}</div>
      ) : null}
    </div>
  )
}
