import { z } from 'zod'
import type { Saving } from '@/types/saving'

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.coerce.number().refine((n) => Number.isFinite(n) && n > 0, 'Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  date: z.string().min(1),
  /** Firestore stores missing notes as `null`; JSON may use null too. */
  note: z.preprocess(
    (v) => (v === null || v === undefined || v === '' ? undefined : v),
    z.string().optional(),
  ),
  createdAt: z.string().min(1),
})

export const transactionsArraySchema = z.array(transactionSchema)

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  transactions: z.array(transactionSchema),
})

export const transactionFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce
    .number()
    .refine((n) => Number.isFinite(n) && n > 0, 'Amount must be greater than zero'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

export const savingSchema = z.object({
  id: z.string(),
  userId: z.string().min(1),
  amount: z.coerce.number().refine((n) => Number.isFinite(n) && n > 0, 'Amount must be positive'),
  title: z.string().min(1),
  note: z.preprocess(
    (v) => (v === null || v === undefined || v === '' ? undefined : v),
    z.string().optional(),
  ),
  date: z.string().min(1),
  createdAt: z.string().min(1),
})

export const savingsArraySchema = z.array(savingSchema)

export const savingFormSchema = z.object({
  title: z.string().min(1, 'Reason is required'),
  amount: z.coerce
    .number()
    .refine((n) => Number.isFinite(n) && n > 0, 'Amount must be greater than zero'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
})

export type SavingFormValues = z.infer<typeof savingFormSchema>

export function savingFromForm(
  values: SavingFormValues,
  id: string,
  createdAt: string,
  userId: string,
): Saving {
  const row: Saving = {
    id,
    userId,
    amount: values.amount,
    title: values.title.trim(),
    date: values.date,
    createdAt,
  }
  const n = values.note?.trim()
  if (n) row.note = n
  return row
}
