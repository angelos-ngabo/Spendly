import { savingsArraySchema, transactionsArraySchema } from '@/lib/schemas'
import type { Saving } from '@/types/saving'
import type { Transaction } from '@/types/transaction'

export const GUEST_SESSION_KEY = 'spendly-session'
export const GUEST_TX_KEY = 'spendly-guest-transactions-v1'
export const GUEST_SAVINGS_KEY = 'spendly-guest-savings-v1'
const LEGACY_TX_KEY = 'spendly-transactions-v1'

export function migrateLegacyGuestIfNeeded() {
  try {
    if (localStorage.getItem(GUEST_TX_KEY)) return
    const legacy = localStorage.getItem(LEGACY_TX_KEY)
    if (!legacy) return
    const parsed: unknown = JSON.parse(legacy)
    const res = transactionsArraySchema.safeParse(parsed)
    if (!res.success) return
    localStorage.setItem(GUEST_TX_KEY, JSON.stringify(res.data))
    localStorage.removeItem(LEGACY_TX_KEY)
  } catch {
    /* ignore */
  }
}

export function readGuestTransactions(): Transaction[] {
  migrateLegacyGuestIfNeeded()
  try {
    const raw = localStorage.getItem(GUEST_TX_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    const res = transactionsArraySchema.safeParse(parsed)
    return res.success ? res.data : []
  } catch {
    return []
  }
}

export function readGuestSessionFlag() {
  return localStorage.getItem(GUEST_SESSION_KEY) === 'guest'
}

export function setGuestSessionFlag(active: boolean) {
  if (active) localStorage.setItem(GUEST_SESSION_KEY, 'guest')
  else localStorage.removeItem(GUEST_SESSION_KEY)
}

export function clearGuestTransactions() {
  localStorage.removeItem(GUEST_TX_KEY)
}

export function readGuestSavings(): Saving[] {
  try {
    const raw = localStorage.getItem(GUEST_SAVINGS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    const res = savingsArraySchema.safeParse(parsed)
    return res.success ? res.data : []
  } catch {
    return []
  }
}

export function clearGuestSavings() {
  localStorage.removeItem(GUEST_SAVINGS_KEY)
}
