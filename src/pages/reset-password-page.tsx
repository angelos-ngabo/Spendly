import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Check, KeyRound, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FORGOT_PASSWORD_PATH, SIGN_IN_PATH } from '@/components/layout/nav'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthFormError } from '@/components/auth/auth-form-error'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthPasswordField } from '@/components/auth/auth-password-field'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'
import { BackToHomeLink } from '@/components/auth/back-to-home-link'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'
import { SuccessStatePanel } from '@/components/shared/success-state-panel'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { mapFirebaseAuthError } from '@/lib/firebase-auth-errors'
import { isWrongModeForPasswordReset, parseFirebaseOutOfBandParams } from '@/lib/parse-firebase-out-of-band-params'
import { resetPasswordFormSchema, type ResetPasswordFormValues } from '@/lib/password-reset-schema'
import {
  confirmSpendlyPasswordReset,
  verifySpendlyPasswordResetCode,
} from '@/services/firebase/password-reset'
import { cn } from '@/lib/utils'

type Phase =
  | 'loading-code'
  | 'ready'
  | 'submitting'
  | 'success'
  | 'invalid'
  | 'wrong-mode'
  | 'no-code'

export function ResetPasswordPage() {
  const { firebaseEnabled } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { oobCode, mode } = useMemo(
    () => parseFirebaseOutOfBandParams(location.search, location.hash),
    [location.search, location.hash],
  )

  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'no-code'
    const initial = parseFirebaseOutOfBandParams(window.location.search, window.location.hash)
    if (!initial.oobCode) return 'no-code'
    if (isWrongModeForPasswordReset(initial.mode)) return 'wrong-mode'
    return 'loading-code'
  })

  /** Firebase sometimes delivers `oobCode` in the hash; normalize to query so refresh and routing stay consistent. */
  useLayoutEffect(() => {
    if (!oobCode) return
    const inSearch = new URLSearchParams(location.search).has('oobCode')
    if (inSearch) return
    if (!location.hash) return
    const qs = new URLSearchParams()
    qs.set('oobCode', oobCode)
    qs.set('mode', mode ?? 'resetPassword')
    navigate({ pathname: location.pathname, search: `?${qs.toString()}`, hash: '' }, { replace: true })
  }, [oobCode, mode, location.hash, location.pathname, location.search, navigate])
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const verifiedOobRef = useRef<string | null>(null)
  const redirectTimerRef = useRef<number | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema) as Resolver<ResetPasswordFormValues>,
    defaultValues: { password: '', confirm: '' },
  })

  const clearRedirectTimer = useCallback(() => {
    if (redirectTimerRef.current != null) {
      window.clearTimeout(redirectTimerRef.current)
      redirectTimerRef.current = null
    }
  }, [])

  const goSignInSuccess = useCallback(() => {
    clearRedirectTimer()
    navigate(SIGN_IN_PATH, { replace: true, state: { passwordResetSuccess: true } })
  }, [clearRedirectTimer, navigate])

  useEffect(() => {
    if (!firebaseEnabled) return

    if (!oobCode) {
      setPhase('no-code')
      return
    }

    if (isWrongModeForPasswordReset(mode)) {
      setPhase('wrong-mode')
      setCodeError('This link is not for password reset.')
      return
    }

    if (verifiedOobRef.current === oobCode) {
      setPhase('ready')
      return
    }

    let cancelled = false
    setPhase('loading-code')
    setCodeError(null)

    void verifySpendlyPasswordResetCode(oobCode)
      .then((email) => {
        if (cancelled) return
        verifiedOobRef.current = oobCode
        setAccountEmail(email)
        setPhase('ready')
      })
      .catch((e) => {
        if (cancelled) return
        setCodeError(mapFirebaseAuthError(e))
        setPhase('invalid')
      })

    return () => {
      cancelled = true
    }
  }, [firebaseEnabled, mode, oobCode])

  useEffect(() => {
    if (phase !== 'success') return
    redirectTimerRef.current = window.setTimeout(() => {
      redirectTimerRef.current = null
      goSignInSuccess()
    }, 2400)
    return () => clearRedirectTimer()
  }, [phase, goSignInSuccess, clearRedirectTimer])

  const onSubmit = form.handleSubmit(async (values) => {
    const code = oobCode.trim()
    if (!code) {
      setFormError('Reset link is missing. Request a new email from the sign-in page.')
      setPhase('no-code')
      return
    }
    setFormError(null)
    setPhase('submitting')
    try {
      await confirmSpendlyPasswordReset(code, values.password)
      setPhase('success')
      toast.success('Password updated')
    } catch (e) {
      const message = mapFirebaseAuthError(e)
      setFormError(message)
      toast.error(message)
      setPhase('ready')
    }
  })

  const handleGoSignInNow = () => {
    clearRedirectTimer()
    goSignInSuccess()
  }

  if (!firebaseEnabled) {
    return (
      <AuthLayout>
        <AuthCard
          variant="plain"
          preTitle={<KeyRound className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />}
          title="Reset password"
          description="Cloud sign-in is not configured in this environment."
        >
          <FirebaseSetupHelp className="mt-8 text-xs sm:text-sm" />
        </AuthCard>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </AuthLayout>
    )
  }

  if (phase === 'no-code' || phase === 'wrong-mode') {
    return (
      <AuthLayout>
        <div
          className={cn(
            'spendly-animate-enter w-full max-w-md rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-8 text-center dark:bg-destructive/10',
          )}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            {phase === 'wrong-mode' ? 'This link cannot be used here' : 'Missing reset link'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {phase === 'wrong-mode'
              ? (codeError ?? 'Open the password reset link from your latest Spendly email.')
              : 'Open the reset link from your email, or request a new password reset from the sign-in page.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" className="h-11 font-semibold" asChild>
              <Link to={FORGOT_PASSWORD_PATH}>Request new reset email</Link>
            </Button>
            <Button type="button" variant="outline" className="h-11 font-semibold" asChild>
              <Link to={SIGN_IN_PATH}>Back to Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </AuthLayout>
    )
  }

  if (phase === 'loading-code') {
    return (
      <AuthLayout formMaxWidthClassName="max-w-md">
        <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
          <p className="text-sm font-medium">Validating your reset link…</p>
        </div>
      </AuthLayout>
    )
  }

  if (phase === 'invalid') {
    return (
      <AuthLayout>
        <div className="spendly-animate-enter w-full max-w-md rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-8 text-center dark:bg-destructive/10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            This password reset link is invalid or has expired.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {codeError ?? 'Request a fresh link and try again. For your security, reset links can only be used once.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" className="h-11 font-semibold" asChild>
              <Link to={FORGOT_PASSWORD_PATH}>Request new reset email</Link>
            </Button>
            <Button type="button" variant="outline" className="h-11 font-semibold" asChild>
              <Link to={SIGN_IN_PATH}>Back to Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </AuthLayout>
    )
  }

  if (phase === 'success') {
    return (
      <AuthLayout formMaxWidthClassName="max-w-lg">
        <SuccessStatePanel
          icon={<Check className="h-8 w-8 stroke-[2.5]" aria-hidden />}
          title="Password updated"
          subtitle="Your Spendly password has been reset. Sign in with your new password to continue."
        >
          <Button type="button" size="lg" className="h-12 w-full font-semibold" onClick={handleGoSignInNow}>
            Go to Sign In
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Redirecting automatically in a moment…</p>
        </SuccessStatePanel>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        variant="plain"
        preTitle={<KeyRound className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />}
        title="Create a new password"
        description={
          accountEmail ? (
            <>
              Choose a strong password for <span className="font-medium text-foreground">{accountEmail}</span>. You will
              use it the next time you sign in.
            </>
          ) : (
            'Choose a strong password for your Spendly account. You will use it the next time you sign in.'
          )
        }
      >
        <form className="mt-6 flex w-full flex-col gap-5 sm:mt-8 sm:gap-6 md:max-w-[440px]" onSubmit={onSubmit} noValidate>
          <AuthFormError message={formError} />
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters. Avoid obvious words or personal information others could guess.
          </p>
          <AuthPasswordField
            id="rp-password"
            label="New password"
            autoComplete="new-password"
            appearance="figma"
            showLockIcon={false}
            placeholder="Enter a new password"
            error={form.formState.errors.password?.message}
            registration={form.register('password')}
          />
          <AuthPasswordField
            id="rp-confirm"
            label="Confirm new password"
            autoComplete="new-password"
            appearance="figma"
            showLockIcon={false}
            placeholder="Re-enter your new password"
            error={form.formState.errors.confirm?.message}
            registration={form.register('confirm')}
          />
          <div className="flex flex-col items-center gap-4 pt-2">
            <AuthSubmitButton loading={phase === 'submitting'} loadingLabel="Updating password…">
              Save new password
            </AuthSubmitButton>
            <p className="text-center text-sm font-semibold text-primary">
              <Link className="hover:underline" to={SIGN_IN_PATH}>
                Back to Sign In
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
      <div className="mt-10 text-center text-sm text-muted-foreground md:mt-12">
        <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
      </div>
    </AuthLayout>
  )
}
