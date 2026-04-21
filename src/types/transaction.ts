export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
  note?: string
  createdAt: string
}

export type TransactionSort =
  | 'newest'
  | 'oldest'
  | 'amount-high'
  | 'amount-low'

export type TransactionFilters = {
  type: 'all' | TransactionType
  category: string
  month: string
  search: string
  sort: TransactionSort
}

export type CategorySlice = {
  category: string
  amount: number
}

export type MonthlyPoint = {
  month: string
  income: number
  expense: number
}

export type TransactionSummary = {
  totalIncome: number
  totalExpense: number
  balance: number
  count: number
}

export type BackupPayload = {
  version: 1
  exportedAt: string
  transactions: Transaction[]
}
