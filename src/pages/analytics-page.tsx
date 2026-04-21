import { FolderKanban, ListOrdered, Loader2, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFinancialSnapshot } from '@/hooks/useFinancialSnapshot'
import { useTransactionSummaries } from '@/hooks/useTransactionSummaries'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'
import { expenseTotalsByCategory } from '@/utils/transactions'

export function AnalyticsPage() {
  const { formatMoney } = useMoneyFormat()
  const { transactions, transactionsLoading, transactionsError } = useTransactions()
  const { savings, savingsLoading, savingsError } = useSavings()
  const { summary, byCategory, trend, topExpense, month } = useTransactionSummaries(transactions)
  const financial = useFinancialSnapshot(transactions, savings)

  const topThree = useMemo(() => expenseTotalsByCategory(transactions).slice(0, 3), [transactions])

  return (
    <div className="w-full space-y-8 text-foreground">
      {transactionsError || savingsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {transactionsError ?? savingsError}
        </div>
      ) : null}
      {transactionsLoading || savingsLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
          <span>Syncing your latest transactions…</span>
        </div>
      ) : null}
      <PageHeader
        title="Analytics"
        description="Understand where money comes from, where it goes, how savings reservations affect spendable cash, and how your habits trend over time."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Highest expense category"
          value={topExpense ? topExpense.category : '—'}
          hint={topExpense ? `${formatMoney(topExpense.amount)} all time` : 'Add expenses to see insights'}
          icon={FolderKanban}
          accent="muted"
        />
        <StatCard
          title="Transactions recorded"
          value={`${summary.count}`}
          hint="Across income and expenses"
          icon={ListOrdered}
          accent="muted"
        />
        <StatCard
          title={`Spending · ${month.label}`}
          amount={month.expense}
          hint="Expenses in the current month"
          icon={TrendingDown}
          accent="expense"
        />
        <StatCard
          title={`Income · ${month.label}`}
          amount={month.income}
          hint="Income in the current month"
          icon={TrendingUp}
          accent="income"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Reserved savings"
          amount={financial.totalSaved}
          hint="Total moved into savings (all time)"
          icon={PiggyBank}
          accent="savings"
        />
        <StatCard
          title="Spendable balance"
          amount={financial.spendableBalance}
          hint="Ledger balance minus savings reservations"
          icon={Wallet}
          accent="balance"
        />
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="rankings">Top categories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryPieChart data={byCategory} />
        </TabsContent>

        <TabsContent value="trends">
          <MonthlyTrendChart data={trend} />
        </TabsContent>

        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Top spending categories</CardTitle>
              <CardDescription>Ranked by total expense amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topThree.length ? (
                topThree.map((row, idx) => (
                  <div
                    key={row.category}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium">{row.category}</div>
                        <div className="text-xs text-muted-foreground">Expense total</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">{formatMoney(row.amount)}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  Add categorized expenses to unlock rankings.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
