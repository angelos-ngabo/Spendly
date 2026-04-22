import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { SIGN_IN_PATH } from '@/components/layout/nav'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthFormError } from '@/components/auth/auth-form-error'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'
import { AuthTextField } from '@/components/auth/auth-textfield'
import { BackToHomeLink } from '@/components/auth/back-to-home-link'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'
import { useAuth } from '@/context/auth-context'
import { mapFirebaseAuthError } from '@/lib/firebase-auth-errors'
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/password-reset-schema'
import { isForgotPasswordEnumerationSafeSuccess, sendSpendlyPasswordResetEmail } from '@/services/firebase/password-reset'

export function ForgotPasswordPage() {
  const { firebaseEnabled } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema) as Resolver<ForgotPasswordValues>,
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    setSubmitting(true)
    try {
      await sendSpendlyPasswordResetEmail(values.email)
      setSent(true)
      toast.success('If an account exists for that email, a reset link is on the way.')
    } catch (e) {
      if (isForgotPasswordEnumerationSafeSuccess(e)) {
        setSent(true)
        toast.success('If an account exists for that email, a reset link is on the way.')
        return
      }
      const message = mapFirebaseAuthError(e)
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout>
      <div className="flex w-full flex-col">
        <AuthCard
          variant="plain"
          preTitle={<KeyRound className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />}
          title="Forgot your password?"
          description="Enter the email you use for Spendly. If we find an account, we will send a secure link to choose a new password."
        >
          {!firebaseEnabled ? (
            <FirebaseSetupHelp className="mt-8 text-xs sm:text-sm" />
          ) : sent ? (
            <div className="mt-8 space-y-6">
              <div className="flex gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.08] p-4 text-left">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-foreground">We&apos;ve sent a reset link to your email address.</p>
                  <p className="leading-relaxed text-muted-foreground">
                    Check your inbox and spam folder. The link expires after a short time for your security. After you set
                    a new password, you can sign in with it right away.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to={SIGN_IN_PATH}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  Back to Sign In
                </Link>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:bg-muted/60"
                  onClick={() => {
                    setSent(false)
                    form.reset({ email: form.getValues('email') })
                  }}
                >
                  Send another link
                </button>
              </div>
            </div>
          ) : (
            <form className="mt-6 flex w-full flex-col gap-5 sm:mt-8 sm:gap-6 md:max-w-[440px]" onSubmit={onSubmit} noValidate>
              <AuthFormError message={formError} />
              <AuthTextField
                id="fp-email"
                label="Email address"
                type="email"
                autoComplete="email"
                appearance="figma"
                placeholder="you@example.com"
                labelEnd={<Info className="shrink-0" strokeWidth={1.75} aria-hidden />}
                title="We will only use this to find your account and send a reset link."
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
              <div className="flex flex-col items-center gap-4 pt-2">
                <AuthSubmitButton loading={submitting} loadingLabel="Sending link…" className="w-full max-w-none">
                  Send reset link
                </AuthSubmitButton>
                <p className="text-center text-sm font-semibold text-primary">
                  <Link className="hover:underline" to={SIGN_IN_PATH}>
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </AuthCard>

        <div className="mt-10 text-center text-sm text-muted-foreground md:mt-12">
          <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
        </div>
      </div>
    </AuthLayout>
  )
}
