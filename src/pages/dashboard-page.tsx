import { Loader2, PiggyBank, Plus, Sparkles, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_BASE } from '@/components/layout/nav'
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog'
import { buildDemoTransactions } from '@/data/demo'
import { useFinancialSnapshot } from '@/hooks/useFinancialSnapshot'
import { useTransactionSummaries } from '@/hooks/useTransactionSummaries'
import { useAuth } from '@/context/auth-context'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'
import { recentTransactions } from '@/utils/transactions'

function useWelcomeDismissed() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('spendly-welcome-dismissed') === '1',
  )

  const dismiss = () => {
    localStorage.setItem('spendly-welcome-dismissed', '1')
    setDismissed(true)
  }

  return { dismissed, dismiss }
}

/**
 * Dashboard shell styled after DataPharma — Dashboard Financeiro (Figma community).
 * Presentation only; all data and handlers remain on this page.
 */
export function DashboardPage() {
  const { user, guestSession, accountProfile } = useAuth()
  const { transactions, replaceAll, transactionsLoading, transactionsError } = useTransactions()
  const { savings, savingsLoading, savingsError } = useSavings()
  const { dismissed, dismiss } = useWelcomeDismissed()
  const { summary, byCategory, trend } = useTransactionSummaries(transactions)
  const financial = useFinancialSnapshot(transactions, savings)
  const recent = useMemo(() => recentTransactions(transactions, 6), [transactions])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = useMemo(
    () => (editingId ? transactions.find((t) => t.id === editingId) : undefined),
    [editingId, transactions],
  )

  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setDialogOpen(true)
  }

  const openEdit = (id: string) => {
    setDialogMode('edit')
    setEditingId(id)
    setDialogOpen(true)
  }

  const loadDemo = () => {
    void (async () => {
      try {
        await replaceAll(buildDemoTransactions())
        dismiss()
        toast.success('Sample data loaded')
      } catch {
        /* errors toasted in provider */
      }
    })()
  }

  const greetingName =
    accountProfile?.fullName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    ''

  const titleText = user && greetingName ? `Welcome back, ${greetingName}` : 'Overview'

  return (
    <div className="w-full text-foreground">
      {transactionsError || savingsError ? (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {transactionsError ?? savingsError}
        </div>
      ) : null}
      {transactionsLoading || savingsLoading ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E8ECEF] bg-white px-3 py-2 text-sm text-[#4A5568] shadow-sm dark:border-border dark:bg-card dark:text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#318A96]" aria-hidden />
          <span>Syncing your workspace from the cloud…</span>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white shadow-[0_8px_32px_rgba(49,138,150,0.1)] dark:rounded-2xl dark:border-border dark:bg-card dark:shadow-xl">
        <div className="border-b border-[#EEF2F5] bg-gradient-to-r from-[#318A96]/[0.07] via-[#F8F9FA] to-white px-5 py-6 md:px-8 md:py-7 dark:from-primary/10 dark:via-card dark:to-card">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#318A96] dark:text-primary">
                {guestSession
                  ? 'Guest workspace · saved on this device'
                  : user
                    ? 'Cloud workspace · synced securely'
                    : 'Financial dashboard'}
              </p>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-[#2D3748] md:text-[1.75rem] md:leading-tight dark:text-foreground">
                {titleText}
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-[#4A5568] dark:text-muted-foreground">
                {guestSession
                  ? 'A calm snapshot of your cash flow. Create an account anytime to sync across devices.'
                  : user?.email
                    ? 'Income, spending, categories, and recent activity in one composed view.'
                    : 'A calm snapshot of your cash flow, categories, and recent activity.'}
              </p>
            </div>
            <Button
              type="button"
              className="h-11 shrink-0 rounded-xl bg-[#318A96] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#287783] dark:bg-primary dark:hover:bg-primary/90"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4" />
              Add transaction
            </Button>
          </div>
        </div>

        <div className="space-y-8 bg-[#F8F9FA] px-5 py-6 md:space-y-10 md:px-8 md:py-8 dark:bg-background/40">
          {!dismissed && transactions.length === 0 ? (
            <Card className="overflow-hidden border-[#318A96]/25 bg-gradient-to-br from-[#318A96]/[0.09] via-white to-white shadow-sm dark:border-primary/25 dark:from-primary/10 dark:via-card dark:to-card">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#318A96] dark:text-primary">
                    <Sparkles className="h-4 w-4" />
                    Welcome to Spendly
                  </div>
                  <div className="max-w-2xl text-sm text-[#4A5568] dark:text-muted-foreground">
                    {guestSession ? (
                      <>
                        Start by adding a transaction, or load curated sample data to explore charts and filters on
                        this device only.
                      </>
                    ) : (
                      <>
                        Start by adding your first transaction. Your ledger is private to this account and syncs with
                        Firebase—sample bulk data is not loaded automatically.
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {guestSession ? (
                    <Button type="button" variant="secondary" onClick={loadDemo}>
                      Load sample data (guest only)
                    </Button>
                  ) : (
                    <Button type="button" onClick={openCreate}>
                      Add your first transaction
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={dismiss}>
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            <StatCard
              title="Total income"
              amount={summary.totalIncome}
              hint="All time"
              icon={TrendingUp}
              accent="income"
              surface="panel"
            />
            <StatCard
              title="Total expenses"
              amount={summary.totalExpense}
              hint="All time"
              icon={TrendingDown}
              accent="expense"
              surface="panel"
            />
            <StatCard
              title="Total saved"
              amount={financial.totalSaved}
              hint="Reserved from your ledger"
              icon={PiggyBank}
              accent="savings"
              surface="panel"
            />
            <StatCard
              title="Spendable balance"
              amount={financial.spendableBalance}
              hint="Income minus expenses minus savings reservations"
              icon={Wallet}
              accent="balance"
              surface="panel"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <CategoryPieChart data={byCategory} appearance="datapharma" />
            <MonthlyTrendChart data={trend} appearance="datapharma" />
          </div>

          <RecentTransactions items={recent} onEdit={(t) => openEdit(t.id)} onAdd={openCreate} appearance="datapharma" />

          <div className="flex flex-wrap justify-end gap-2 border-t border-[#E8ECEF] pt-2 dark:border-border">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#CBD5E0] text-[#2D3748] hover:border-[#318A96]/40 hover:bg-[#F2F5F5] hover:text-[#287783] dark:border-border"
            >
              <Link to={`${APP_BASE}/savings`}>Savings</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#CBD5E0] text-[#2D3748] hover:border-[#318A96]/40 hover:bg-[#F2F5F5] hover:text-[#287783] dark:border-border"
            >
              <Link to={`${APP_BASE}/analytics`}>Explore analytics</Link>
            </Button>
          </div>
        </div>
      </div>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingId(null)
        }}
        mode={dialogMode}
        transaction={dialogMode === 'edit' ? editing : undefined}
      />
    </div>
  )
}
