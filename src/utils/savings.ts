import { formatCurrency } from '@/lib/format'
import type { Saving } from '@/types/saving'
import type { Transaction } from '@/types/transaction'
import { computeSummary } from '@/utils/transactions'

export function totalSavingsAmount(savings: Saving[]): number {
  return savings.reduce((sum, s) => sum + s.amount, 0)
}

/** Income minus expenses from the transaction ledger only. */
export function ledgerBalance(transactions: Transaction[]): number {
  return computeSummary(transactions).balance
}

/** Ledger balance minus all savings reservations. */
export function spendableBalance(transactions: Transaction[], savings: Saving[]): number {
  return ledgerBalance(transactions) - totalSavingsAmount(savings)
}

/** Maximum additional amount that can be reserved right now (0 if ledger ≤ 0 or already fully reserved). */
export function availableToReserve(transactions: Transaction[], savings: Saving[]): number {
  const ledger = ledgerBalance(transactions)
  if (ledger <= 0) return 0
  const reserved = totalSavingsAmount(savings)
  return Math.max(0, ledger - reserved)
}

export type SavingsReservationInput = {
  amount: number
  title: string
  date: string
  note?: string
}

export function validateSavingsReservation(
  input: SavingsReservationInput,
  transactions: Transaction[],
  savings: Saving[],
): { ok: true } | { ok: false; message: string } {
  const title = input.title.trim()
  if (!title) {
    return { ok: false, message: 'Please enter a reason or title for this savings entry.' }
  }
  if (!input.date?.trim()) {
    return { ok: false, message: 'Date is required.' }
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, message: 'Amount must be greater than zero.' }
  }

  const ledger = ledgerBalance(transactions)
  if (ledger <= 0) {
    return {
      ok: false,
      message:
        'You can only reserve savings when your ledger balance (income minus expenses) is positive. Add income or reduce expenses first.',
    }
  }

  const reserved = totalSavingsAmount(savings)
  const available = ledger - reserved
  if (input.amount > available) {
    return {
      ok: false,
      message: `You can reserve at most ${formatCurrency(available)} — your remaining positive balance after existing savings.`,
    }
  }

  return { ok: true }
}

/** Sum of savings whose `date` falls in the given yyyy-MM month. */
export function savingsTotalInMonth(savings: Saving[], monthKey: string): number {
  let sum = 0
  for (const s of savings) {
    if (s.date.slice(0, 7) === monthKey) sum += s.amount
  }
  return sum
}

export type SavingsMonthPoint = {
  month: string
  amount: number
}

/** Aggregated savings reservations by calendar month (yyyy-MM), sorted ascending. */
export function savingsByMonth(savings: Saving[]): SavingsMonthPoint[] {
  const map = new Map<string, number>()
  for (const s of savings) {
    const key = s.date.slice(0, 7)
    map.set(key, (map.get(key) ?? 0) + s.amount)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }))
}
