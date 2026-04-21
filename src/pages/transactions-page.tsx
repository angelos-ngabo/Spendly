import { Download, Loader2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { TransactionFiltersBar } from '@/components/transactions/transaction-filters'
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { downloadTextFile, transactionsToCsv } from '@/utils/export'
import { toast } from 'sonner'
import type { TransactionFilters } from '@/types/transaction'
import { useTransactions } from '@/store/transactions-context'
import {
  applyFilters,
  monthOptionsFromTransactions,
  uniqueCategories,
} from '@/utils/transactions'

const DEFAULT_FILTERS: TransactionFilters = {
  type: 'all',
  category: 'all',
  month: 'all',
  search: '',
  sort: 'newest',
}

export function TransactionsPage() {
  const { transactions, transactionsLoading, transactionsError } = useTransactions()
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)

  const categories = useMemo(() => uniqueCategories(transactions), [transactions])
  const months = useMemo(() => monthOptionsFromTransactions(transactions), [transactions])
  const rows = useMemo(() => applyFilters(transactions, filters), [transactions, filters])

  const editing = useMemo(
    () => (editingId ? transactions.find((t) => t.id === editingId) : undefined),
    [editingId, transactions],
  )

  const openCreate = () => {
    setDialogMode('create')
    setEditingId(null)
    setDialogOpen(true)
  }

  const openEdit = (t: { id: string }) => {
    setDialogMode('edit')
    setEditingId(t.id)
    setDialogOpen(true)
  }

  const exportFilteredCsv = () => {
    try {
      const csv = transactionsToCsv(rows)
      downloadTextFile(`spendly-transactions-filtered.csv`, csv, 'text/csv;charset=utf-8')
      toast.success('Exported CSV')
    } catch {
      toast.error('Could not export CSV')
    }
  }

  return (
    <div className="w-full space-y-6 text-foreground">
      {transactionsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {transactionsError}
        </div>
      ) : null}
      {transactionsLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
          <span>Syncing your latest transactions…</span>
        </div>
      ) : null}
      <PageHeader
        title="Transactions"
        description="Search, filter, and organize every income and expense in one place."
        action={
          <>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl shadow-sm transition-all hover:shadow-md"
              onClick={exportFilteredCsv}
            >
              <Download className="h-4 w-4" />
              Export CSV (filtered)
            </Button>
            <Button
              type="button"
              className="rounded-xl shadow-sm transition-all hover:shadow-md"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4" />
              Add transaction
            </Button>
          </>
        }
      />

      <TransactionFiltersBar
        value={filters}
        onChange={setFilters}
        categories={categories}
        months={months}
      />

      <TransactionsTable
        rows={rows}
        totalCount={transactions.length}
        onEdit={openEdit}
        onAdd={openCreate}
      />

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
