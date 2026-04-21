import { format, parseISO } from 'date-fns'
import { Loader2, PiggyBank, Plus, Trash2, TrendingUp, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SavingsFormDialog } from '@/components/savings/savings-form-dialog'
import { SavingsTrendChart } from '@/components/savings/savings-trend-chart'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useFinancialSnapshot } from '@/hooks/useFinancialSnapshot'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'
import { savingsByMonth } from '@/utils/savings'

export function SavingsPage() {
  const { transactions, transactionsLoading, transactionsError } = useTransactions()
  const { savings, savingsLoading, savingsError, deleteSaving } = useSavings()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const snapshot = useFinancialSnapshot(transactions, savings)
  const trend = useMemo(() => savingsByMonth(savings), [savings])

  const sortedSavings = useMemo(
    () => [...savings].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()),
    [savings],
  )

  const loading = transactionsLoading || savingsLoading

  return (
    <div className="w-full space-y-8 text-foreground">
      {transactionsError || savingsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {transactionsError ?? savingsError}
        </div>
      ) : null}
      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
          <span>Syncing your workspace…</span>
        </div>
      ) : null}

      <PageHeader
        title="Savings"
        description="Reserve part of your positive balance into tracked savings. Reserved funds stay visible but no longer count as spendable cash."
        action={
          <Button
            type="button"
            className="rounded-xl shadow-sm transition-all hover:shadow-md"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Reserve savings
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total saved"
          amount={snapshot.totalSaved}
          hint="All reservations"
          icon={PiggyBank}
          accent="savings"
        />
        <StatCard
          title="Spendable balance"
          amount={snapshot.spendableBalance}
          hint="Ledger balance minus savings"
          icon={Wallet}
          accent="balance"
        />
        <StatCard
          title="Ledger balance"
          amount={snapshot.balance}
          hint="Income minus expenses (before savings)"
          icon={TrendingUp}
          accent="income"
        />
        <StatCard
          title="Savings rate"
          value={
            snapshot.savingsRatePct != null ? `${snapshot.savingsRatePct.toFixed(1)}%` : '—'
          }
          hint={
            snapshot.totalIncome > 0
              ? 'Reserved ÷ total income (all time)'
              : 'Add income to measure savings rate'
          }
          icon={PiggyBank}
          accent="muted"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border/50 bg-card/80 shadow-md shadow-black/[0.03] dark:bg-card/60 dark:shadow-black/25">
            <div className="border-b border-border/50 px-5 py-4">
              <h2 className="text-base font-semibold tracking-tight">Savings history</h2>
              <p className="text-sm text-muted-foreground">Newest first · removing an entry returns funds to spendable balance</p>
            </div>
            <div className="p-2 sm:p-4">
              {sortedSavings.length === 0 ? (
                <EmptyState
                  className="border-0 bg-transparent py-12 shadow-none"
                  icon={PiggyBank}
                  title="No savings reserved yet"
                  description="When your ledger balance is positive, you can move part of it into savings so it is no longer treated as spendable."
                  action={
                    <Button type="button" className="rounded-xl" onClick={() => setDialogOpen(true)}>
                      Reserve savings
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {sortedSavings.map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="font-medium text-foreground">{s.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(s.date), 'MMM d, yyyy')}
                          {s.note ? ` · ${s.note}` : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-lg font-semibold tabular-nums text-foreground">
                          {formatCurrency(s.amount)}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-xl text-muted-foreground hover:text-destructive"
                          aria-label="Remove savings entry"
                          onClick={() => setPendingDeleteId(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <SavingsTrendChart data={trend} />
        </div>
      </div>

      <SavingsFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <AlertDialog open={pendingDeleteId != null} onOpenChange={(o) => !o && setPendingDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this savings entry?</AlertDialogTitle>
            <AlertDialogDescription>
              The amount will return to your spendable balance. This does not create a transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn('rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90')}
              onClick={() => {
                if (pendingDeleteId) deleteSaving(pendingDeleteId)
                setPendingDeleteId(null)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
