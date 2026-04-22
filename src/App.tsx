import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/components/app-providers'
import { LANDING_PATH } from '@/components/layout/nav'
import { RequireAppSession } from '@/components/layout/require-app-session'
import { TransactionsShell } from '@/components/layout/transactions-shell'
import { PublicThemeLayout } from '@/components/theme/public-theme-layout'
import { VerifyEmailThemeLayout } from '@/components/theme/verify-email-theme-layout'
import { WorkspaceThemeProvider } from '@/components/theme/workspace-theme-provider'
import { AnalyticsPage } from '@/pages/analytics-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { LandingPage } from '@/pages/landing-page'
import { SavingsPage } from '@/pages/savings-page'
import { SettingsPage } from '@/pages/settings-page'
import { ForgotPasswordPage } from '@/pages/forgot-password-page'
import { ResetPasswordPage } from '@/pages/reset-password-page'
import { SignInPage } from '@/pages/sign-in-page'
import { SignUpPage } from '@/pages/sign-up-page'
import { VerifyEmailPage } from '@/pages/verify-email-page'
import { TransactionsPage } from '@/pages/transactions-page'

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route element={<PublicThemeLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route element={<VerifyEmailThemeLayout />}>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          <Route
            element={
              <WorkspaceThemeProvider>
                <RequireAppSession />
              </WorkspaceThemeProvider>
            }
          >
            <Route path="/app" element={<TransactionsShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="savings" element={<SavingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={LANDING_PATH} replace />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  )
}
