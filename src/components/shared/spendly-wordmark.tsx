import { Wallet2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LANDING_PATH } from '@/components/layout/nav'
import { cn } from '@/lib/utils'

export function SpendlyWordmark({
  className,
  asLink = true,
}: {
  className?: string
  /** When false, renders a non-interactive brand block (e.g. success pages). */
  asLink?: boolean
}) {
  const inner = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
        <Wallet2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="text-left">
        <div className="text-lg font-bold tracking-tight text-foreground">Spendly</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Personal finance</div>
      </div>
    </>
  )

  if (asLink) {
    return (
      <Link
        to={LANDING_PATH}
        className={cn('inline-flex items-center gap-3 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring', className)}
      >
        {inner}
      </Link>
    )
  }

  return <div className={cn('inline-flex items-center gap-3', className)}>{inner}</div>
}
