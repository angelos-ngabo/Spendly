import { PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  ChartTooltipContent,
  type ChartTooltipPayloadEntry,
} from '@/components/dashboard/chart-tooltip'
import { EmptyState } from '@/components/shared/empty-state'
import type { CategorySlice } from '@/types/transaction'
import { styleForCategory } from '@/data/categoryStyles'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CategoryPieChart({
  data,
  appearance = 'default',
}: {
  data: CategorySlice[]
  appearance?: 'default' | 'datapharma'
}) {
  const chartData = data.slice(0, 8).map((d) => ({
    ...d,
    color: styleForCategory(d.category).chart,
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
          Spending by category
        </CardTitle>
        <CardDescription className={cn('text-sm leading-relaxed', pharma && 'text-[#718096] dark:text-muted-foreground')}>
          Expense totals across your tracked categories
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[280px] px-2 pb-6 pt-1 sm:px-6">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                cursor={false}
                content={(props) => (
                  <ChartTooltipContent
                    active={props.active}
                    payload={props.payload as readonly ChartTooltipPayloadEntry[] | undefined}
                    label={
                      typeof props.label === 'string'
                        ? props.label
                        : (props.payload?.[0] as ChartTooltipPayloadEntry | undefined)?.name
                    }
                  />
                )}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius="22%"
                outerRadius="38%"
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            className="min-h-[260px] border-0 bg-transparent py-12 shadow-none md:py-14"
            icon={PieChartIcon}
            title="No category data yet"
            description="Add a few categorized expenses to see how your spending distributes across categories."
          />
        )}
      </CardContent>
    </Card>
  )
}
