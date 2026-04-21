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
import { backupSchema, transactionSchema, transactionsArraySchema } from '@/lib/schemas'
import { useLocalStorageTransactions } from '@/hooks/useLocalStorageTransactions'
import {
  createUserTransaction,
  deleteUserTransaction,
  fetchUserTransactionsOnce,
  mergeUserTransactions,
  replaceAllUserTransactions,
  subscribeUserTransactions,
  updateUserTransaction,
} from '@/services/firebase/transactions'
import type { Transaction } from '@/types/transaction'
import { readGuestSessionFlag } from '@/lib/guest-storage'
import { useAuth } from '@/context/auth-context'
import { Loader2 } from 'lucide-react'

type NewTransactionInput = Omit<Transaction, 'id' | 'createdAt'>

export type TransactionsContextValue = {
  transactions: Transaction[]
  transactionsLoading: boolean
  transactionsError: string | null
  addTransaction: (input: NewTransactionInput) => void
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void
  importBackup: (
    raw: unknown,
    mode: 'replace' | 'merge',
  ) => Promise<{ ok: true; count: number } | { ok: false; message: string }>
  importTransactionsArray: (
    raw: unknown,
    mode: 'replace' | 'merge',
  ) => Promise<{ ok: true; count: number } | { ok: false; message: string }>
  replaceAll: (next: Transaction[]) => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

function GuestTransactionsProvider({ children }: { children: ReactNode }) {
  const { transactions, setTransactions, replaceAll: persistAll } = useLocalStorageTransactions()

  const replaceAll = useCallback(async (next: Transaction[]) => {
    persistAll(next)
  }, [persistAll])

  const addTransaction = useCallback(
    (input: NewTransactionInput) => {
      const parsed = transactionSchema.safeParse({
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      })
      if (!parsed.success) {
        toast.error('Could not add transaction')
        return
      }
      setTransactions((prev) => [parsed.data, ...prev])
      toast.success('Transaction added')
    },
    [setTransactions],
  )

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
      setTransactions((prev) => {
        const current = prev.find((t) => t.id === id)
        if (!current) return prev
        const merged = { ...current, ...patch }
        const check = transactionSchema.safeParse(merged)
        if (!check.success) {
          queueMicrotask(() => toast.error('Could not update transaction'))
          return prev
        }
        queueMicrotask(() => toast.success('Transaction updated'))
        return prev.map((t) => (t.id === id ? check.data : t))
      })
    },
    [setTransactions],
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      toast.success('Transaction removed')
    },
    [setTransactions],
  )

  const importTransactionsArray = useCallback(
    async (raw: unknown, mode: 'replace' | 'merge') => {
      const res = transactionsArraySchema.safeParse(raw)
      if (!res.success) {
        return { ok: false as const, message: 'Invalid transactions JSON' }
      }
      if (mode === 'replace') {
        await replaceAll(res.data)
        return { ok: true as const, count: res.data.length }
      }
      const map = new Map(transactions.map((t) => [t.id, t]))
      for (const t of res.data) map.set(t.id, t)
      await replaceAll([...map.values()])
      return { ok: true as const, count: res.data.length }
    },
    [replaceAll, transactions],
  )

  const importBackup = useCallback(
    async (raw: unknown, mode: 'replace' | 'merge') => {
      const parsed = backupSchema.safeParse(raw)
      if (!parsed.success) {
        return { ok: false as const, message: 'Invalid Spendly backup file' }
      }
      return importTransactionsArray(parsed.data.transactions, mode)
    },
    [importTransactionsArray],
  )

  const value = useMemo<TransactionsContextValue>(
    () => ({
      transactions,
      transactionsLoading: false,
      transactionsError: null,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      importBackup,
      importTransactionsArray,
      replaceAll,
    }),
    [
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      importBackup,
      importTransactionsArray,
      replaceAll,
    ],
  )

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

function CloudTransactionsProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => setTransactionsLoading(true))

    void fetchUserTransactionsOnce(uid)
      .then((rows) => {
        if (cancelled) return
        setTransactions(rows)
        setTransactionsLoading(false)
        setTransactionsError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : 'Could not load transactions'
        setTransactionsError(msg)
        setTransactionsLoading(false)
      })

    const unsub = subscribeUserTransactions(
      uid,
      (rows) => {
        if (cancelled) return
        setTransactions(rows)
        setTransactionsLoading(false)
        setTransactionsError(null)
      },
      (msg) => {
        if (cancelled) return
        setTransactionsError(msg)
        setTransactionsLoading(false)
        toast.error('Could not sync your transactions')
      },
    )
    return () => {
      cancelled = true
      unsub()
    }
  }, [uid])

  const addTransaction = useCallback(
    (input: NewTransactionInput) => {
      void (async () => {
        const parsed = transactionSchema.safeParse({
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        })
        if (!parsed.success) {
          toast.error('Could not add transaction')
          return
        }
        try {
          await createUserTransaction(uid, parsed.data)
          toast.success('Transaction added')
        } catch {
          toast.error('Could not add transaction')
        }
      })()
    },
    [uid],
  )

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
      void (async () => {
        const current = transactions.find((t) => t.id === id)
        if (!current) return
        const merged = { ...current, ...patch }
        const check = transactionSchema.safeParse(merged)
        if (!check.success) {
          toast.error('Could not update transaction')
          return
        }
        try {
          await updateUserTransaction(uid, check.data)
          toast.success('Transaction updated')
        } catch {
          toast.error('Could not update transaction')
        }
      })()
    },
    [transactions, uid],
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      void (async () => {
        try {
          await deleteUserTransaction(uid, id)
          toast.success('Transaction removed')
        } catch {
          toast.error('Could not remove transaction')
        }
      })()
    },
    [uid],
  )

  const replaceAll = useCallback(async (next: Transaction[]) => {
    try {
      await replaceAllUserTransactions(uid, next)
    } catch {
      toast.error('Could not replace transactions')
      throw new Error('replace_failed')
    }
  }, [uid])

  const importTransactionsArray = useCallback(
    async (raw: unknown, mode: 'replace' | 'merge') => {
      const res = transactionsArraySchema.safeParse(raw)
      if (!res.success) {
        return { ok: false as const, message: 'Invalid transactions JSON' }
      }
      try {
        if (mode === 'replace') {
          await replaceAllUserTransactions(uid, res.data)
          return { ok: true as const, count: res.data.length }
        }
        await mergeUserTransactions(uid, res.data)
        return { ok: true as const, count: res.data.length }
      } catch {
        return { ok: false as const, message: 'Could not import into Firestore' }
      }
    },
    [uid],
  )

  const importBackup = useCallback(
    async (raw: unknown, mode: 'replace' | 'merge') => {
      const parsed = backupSchema.safeParse(raw)
      if (!parsed.success) {
        return { ok: false as const, message: 'Invalid Spendly backup file' }
      }
      return importTransactionsArray(parsed.data.transactions, mode)
    },
    [importTransactionsArray],
  )

  const value = useMemo<TransactionsContextValue>(
    () => ({
      transactions,
      transactionsLoading,
      transactionsError,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      importBackup,
      importTransactionsArray,
      replaceAll,
    }),
    [
      transactions,
      transactionsLoading,
      transactionsError,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      importBackup,
      importTransactionsArray,
      replaceAll,
    ],
  )

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

function TransactionsBootstrap() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-4 text-sm text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <p>Loading your workspace…</p>
    </div>
  )
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user, guestSession } = useAuth()
  const uid = user?.uid

  if (uid) {
    return <CloudTransactionsProvider uid={uid}>{children}</CloudTransactionsProvider>
  }

  const guestActive = guestSession || readGuestSessionFlag()
  if (guestActive) {
    return <GuestTransactionsProvider>{children}</GuestTransactionsProvider>
  }

  return <TransactionsBootstrap />
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider')
  return ctx
}
