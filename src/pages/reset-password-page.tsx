import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Info, KeyRound, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

type LinkStatus = 'none' | 'checking' | 'valid' | 'invalid'
type Phase = 'form' | 'submitting' | 'success'

function parseFromWindow() {
  if (typeof window === 'undefined') {
    return { oobCode: '', mode: null as string | null }
  }
  return parseFirebaseOutOfBandParams(window.location.search, window.location.hash)
}

export function ResetPasswordPage() {
  const { firebaseEnabled } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [parsed, setParsed] = useState(parseFromWindow)

  useLayoutEffect(() => {
    const fromRouter = parseFirebaseOutOfBandParams(location.search, location.hash)
    const fromWin = parseFromWindow()
    const next = fromRouter.oobCode ? fromRouter : fromWin.oobCode ? fromWin : fromRouter
    setParsed(next)
  }, [location.search, location.hash])

  useEffect(() => {
    const sync = () => setParsed(parseFromWindow())
    sync()
    const t = window.setTimeout(sync, 50)
    const t2 = window.setTimeout(sync, 300)
    window.addEventListener('hashchange', sync)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const { oobCode, mode } = parsed

  useLayoutEffect(() => {
    if (!oobCode) return
    const inSearch = new URLSearchParams(location.search).has('oobCode')
    if (inSearch) return
    if (!location.hash && !window.location.hash) return
    const qs = new URLSearchParams()
    qs.set('oobCode', oobCode)
    qs.set('mode', mode ?? 'resetPassword')
    navigate({ pathname: location.pathname, search: `?${qs.toString()}`, hash: '' }, { replace: true })
  }, [oobCode, mode, location.hash, location.pathname, location.search, navigate])

  const [linkStatus, setLinkStatus] = useState<LinkStatus>(() => (oobCode ? 'checking' : 'none'))
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('form')
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

    if (!oobCode.trim()) {
      setLinkStatus('none')
      setAccountEmail(null)
      setVerifyError(null)
      verifiedOobRef.current = null
      return
    }

    if (isWrongModeForPasswordReset(mode)) {
      setLinkStatus('invalid')
      setVerifyError('This link is not for password reset. Use the link from your latest Spendly reset email.')
      setAccountEmail(null)
      verifiedOobRef.current = null
      return
    }

    if (verifiedOobRef.current === oobCode) {
      setLinkStatus('valid')
      return
    }

    let cancelled = false
    setLinkStatus('checking')
    setVerifyError(null)

    void verifySpendlyPasswordResetCode(oobCode)
      .then((email) => {
        if (cancelled) return
        verifiedOobRef.current = oobCode
        setAccountEmail(email)
        setLinkStatus('valid')
      })
      .catch((e) => {
        if (cancelled) return
        verifiedOobRef.current = null
        setAccountEmail(null)
        setVerifyError(mapFirebaseAuthError(e))
        setLinkStatus('invalid')
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
      setFormError('Use the full link from your reset email (it includes a security code). Or request a new reset below.')
      toast.error('Reset link incomplete')
      return
    }
    if (linkStatus === 'invalid' || linkStatus === 'checking') {
      setFormError(
        linkStatus === 'checking'
          ? 'Still checking your link—wait a moment, then try again.'
          : 'This reset link cannot be used. Request a new one from the sign-in page.',
      )
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
      setPhase('form')
    }
  })

  const handleGoSignInNow = () => {
    clearRedirectTimer()
    goSignInSuccess()
  }

  const formDisabled = linkStatus === 'checking' || phase === 'submitting'
  const hintBannerClass =
    'rounded-2xl border px-4 py-3 text-sm leading-relaxed'

  if (!firebaseEnabled) {
    return (
      <AuthLayout formMaxWidthClassName="max-w-xl">
        <AuthCard
          variant="elevated"
          dense
          preTitle={<KeyRound className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />}
          title="Reset password"
          description="Cloud sign-in is not configured in this environment."
        >
          <FirebaseSetupHelp className="mt-8 text-xs sm:text-sm" />
        </AuthCard>
        <div className="mt-8 text-center text-sm text-muted-foreground md:mt-10">
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
    <AuthLayout formMaxWidthClassName="max-w-xl">
      <AuthCard
        variant="elevated"
        dense
        preTitle={<KeyRound className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />}
        title="Set a new password"
        description={
          accountEmail ? (
            <>
              Signed-in email: <span className="font-medium text-foreground">{accountEmail}</span>. Choose a password
              you have not used here before, then confirm it in the second field.
            </>
          ) : (
            'Choose a new password and confirm it. You will use this password the next time you sign in to Spendly.'
          )
        }
      >
        {linkStatus === 'checking' ? (
          <div
            className={cn(
              hintBannerClass,
              'mt-5 flex items-center gap-3 border-primary/20 bg-primary/[0.06] text-foreground',
            )}
          >
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" aria-hidden />
            <span className="font-medium">Checking your reset link…</span>
          </div>
        ) : null}

        {linkStatus === 'none' ? (
          <div
            className={cn(
              hintBannerClass,
              'mt-5 flex gap-3 border-border/80 bg-muted/30 text-muted-foreground',
            )}
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Open this page from your email</p>
              <p>
                The reset link from Spendly should open this screen with a security code in the address. If you landed
                here without that code, use the buttons below—your password fields are still here for when you return
                with a fresh link.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="button" size="sm" className="rounded-lg font-semibold" asChild>
                  <Link to={FORGOT_PASSWORD_PATH}>Request new reset email</Link>
                </Button>
                <Button type="button" size="sm" variant="outline" className="rounded-lg font-semibold" asChild>
                  <Link to={SIGN_IN_PATH}>Back to Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {linkStatus === 'invalid' && verifyError ? (
          <div
            className={cn(
              hintBannerClass,
              'mt-5 space-y-3 border-amber-500/25 bg-amber-500/[0.07] text-foreground dark:bg-amber-500/10',
            )}
          >
            <p className="font-semibold text-foreground">This link cannot complete a reset</p>
            <p className="text-muted-foreground">{verifyError}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" className="rounded-lg font-semibold" asChild>
                <Link to={FORGOT_PASSWORD_PATH}>Request new reset email</Link>
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-lg font-semibold" asChild>
                <Link to={SIGN_IN_PATH}>Back to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : null}

        <form className="mt-5 flex flex-col gap-4 lg:mt-6" onSubmit={onSubmit} noValidate>
          <AuthFormError message={formError} />

          <p className="text-[0.6875rem] leading-snug text-muted-foreground lg:text-[0.7rem]">
            Use at least 8 characters. Mix letters and numbers where you can—avoid obvious words or anything someone
            could guess from your profile.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
            <AuthPasswordField
              id="rp-password"
              label="New password"
              autoComplete="new-password"
              appearance="figma"
              showLockIcon={false}
              placeholder="Type your new password"
              error={form.formState.errors.password?.message}
              registration={form.register('password', { disabled: formDisabled })}
            />
            <AuthPasswordField
              id="rp-confirm"
              label="Confirm new password"
              autoComplete="new-password"
              appearance="figma"
              showLockIcon={false}
              placeholder="Re-enter your new password"
              error={form.formState.errors.confirm?.message}
              registration={form.register('confirm', { disabled: formDisabled })}
            />
          </div>

          <div className="flex flex-col items-stretch gap-3 pt-1 lg:gap-2.5">
            <AuthSubmitButton
              className="max-w-none"
              loading={phase === 'submitting'}
              loadingLabel="Updating password…"
              disabled={formDisabled}
            >
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

      <div className="mt-8 flex w-full shrink-0 flex-col gap-5 md:mt-10 md:gap-6">
        <div className="text-center text-sm text-muted-foreground">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </div>
    </AuthLayout>
  )
}
