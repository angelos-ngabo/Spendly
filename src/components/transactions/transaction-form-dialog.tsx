import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categoriesForType } from '@/data/categories'
import { transactionFormSchema, type TransactionFormValues } from '@/lib/schemas'
import { useTransactions } from '@/store/transactions-context'
import type { Transaction } from '@/types/transaction'

function defaultValues(): TransactionFormValues {
  return {
    title: '',
    amount: 0,
    type: 'expense',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  }
}

function valuesFromTransaction(t: Transaction): TransactionFormValues {
  return {
    title: t.title,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    note: t.note ?? '',
  }
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  mode,
  transaction,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  transaction?: Transaction
}) {
  const { addTransaction, updateTransaction } = useTransactions()
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as Resolver<TransactionFormValues>,
    defaultValues: defaultValues(),
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && transaction) {
      form.reset(valuesFromTransaction(transaction))
    } else {
      form.reset(defaultValues())
    }
  }, [open, mode, transaction, form])

  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch is intentional here
  const type = form.watch('type')
  const categoryOptions = categoriesForType(type)

  const onSubmit = form.handleSubmit((values) => {
    if (mode === 'create') {
      addTransaction({
        title: values.title.trim(),
        amount: values.amount,
        type: values.type,
        category: values.category,
        date: values.date,
        note: values.note?.trim() ? values.note.trim() : undefined,
      })
    } else if (transaction) {
      updateTransaction(transaction.id, {
        title: values.title.trim(),
        amount: values.amount,
        type: values.type,
        category: values.category,
        date: values.date,
        note: values.note?.trim() ? values.note.trim() : undefined,
      })
    }
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(92vh,720px)] overflow-y-auto sm:max-w-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {mode === 'create' ? 'Add transaction' : 'Edit transaction'}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {mode === 'create'
              ? 'Log a new income or expense. Amounts should be positive numbers.'
              : 'Update the details for this transaction.'}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Weekly groceries" {...form.register('title')} />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(v) => {
                  const next = v as 'income' | 'expense'
                  form.setValue('type', next)
                  const opts = categoriesForType(next)
                  const current = form.getValues('category')
                  if (current && !opts.includes(current)) {
                    form.setValue('category', '')
                  }
                }}
              >
                <SelectTrigger aria-label="Transaction type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                inputMode="decimal"
                step="0.01"
                type="number"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount ? (
                <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.watch('category') || undefined}
                onValueChange={(v) => form.setValue('category', v)}
              >
                <SelectTrigger aria-label="Category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category ? (
                <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...form.register('date')} />
              {form.formState.errors.date ? (
                <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" placeholder="Add context, merchant, or tags" {...form.register('note')} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'create' ? 'Save transaction' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
