import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info } from 'lucide-react'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { APP_BASE, SIGN_UP_PATH } from '@/components/layout/nav'
import { BackToHomeLink } from '@/components/auth/back-to-home-link'
import { AuthCard } from '@/components/auth/auth-card'
import { EmailVerificationPending } from '@/components/auth/email-verification-pending'
import { AuthFormError } from '@/components/auth/auth-form-error'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthSupportingHighlights } from '@/components/auth/auth-supporting-highlights'
import { AuthPasswordField } from '@/components/auth/auth-password-field'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'
import { AuthTextField } from '@/components/auth/auth-textfield'
import { AlertBanner } from '@/components/ui/alert-banner'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { signInSchema, type SignInValues } from '@/lib/auth-schemas'

export type SignInLocationState = {
  signupWelcome?: boolean
  email?: string
  verificationEmailFailed?: boolean
  emailVerifiedFromLink?: boolean
}

export function SignInPage() {
  const {
    user,
    authLoading,
    signInWithEmail,
    firebaseEnabled,
    resendEmailVerification,
    refreshAuthUser,
    signOutEverywhere,
  } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [signupBanner, setSignupBanner] = useState<{
    email: string
    verificationEmailFailed: boolean
  } | null>(null)
  const [verifiedBanner, setVerifiedBanner] = useState(false)
  const dismissVerifiedBanner = useCallback(() => setVerifiedBanner(false), [])

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema) as Resolver<SignInValues>,
    defaultValues: { email: '', password: '' },
  })

  useLayoutEffect(() => {
    const s = (location.state ?? null) as SignInLocationState | null
    if (!s) return

    let changed = false
    const next: SignInLocationState = { ...s, signupWelcome: false, emailVerifiedFromLink: false }

    if (s.signupWelcome && s.email) {
      setSignupBanner({
        email: s.email,
        verificationEmailFailed: Boolean(s.verificationEmailFailed),
      })
      form.setValue('email', s.email)
      changed = true
    }
    if (s.emailVerifiedFromLink) {
      setVerifiedBanner(true)
      changed = true
    }

    if (changed) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: next })
    }
  }, [location.state, location.pathname, location.search, navigate, form])

  if (!authLoading && user?.emailVerified) {
    return <Navigate to={APP_BASE} replace />
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    setSubmitting(true)
    try {
      const result = await signInWithEmail(values.email.trim(), values.password)
      if (result === 'unverified') {
        toast.info('Please verify your email before using Spendly.')
        return
      }
      toast.success('Signed in')
      navigate(APP_BASE)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not sign in'
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout>
      <div className="flex w-full flex-col">
        {firebaseEnabled && verifiedBanner && !user ? (
          <div className="mb-6 shrink-0">
            <AlertBanner
              variant="success"
              message="Your email has been verified successfully. You can now sign in."
              dismissible
              autoHideMs={7000}
              onDismiss={dismissVerifiedBanner}
            />
          </div>
        ) : null}
        <AuthCard
          variant="plain"
          preTitle={<span aria-hidden>👋</span>}
          title="Welcome back!"
          description="Please login to access your account."
        >
        {!firebaseEnabled ? (
          <FirebaseSetupHelp className="mt-8 text-xs sm:text-sm" />
        ) : user && !user.emailVerified ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              You&apos;re signed in, but your email is not verified yet.
            </p>
            <EmailVerificationPending
              email={user.email}
              onResend={resendEmailVerification}
              onRecheck={async () => {
                const verified = await refreshAuthUser()
                if (verified) {
                  toast.success('Email verified — welcome to Spendly')
                  navigate(APP_BASE)
                } else {
                  toast.info('Still not verified. Open the link in your email, then try again.')
                }
              }}
              onSignOut={signOutEverywhere}
            />
          </>
        ) : (
          <>
            {signupBanner ? (
              <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.08] p-4 text-left">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">Your account has been created successfully</p>
                  <p className="leading-relaxed text-muted-foreground">
                    We sent a verification email to{' '}
                    <span className="font-medium text-foreground">{signupBanner.email}</span>. Please verify your email
                    before signing in.
                  </p>
                  {signupBanner.verificationEmailFailed ? (
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-500">
                      We could not send the verification email automatically. After you sign in, use &quot;Resend
                      verification email&quot; to try again.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <form className="mt-6 flex w-full flex-col gap-5 sm:mt-8 sm:gap-6 md:max-w-[440px] md:gap-7 lg:mt-10" onSubmit={onSubmit} noValidate>
              <AuthFormError message={formError} />
              <AuthTextField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                appearance="figma"
                placeholder="Type your email address"
                labelEnd={<Info className="shrink-0" strokeWidth={1.75} aria-hidden />}
                title="Spendly uses email and password sign-in."
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
              <AuthPasswordField
                id="password"
                label="Password"
                autoComplete="current-password"
                appearance="figma"
                showLockIcon={false}
                placeholder="Type your password"
                error={form.formState.errors.password?.message}
                registration={form.register('password')}
                forgotSlot={
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm font-semibold text-primary no-underline hover:underline"
                  >
                    Forgot password?
                  </Button>
                }
              />
              <div className="flex flex-col items-center gap-5 pt-2">
                <AuthSubmitButton loading={submitting} loadingLabel="Signing in…">
                  Log In
                </AuthSubmitButton>
                <p className="text-center text-sm font-semibold text-primary">
                  <span className="font-normal text-muted-foreground">Don&apos;t have an account? </span>
                  <Link className="hover:underline" to={SIGN_UP_PATH}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}

        </AuthCard>

        {firebaseEnabled ? (
          <div className="mt-10 flex w-full shrink-0 flex-col gap-6 md:mt-12 md:gap-8">
            <AuthSupportingHighlights density="comfortable" className="hidden md:grid" />
            <div className="text-center text-sm text-muted-foreground">
              <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
            </div>
          </div>
        ) : (
          <div className="mt-8 shrink-0 text-center text-sm text-muted-foreground">
            <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
