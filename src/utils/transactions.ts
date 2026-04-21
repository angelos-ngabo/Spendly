import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from 'date-fns'
import type {
  MonthlyPoint,
  Transaction,
  TransactionFilters,
  TransactionSummary,
} from '@/types/transaction'

export function computeSummary(transactions: Transaction[]): TransactionSummary {
  let totalIncome = 0
  let totalExpense = 0
  for (const t of transactions) {
    if (t.type === 'income') totalIncome += t.amount
    else totalExpense += t.amount
  }
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    count: transactions.length,
  }
}

export function expenseTotalsByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function monthlyTrend(transactions: Transaction[]): MonthlyPoint[] {
  const map = new Map<string, { income: number; expense: number }>()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    const cur = map.get(key) ?? { income: 0, expense: 0 }
    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount
    map.set(key, cur)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, income: v.income, expense: v.expense }))
}

export function currentMonthTotals(transactions: Transaction[], now = new Date()) {
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  let income = 0
  let expense = 0
  for (const t of transactions) {
    const d = parseISO(t.date)
    if (!isWithinInterval(d, { start, end })) continue
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  return { income, expense, label: format(now, 'MMMM yyyy') }
}

export function highestExpenseCategory(transactions: Transaction[]) {
  const rows = expenseTotalsByCategory(transactions)
  return rows[0] ?? null
}

export function recentTransactions(transactions: Transaction[], limit = 6) {
  return [...transactions]
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, limit)
}

export function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const q = filters.search.trim().toLowerCase()
  let rows = transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (filters.month !== 'all' && t.date.slice(0, 7) !== filters.month) return false
    if (q) {
      const inTitle = t.title.toLowerCase().includes(q)
      const inNote = (t.note ?? '').toLowerCase().includes(q)
      if (!inTitle && !inNote) return false
    }
    return true
  })

  rows = [...rows]
  switch (filters.sort) {
    case 'newest':
      rows.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      break
    case 'oldest':
      rows.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      break
    case 'amount-high':
      rows.sort((a, b) => b.amount - a.amount)
      break
    case 'amount-low':
      rows.sort((a, b) => a.amount - b.amount)
      break
    default:
      break
  }
  return rows
}

export function uniqueCategories(transactions: Transaction[]) {
  return [...new Set(transactions.map((t) => t.category))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function monthOptionsFromTransactions(transactions: Transaction[]) {
  const set = new Set<string>()
  for (const t of transactions) {
    set.add(t.date.slice(0, 7))
  }
  return [...set].sort((a, b) => b.localeCompare(a))
}
