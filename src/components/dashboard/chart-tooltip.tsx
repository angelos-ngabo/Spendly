import { useMoneyFormat } from '@/context/currency-preference-context'
import { cn } from '@/lib/utils'

export type ChartTooltipPayloadEntry = {
  name?: string
  value?: number
  dataKey?: string | number
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: {
  active?: boolean
  payload?: readonly ChartTooltipPayloadEntry[]
  label?: string
  className?: string
}) {
  const { formatMoney } = useMoneyFormat()
  if (!active || !payload?.length) return null

  return (
    <div
      className={cn(
        'rounded-xl border border-border/70 bg-popover/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-md',
        className,
      )}
    >
      {label ? <div className="mb-1.5 font-semibold text-foreground">{label}</div> : null}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center justify-between gap-6">
            <span className="text-muted-foreground">{p.name}</span>
            <span className="font-medium tabular-nums text-foreground">
              {formatMoney(Number(p.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
