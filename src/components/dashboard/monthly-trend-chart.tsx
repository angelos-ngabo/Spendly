import { BarChart3 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltipContent, type ChartTooltipPayloadEntry } from '@/components/dashboard/chart-tooltip'
import { EmptyState } from '@/components/shared/empty-state'
import type { MonthlyPoint } from '@/types/transaction'
import { formatMonthYear } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthlyTrendChart({
  data,
  appearance = 'default',
}: {
  data: MonthlyPoint[]
  appearance?: 'default' | 'datapharma'
}) {
  const rows = data.slice(-10).map((d) => ({
    ...d,
    label: formatMonthYear(d.month),
  }))

  const pharma = appearance === 'datapharma'

  return (
    <Card
      className={cn(
        'h-full overflow-hidden transition-shadow duration-300',
        pharma
          ? 'border-[#E8ECEF] bg-white shadow-[0_2px_16px_rgba(49,138,150,0.07)] hover:shadow-[0_6px_24px_rgba(49,138,150,0.1)] dark:border-border dark:bg-card dark:shadow-md'
          : 'border-border/50 shadow-md shadow-black/[0.04] hover:shadow-lg dark:shadow-black/25',
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle
          className={cn('text-lg font-semibold tracking-tight', pharma && 'text-[#313131] dark:text-foreground')}
        >
          Monthly cash flow
        </CardTitle>
        <CardDescription className={cn('text-sm leading-relaxed', pharma && 'text-[#718096] dark:text-muted-foreground')}>
          Income versus expenses by month
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[280px] px-1 pb-6 pt-1 sm:px-2">
        {rows.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rows} margin={{ top: 12, right: 8, left: -8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} opacity={0.85} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
                width={40}
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.35 }}
                content={(props) => (
                  <ChartTooltipContent
                    active={props.active}
                    payload={props.payload as readonly ChartTooltipPayloadEntry[] | undefined}
                    label={typeof props.label === 'string' ? props.label : undefined}
                  />
                )}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="var(--chart-3)"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill="var(--chart-5)"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            className="min-h-[260px] border-0 bg-transparent py-12 shadow-none md:py-14"
            icon={BarChart3}
            title="Not enough history yet"
            description="Once you have transactions across different months, this chart highlights how income and spending trend together."
          />
        )}
      </CardContent>
    </Card>
  )
}
