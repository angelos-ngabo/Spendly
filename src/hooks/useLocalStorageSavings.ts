import { useCallback, useEffect, useRef, useState } from 'react'
import { savingsArraySchema } from '@/lib/schemas'
import { GUEST_SAVINGS_KEY, migrateLegacyGuestIfNeeded } from '@/lib/guest-storage'
import type { Saving } from '@/types/saving'

function safeLoad(): Saving[] {
  migrateLegacyGuestIfNeeded()
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

function safeSave(savings: Saving[]) {
  try {
    localStorage.setItem(GUEST_SAVINGS_KEY, JSON.stringify(savings))
  } catch {
    /* quota or private mode */
  }
}

export function useLocalStorageSavings() {
  const [savings, setSavings] = useState<Saving[]>(() => safeLoad())
  const skipFirstSave = useRef(true)

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }
    safeSave(savings)
  }, [savings])

  const replaceAll = useCallback((next: Saving[]) => {
    setSavings(next)
  }, [])

  return { savings, setSavings, replaceAll }
}
