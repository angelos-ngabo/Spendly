import { useMemo } from 'react'
import type { Transaction } from '@/types/transaction'
import {
  computeSummary,
  currentMonthTotals,
  expenseTotalsByCategory,
  highestExpenseCategory,
  monthlyTrend,
} from '@/utils/transactions'

export function useTransactionSummaries(transactions: Transaction[]) {
  return useMemo(() => {
    const summary = computeSummary(transactions)
    const byCategory = expenseTotalsByCategory(transactions)
    const trend = monthlyTrend(transactions)
    const topExpense = highestExpenseCategory(transactions)
    const month = currentMonthTotals(transactions)
    return { summary, byCategory, trend, topExpense, month }
  }, [transactions])
}
