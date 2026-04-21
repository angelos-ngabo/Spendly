import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/auth-context'
import { CurrencyPreferenceProvider } from '@/context/currency-preference-context'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyPreferenceProvider>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </CurrencyPreferenceProvider>
    </AuthProvider>
  )
}
