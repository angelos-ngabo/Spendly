export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Education',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Gift',
  'Freelance',
  'Business',
  'Other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]

export function categoriesForType(type: 'income' | 'expense'): string[] {
  return (type === 'income' ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES]) as string[]
}
