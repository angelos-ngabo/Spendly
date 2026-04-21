/* eslint-disable react-refresh/only-export-components -- provider + hook */
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
import { useAuth } from '@/context/auth-context'
import { DISPLAY_CURRENCIES, type DisplayCurrencyCode, parseDisplayCurrencyCode } from '@/lib/currencies'
import { formatCurrency } from '@/lib/format'
import { writeUserDisplayCurrency } from '@/services/firebase/user-profile'

const STORAGE_KEY = 'spendly-display-currency'
const DEFAULT_CURRENCY: DisplayCurrencyCode = 'USD'

function readStoredCurrency(): DisplayCurrencyCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = parseDisplayCurrencyCode(raw)
    return parsed ?? DEFAULT_CURRENCY
  } catch {
    return DEFAULT_CURRENCY
  }
}

function writeStoredCurrency(code: DisplayCurrencyCode) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore quota / private mode */
  }
}

type CurrencyPreferenceContextValue = {
  currency: DisplayCurrencyCode
  /** Format a ledger amount using the user’s display currency (relabels; no FX). */
  formatMoney: (amount: number) => string
  setCurrency: (code: DisplayCurrencyCode) => Promise<void>
  supported: readonly DisplayCurrencyCode[]
}

const CurrencyPreferenceContext = createContext<CurrencyPreferenceContextValue | null>(null)

export function CurrencyPreferenceProvider({ children }: { children: ReactNode }) {
  const { user, firebaseEnabled, accountProfile } = useAuth()
  const [currency, setCurrencyState] = useState<DisplayCurrencyCode>(readStoredCurrency)

  useEffect(() => {
    const fromProfile = accountProfile?.displayCurrency
    if (fromProfile) {
      setCurrencyState(fromProfile)
      writeStoredCurrency(fromProfile)
    }
  }, [user?.uid, accountProfile?.displayCurrency])

  const formatMoney = useCallback((amount: number) => formatCurrency(amount, currency), [currency])

  const setCurrency = useCallback(
    async (code: DisplayCurrencyCode): Promise<void> => {
      setCurrencyState(code)
      writeStoredCurrency(code)
      if (firebaseEnabled && user?.uid) {
        try {
          await writeUserDisplayCurrency(user.uid, code)
        } catch {
          toast.error('Could not save currency to your cloud profile. It still applies on this device.')
        }
      }
    },
    [firebaseEnabled, user?.uid],
  )

  const value = useMemo<CurrencyPreferenceContextValue>(
    () => ({
      currency,
      formatMoney,
      setCurrency,
      supported: DISPLAY_CURRENCIES,
    }),
    [currency, formatMoney, setCurrency],
  )

  return <CurrencyPreferenceContext.Provider value={value}>{children}</CurrencyPreferenceContext.Provider>
}

export function useMoneyFormat() {
  const ctx = useContext(CurrencyPreferenceContext)
  if (!ctx) throw new Error('useMoneyFormat must be used within CurrencyPreferenceProvider')
  return ctx
}
