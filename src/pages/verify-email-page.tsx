import { applyActionCode } from 'firebase/auth'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SIGN_IN_PATH, SIGN_UP_PATH, VERIFY_EMAIL_PATH } from '@/components/layout/nav'
import { SpendlyWordmark } from '@/components/shared/spendly-wordmark'
import { SuccessStatePanel } from '@/components/shared/success-state-panel'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { mapFirebaseAuthError } from '@/lib/firebase-auth-errors'
import { getFirebaseAuth } from '@/services/firebase/config'
import { cn } from '@/lib/utils'

function doneStorageKey(oobCode: string) {
  return `spendly_verify_done_${oobCode.slice(0, 48)}`
}

type Phase = 'loading' | 'success' | 'error' | 'idle' | 'wrong-mode'

export function VerifyEmailPage() {
  const { firebaseEnabled, refreshAuthUser } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>(() => (searchParams.get('oobCode') ? 'loading' : 'idle'))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const redirectTimerRef = useRef<number | null>(null)

  const goSignIn = useCallback(() => {
    navigate(SIGN_IN_PATH, { replace: true, state: { emailVerifiedFromLink: true } })
  }, [navigate])

  const clearRedirectTimer = useCallback(() => {
    if (redirectTimerRef.current != null) {
      window.clearTimeout(redirectTimerRef.current)
      redirectTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!firebaseEnabled) {
      setPhase('idle')
      return
    }

    const oobCode = searchParams.get('oobCode')
    const mode = searchParams.get('mode')

    if (!oobCode) {
      setPhase((p) => (p === 'success' ? 'success' : 'idle'))
      return
    }

    if (mode && mode !== 'verifyEmail') {
      setPhase('wrong-mode')
      setErrorMessage('This link is not for email verification.')
      return
    }

    if (sessionStorage.getItem(doneStorageKey(oobCode)) === '1') {
      setPhase('success')
      if (searchParams.get('oobCode')) {
        navigate({ pathname: VERIFY_EMAIL_PATH, search: '' }, { replace: true })
      }
      return
    }

    let cancelled = false
    setPhase('loading')

    const run = async () => {
      try {
        const auth = getFirebaseAuth()
        await applyActionCode(auth, oobCode)
        if (cancelled) return
        if (auth.currentUser) {
          await refreshAuthUser()
        }
        sessionStorage.setItem(doneStorageKey(oobCode), '1')
        navigate({ pathname: VERIFY_EMAIL_PATH, search: '' }, { replace: true })
        if (!cancelled) {
          setPhase('success')
        }
      } catch (e) {
        if (cancelled) return
        setErrorMessage(mapFirebaseAuthError(e))
        setPhase('error')
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [firebaseEnabled, navigate, refreshAuthUser, searchParams])

  useEffect(() => {
    if (phase !== 'success') return
    redirectTimerRef.current = window.setTimeout(() => {
      redirectTimerRef.current = null
      goSignIn()
    }, 2800)
    return () => clearRedirectTimer()
  }, [phase, goSignIn, clearRedirectTimer])

  const handleGoSignInNow = () => {
    clearRedirectTimer()
    goSignIn()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <header className="mb-10 flex justify-center sm:mb-12">
          <SpendlyWordmark asLink />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center">
          {!firebaseEnabled ? (
            <div className="w-full max-w-md">
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Firebase is not configured, so verification links cannot be processed in this build.
              </p>
              <FirebaseSetupHelp />
            </div>
          ) : phase === 'loading' ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
              <p className="text-sm font-medium">Verifying your email…</p>
            </div>
          ) : phase === 'success' ? (
            <SuccessStatePanel
              icon={<Check className="h-8 w-8 stroke-[2.5]" aria-hidden />}
              title="Email Verified Successfully"
              subtitle="Your account is now fully activated. You can sign in and start managing your finances in Spendly."
            >
              <div className="flex flex-col gap-3">
                <Button type="button" size="lg" className="h-12 w-full font-semibold" onClick={handleGoSignInNow}>
                  Go to Sign In
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  You&apos;ll be redirected to sign in automatically in a few seconds.
                </p>
              </div>
            </SuccessStatePanel>
          ) : phase === 'error' || phase === 'wrong-mode' ? (
            <div
              className={cn(
                'spendly-animate-enter w-full max-w-md rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-8 text-center dark:bg-destructive/10',
              )}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <AlertCircle className="h-7 w-7" aria-hidden />
              </div>
              <h1 className="text-lg font-bold text-foreground sm:text-xl">
                {phase === 'wrong-mode' ? 'Link not supported' : 'Invalid or expired verification link'}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {errorMessage ??
                  'This link may have expired or already been used. Sign in and resend a new verification email from your account.'}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button type="button" className="h-11 font-semibold" asChild>
                  <Link to={SIGN_IN_PATH}>Back to Sign In</Link>
                </Button>
                <Button type="button" variant="outline" className="h-11 font-semibold" asChild>
                  <Link to={SIGN_UP_PATH}>Create an account</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                After signing in, use &quot;Resend verification email&quot; if you still need a new link.
              </p>
            </div>
          ) : (
            <div className="spendly-animate-enter w-full max-w-md rounded-2xl border border-border/70 bg-card px-6 py-10 text-center shadow-sm">
              <h1 className="text-lg font-bold text-foreground sm:text-xl">Verify your email</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Open the verification link we sent to your inbox. If this page stays empty, the link may be missing or
                incomplete.
              </p>
              <Button type="button" className="mt-8 h-11 font-semibold" asChild>
                <Link to={SIGN_IN_PATH}>Go to Sign In</Link>
              </Button>
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          If you did not create a Spendly account, you can safely ignore emails from us.
        </footer>
      </div>
    </div>
  )
}
