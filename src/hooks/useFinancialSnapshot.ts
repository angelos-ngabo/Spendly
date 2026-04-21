import { useMemo } from 'react'
import type { Saving } from '@/types/saving'
import type { Transaction } from '@/types/transaction'
import { computeSummary } from '@/utils/transactions'
import { spendableBalance, totalSavingsAmount } from '@/utils/savings'

export function useFinancialSnapshot(transactions: Transaction[], savings: Saving[]) {
  return useMemo(() => {
    const summary = computeSummary(transactions)
    const totalSaved = totalSavingsAmount(savings)
    const spendable = spendableBalance(transactions, savings)
    const income = summary.totalIncome
    const savingsRatePct = income > 0 ? (totalSaved / income) * 100 : null
    const pctLedgerReserved =
      summary.balance > 0 ? Math.min(100, (totalSaved / summary.balance) * 100) : totalSaved > 0 ? 100 : 0

    return {
      ...summary,
      totalSaved,
      spendableBalance: spendable,
      savingsRatePct,
      pctLedgerReserved,
    }
  }, [transactions, savings])
}
