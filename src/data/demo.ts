import { subDays } from 'date-fns'
import type { Transaction } from '@/types/transaction'

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function buildDemoTransactions(): Transaction[] {
  const now = new Date()
  const rows: Omit<Transaction, 'id' | 'createdAt'>[] = [
    {
      title: 'Monthly salary',
      amount: 5200,
      type: 'income',
      category: 'Salary',
      date: iso(subDays(now, 3)),
      note: 'Net pay',
    },
    {
      title: 'Freelance project',
      amount: 850,
      type: 'income',
      category: 'Freelance',
      date: iso(subDays(now, 18)),
    },
    {
      title: 'Rent payment',
      amount: 1650,
      type: 'expense',
      category: 'Rent',
      date: iso(subDays(now, 5)),
    },
    {
      title: 'Groceries',
      amount: 128.4,
      type: 'expense',
      category: 'Food',
      date: iso(subDays(now, 1)),
      note: 'Weekly shop',
    },
    {
      title: 'Transit pass',
      amount: 84,
      type: 'expense',
      category: 'Transport',
      date: iso(subDays(now, 9)),
    },
    {
      title: 'Electric bill',
      amount: 96.2,
      type: 'expense',
      category: 'Bills',
      date: iso(subDays(now, 12)),
    },
    {
      title: 'Coffee & lunch',
      amount: 42.75,
      type: 'expense',
      category: 'Food',
      date: iso(subDays(now, 0)),
    },
    {
      title: 'Concert tickets',
      amount: 180,
      type: 'expense',
      category: 'Entertainment',
      date: iso(subDays(now, 26)),
    },
    {
      title: 'Pharmacy',
      amount: 36.9,
      type: 'expense',
      category: 'Health',
      date: iso(subDays(now, 7)),
    },
    {
      title: 'Gift from family',
      amount: 120,
      type: 'income',
      category: 'Gift',
      date: iso(subDays(now, 40)),
    },
  ]

  const created = new Date().toISOString()
  return rows.map((r) => ({
    ...r,
    id: crypto.randomUUID(),
    createdAt: created,
  }))
}
