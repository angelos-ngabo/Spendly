/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { savingSchema } from '@/lib/schemas'
import { useLocalStorageSavings } from '@/hooks/useLocalStorageSavings'
import {
  createUserSaving,
  deleteUserSaving,
  fetchUserSavingsOnce,
  subscribeUserSavings,
} from '@/services/firebase/savings'
import type { Saving } from '@/types/saving'
import type { Transaction } from '@/types/transaction'
import { readGuestSessionFlag } from '@/lib/guest-storage'
import { useMoneyFormat } from '@/context/currency-preference-context'
import { validateSavingsReservation } from '@/utils/savings'
import { useAuth } from '@/context/auth-context'
import { Loader2 } from 'lucide-react'

export type NewSavingInput = {
  amount: number
  title: string
  date: string
  note?: string
}

export type SavingsContextValue = {
  savings: Saving[]
  savingsLoading: boolean
  savingsError: string | null
  addSaving: (input: NewSavingInput, transactions: Transaction[]) => void
  deleteSaving: (id: string) => void
  /** Clears every savings reservation (e.g. workspace reset). */
  clearAllSavings: () => Promise<void>
}

const SavingsContext = createContext<SavingsContextValue | null>(null)

function GuestSavingsProvider({ children }: { children: ReactNode }) {
  const { formatMoney } = useMoneyFormat()
  const { savings, setSavings, replaceAll } = useLocalStorageSavings()

  const addSaving = useCallback(
    (input: NewSavingInput, transactions: Transaction[]) => {
      const check = validateSavingsReservation(input, transactions, savings, formatMoney)
      if (!check.ok) {
        toast.error(check.message)
        return
      }
      const id = crypto.randomUUID()
      const createdAt = new Date().toISOString()
      const row: Saving = {
        id,
        userId: 'guest',
        amount: input.amount,
        title: input.title.trim(),
        date: input.date,
        createdAt,
        ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      }
      const parsed = savingSchema.safeParse(row)
      if (!parsed.success) {
        toast.error('Could not add savings entry')
        return
      }
      setSavings((prev) => [parsed.data, ...prev])
      toast.success('Savings reserved')
    },
    [savings, setSavings, formatMoney],
  )

  const deleteSaving = useCallback(
    (id: string) => {
      setSavings((prev) => prev.filter((s) => s.id !== id))
      toast.success('Savings entry removed')
    },
    [setSavings],
  )

  const clearAllSavings = useCallback(async () => {
    replaceAll([])
  }, [replaceAll])

  const value = useMemo<SavingsContextValue>(
    () => ({
      savings,
      savingsLoading: false,
      savingsError: null,
      addSaving,
      deleteSaving,
      clearAllSavings,
    }),
    [savings, addSaving, deleteSaving, clearAllSavings],
  )

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
}

function CloudSavingsProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const { formatMoney } = useMoneyFormat()
  const [savings, setSavings] = useState<Saving[]>([])
  const [savingsLoading, setSavingsLoading] = useState(true)
  const [savingsError, setSavingsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => setSavingsLoading(true))

    void fetchUserSavingsOnce(uid)
      .then((rows) => {
        if (cancelled) return
        setSavings(rows)
        setSavingsLoading(false)
        setSavingsError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSavingsError(err instanceof Error ? err.message : 'Could not load savings')
        setSavingsLoading(false)
      })

    const unsub = subscribeUserSavings(
      uid,
      (rows) => {
        if (cancelled) return
        setSavings(rows)
        setSavingsLoading(false)
        setSavingsError(null)
      },
      () => {
        if (cancelled) return
        setSavingsError('Could not sync savings')
        setSavingsLoading(false)
        toast.error('Could not sync your savings')
      },
    )
    return () => {
      cancelled = true
      unsub()
    }
  }, [uid])

  const addSaving = useCallback(
    (input: NewSavingInput, transactions: Transaction[]) => {
      void (async () => {
        const check = validateSavingsReservation(input, transactions, savings, formatMoney)
        if (!check.ok) {
          toast.error(check.message)
          return
        }
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()
        const row: Saving = {
          id,
          userId: uid,
          amount: input.amount,
          title: input.title.trim(),
          date: input.date,
          createdAt,
          ...(input.note?.trim() ? { note: input.note.trim() } : {}),
        }
        const parsed = savingSchema.safeParse(row)
        if (!parsed.success) {
          toast.error('Could not add savings entry')
          return
        }
        try {
          await createUserSaving(uid, parsed.data)
          toast.success('Savings reserved')
        } catch {
          toast.error('Could not save to the cloud')
        }
      })()
    },
    [savings, uid, formatMoney],
  )

  const deleteSaving = useCallback(
    (id: string) => {
      void (async () => {
        try {
          await deleteUserSaving(uid, id)
          toast.success('Savings entry removed')
        } catch {
          toast.error('Could not remove savings entry')
        }
      })()
    },
    [uid],
  )

  const clearAllSavings = useCallback(async () => {
    const ids = savings.map((s) => s.id)
    for (const id of ids) {
      await deleteUserSaving(uid, id)
    }
  }, [savings, uid])

  const value = useMemo<SavingsContextValue>(
    () => ({
      savings,
      savingsLoading,
      savingsError,
      addSaving,
      deleteSaving,
      clearAllSavings,
    }),
    [savings, savingsLoading, savingsError, addSaving, deleteSaving, clearAllSavings],
  )

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
}

function SavingsBootstrap() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-4 text-sm text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <p>Loading savings…</p>
    </div>
  )
}

export function SavingsProvider({ children }: { children: ReactNode }) {
  const { user, guestSession } = useAuth()
  const uid = user?.uid

  if (uid) {
    return <CloudSavingsProvider uid={uid}>{children}</CloudSavingsProvider>
  }

  const guestActive = guestSession || readGuestSessionFlag()
  if (guestActive) {
    return <GuestSavingsProvider>{children}</GuestSavingsProvider>
  }

  return <SavingsBootstrap />
}

export function useSavings() {
  const ctx = useContext(SavingsContext)
  if (!ctx) throw new Error('useSavings must be used within SavingsProvider')
  return ctx
}
