import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  action?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 px-6 py-16 text-center shadow-inner md:py-20',
        className,
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-md ring-1 ring-border/60 dark:bg-card/80">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
