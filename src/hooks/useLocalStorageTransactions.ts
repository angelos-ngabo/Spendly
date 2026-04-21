import { useCallback, useEffect, useRef, useState } from 'react'
import type { Transaction } from '@/types/transaction'
import { transactionsArraySchema } from '@/lib/schemas'
import { GUEST_TX_KEY, migrateLegacyGuestIfNeeded } from '@/lib/guest-storage'

function safeLoad(): Transaction[] {
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

function safeSave(transactions: Transaction[]) {
  try {
    localStorage.setItem(GUEST_TX_KEY, JSON.stringify(transactions))
  } catch {
    /* quota or private mode */
  }
}

export function useLocalStorageTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => safeLoad())
  const skipFirstSave = useRef(true)

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }
    safeSave(transactions)
  }, [transactions])

  const replaceAll = useCallback((next: Transaction[]) => {
    setTransactions(next)
  }, [])

  return { transactions, setTransactions, replaceAll }
}
