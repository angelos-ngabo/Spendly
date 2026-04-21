import { PiggyBank } from 'lucide-react'
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
import { formatMonthYear } from '@/lib/format'
import type { SavingsMonthPoint } from '@/utils/savings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SavingsTrendChart({ data }: { data: SavingsMonthPoint[] }) {
  const rows = data.slice(-12).map((d) => ({
    ...d,
    label: formatMonthYear(d.month),
  }))

  return (
    <Card className="h-full overflow-hidden border-border/50 shadow-md shadow-black/[0.04] transition-shadow duration-300 hover:shadow-lg dark:shadow-black/25">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">Savings over time</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Total amount reserved into savings by month
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
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                width={48}
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                content={(props) => (
                  <ChartTooltipContent
                    active={props.active}
                    payload={props.payload as readonly ChartTooltipPayloadEntry[] | undefined}
                    label={typeof props.label === 'string' ? props.label : undefined}
                  />
                )}
              />
              <Bar
                dataKey="amount"
                name="Reserved"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon={PiggyBank}
            title="No savings history yet"
            description="Reserve savings to see how your allocations trend month to month."
          />
        )}
      </CardContent>
    </Card>
  )
}
