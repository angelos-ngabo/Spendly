import { AppShell } from '@/components/layout/app-shell'
import { SavingsProvider } from '@/store/savings-context'
import { TransactionsProvider } from '@/store/transactions-context'

export function TransactionsShell() {
  return (
    <TransactionsProvider>
      <SavingsProvider>
        <AppShell />
      </SavingsProvider>
    </TransactionsProvider>
  )
}
