import { ArrowUpRight, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_BASE } from '@/components/layout/nav'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { formatDisplayDate } from '@/lib/format'
import type { Transaction } from '@/types/transaction'
import { cn } from '@/lib/utils'

export function RecentTransactions({
  items,
  onEdit,
  onAdd,
  appearance = 'default',
}: {
  items: Transaction[]
  onEdit: (t: Transaction) => void
  onAdd?: () => void
  appearance?: 'default' | 'datapharma'
}) {
  const { formatMoney } = useMoneyFormat()
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
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div>
          <CardTitle
            className={cn('text-lg font-semibold tracking-tight', pharma && 'text-[#313131] dark:text-foreground')}
          >
            Recent activity
          </CardTitle>
          <CardDescription className={cn('text-sm leading-relaxed', pharma && 'text-[#718096] dark:text-muted-foreground')}>
            Latest updates across your ledger
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="hidden rounded-xl sm:inline-flex">
          <Link to={`${APP_BASE}/transactions`}>
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onEdit(t)}
              className={cn(
                'flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-3.5 text-left shadow-sm transition-all duration-200 sm:py-3',
                pharma
                  ? 'border-[#EEF2F5] bg-[#FAFBFC] hover:border-[#E2E8F0] hover:bg-[#F4F8F8] hover:shadow-sm dark:border-border/60 dark:bg-muted/30 dark:hover:bg-muted/50'
                  : 'border-border/50 bg-background/50 hover:border-border hover:bg-muted/50 hover:shadow-md',
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="truncate font-medium">{t.title}</div>
                  <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                    {t.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                  <CategoryBadge category={t.category} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{formatDisplayDate(t.date)}</div>
              </div>
              <div
                className={cn(
                  'shrink-0 text-sm font-semibold tabular-nums',
                  t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                )}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatMoney(t.amount)}
              </div>
            </button>
          ))
        ) : (
          <EmptyState
            className="min-h-[200px] border-0 bg-transparent py-10 shadow-none md:py-12"
            icon={Inbox}
            title="No recent activity"
            description="Add a transaction to populate this feed. In guest mode, you can load sample data from the dashboard welcome card."
            action={
              onAdd ? (
                <Button type="button" className="rounded-xl" onClick={onAdd}>
                  Add transaction
                </Button>
              ) : undefined
            }
          />
        )}
        <Button asChild variant="outline" className="w-full rounded-xl sm:hidden">
          <Link to={`${APP_BASE}/transactions`}>Go to transactions</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
