import { MoreHorizontal, Pencil, Receipt, Trash2 } from 'lucide-react'
import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CategoryBadge } from '@/components/shared/category-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { formatDisplayDate } from '@/lib/format'
import { useTransactions } from '@/store/transactions-context'
import type { Transaction } from '@/types/transaction'
import { cn } from '@/lib/utils'

export function TransactionsTable({
  rows,
  totalCount,
  onEdit,
  onAdd,
}: {
  rows: Transaction[]
  /** Total transactions before filters (for empty-state copy). */
  totalCount: number
  onEdit: (t: Transaction) => void
  onAdd: () => void
}) {
  const { formatMoney } = useMoneyFormat()
  const { deleteTransaction } = useTransactions()
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  if (!rows.length) {
    const filteredOut = totalCount > 0
    return (
      <EmptyState
        icon={Receipt}
        title={filteredOut ? 'No matches for these filters' : 'No transactions yet'}
        description={
          filteredOut
            ? 'Adjust or clear filters to see more of your ledger, or add a new entry.'
            : 'Start with your first income or expense to build history, charts, and exports.'
        }
        action={
          <Button type="button" className="rounded-xl" onClick={onAdd}>
            Add transaction
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className="-mx-1 w-[calc(100%+0.5rem)] overflow-x-auto sm:mx-0 sm:w-full sm:overflow-visible">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[64px] text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDisplayDate(t.date)}
              </TableCell>
              <TableCell>
                <div className="font-medium">{t.title}</div>
                {t.note ? <div className="text-xs text-muted-foreground">{t.note}</div> : null}
              </TableCell>
              <TableCell>
                <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                  {t.type === 'income' ? 'Income' : 'Expense'}
                </Badge>
              </TableCell>
              <TableCell>
                <CategoryBadge category={t.category} />
              </TableCell>
              <TableCell
                className={cn(
                  'text-right text-sm font-semibold tabular-nums',
                  t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                )}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatMoney(t.amount)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="Open row menu">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(t)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setPendingDelete(t)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes “{pendingDelete?.title}” from your local history. You can export a backup first
              from Settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) deleteTransaction(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
