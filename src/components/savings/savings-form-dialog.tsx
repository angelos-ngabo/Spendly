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
import { Textarea } from '@/components/ui/textarea'
import { savingFormSchema, type SavingFormValues } from '@/lib/schemas'
import { useSavings } from '@/store/savings-context'
import { useTransactions } from '@/store/transactions-context'
import { availableToReserve, ledgerBalance, totalSavingsAmount } from '@/utils/savings'
import { useMoneyFormat } from '@/context/currency-preference-context'

function defaultValues(): SavingFormValues {
  return {
    title: '',
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  }
}

export function SavingsFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { formatMoney } = useMoneyFormat()
  const { transactions } = useTransactions()
  const { savings, addSaving } = useSavings()
  const form = useForm<SavingFormValues>({
    resolver: zodResolver(savingFormSchema) as Resolver<SavingFormValues>,
    defaultValues: defaultValues(),
  })

  useEffect(() => {
    if (!open) return
    form.reset(defaultValues())
  }, [open, form])

  const ledger = ledgerBalance(transactions)
  const reserved = totalSavingsAmount(savings)
  const available = availableToReserve(transactions, savings)

  const onSubmit = form.handleSubmit((values) => {
    addSaving(
      {
        title: values.title.trim(),
        amount: values.amount,
        date: values.date,
        note: values.note?.trim() ? values.note.trim() : undefined,
      },
      transactions,
    )
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Reserve savings</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Move part of your positive ledger balance into tracked savings. Reserved amounts reduce your spendable
            balance until removed.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5 text-xs text-muted-foreground">
          {ledger <= 0 ? (
            <span className="font-medium text-destructive">
              Your ledger balance is not positive — you cannot reserve savings yet.
            </span>
          ) : (
            <>
              Ledger balance: <span className="font-semibold text-foreground">{formatMoney(ledger)}</span>
              {' · '}
              Reserved: <span className="font-semibold text-foreground">{formatMoney(reserved)}</span>
              {' · '}
              Can still allocate: <span className="font-semibold text-foreground">{formatMoney(available)}</span>
            </>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="saving-title">Reason</Label>
            <Input
              id="saving-title"
              className="rounded-xl"
              placeholder="e.g. Emergency fund, vacation, tax buffer"
              {...form.register('title')}
            />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="saving-amount">Amount</Label>
              <Input
                id="saving-amount"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                className="rounded-xl"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount ? (
                <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="saving-date">Date</Label>
              <Input id="saving-date" type="date" className="rounded-xl" {...form.register('date')} />
              {form.formState.errors.date ? (
                <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saving-note">Note (optional)</Label>
            <Textarea id="saving-note" className="min-h-[80px] rounded-xl" {...form.register('note')} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl shadow-sm" disabled={ledger <= 0}>
              Reserve savings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
