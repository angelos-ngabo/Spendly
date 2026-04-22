import { zodResolver } from '@hookform/resolvers/zod'
import { Info, User } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { APP_BASE, SIGN_IN_PATH } from '@/components/layout/nav'
import { BackToHomeLink } from '@/components/auth/back-to-home-link'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthFieldError } from '@/components/auth/auth-field-error'
import { AuthFormError } from '@/components/auth/auth-form-error'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthSupportingHighlights } from '@/components/auth/auth-supporting-highlights'
import { AuthPasswordField } from '@/components/auth/auth-password-field'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'
import { AuthTextField } from '@/components/auth/auth-textfield'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COUNTRY_DIAL_CODES, defaultCountryIso } from '@/data/country-dial-codes'
import { useAuth } from '@/context/auth-context'
import { signUpSchema, type SignUpValues } from '@/lib/auth-schemas'
import { cn } from '@/lib/utils'

const fieldShell =
  'h-12 rounded-2xl border-border/80 bg-muted/25 shadow-sm focus-visible:border-primary/45 focus-visible:bg-background focus-visible:ring-primary/20'

export function SignUpPage() {
  const { user, authLoading, signUpWithEmail, firebaseEnabled } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema) as Resolver<SignUpValues>,
    defaultValues: {
      fullName: '',
      phoneCountryIso: defaultCountryIso(),
      phoneNational: '',
      email: '',
      password: '',
      confirm: '',
    },
  })

  if (!authLoading && user?.emailVerified) {
    return <Navigate to={APP_BASE} replace />
  }

  if (!authLoading && user && !user.emailVerified) {
    return <Navigate to={SIGN_IN_PATH} replace />
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    setSubmitting(true)
    try {
      const { verificationEmailSent } = await signUpWithEmail(values)
      navigate(SIGN_IN_PATH, {
        replace: true,
        state: {
          signupWelcome: true,
          email: values.email.trim(),
          verificationEmailFailed: !verificationEmailSent,
        },
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not create account'
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout formMaxWidthClassName="max-w-xl">
      <div className="flex w-full flex-col">
        <AuthCard
          variant="elevated"
          dense
          preTitle={<span aria-hidden>👋</span>}
          title="Create your account"
          description="Add your details to open a Spendly wallet"
          className="relative z-10 shrink-0"
        >
          {!firebaseEnabled ? (
            <FirebaseSetupHelp className="mt-8 text-xs sm:text-sm" />
          ) : (
            <form className="mt-5 flex flex-col gap-4 lg:mt-4 lg:gap-3" onSubmit={onSubmit} noValidate>
              <AuthFormError message={formError} />

              <AuthTextField
                id="su-fullName"
                label="Full name"
                autoComplete="name"
                placeholder="e.g. Kalisa Johnson"
                leadingIcon={<User strokeWidth={1.75} />}
                error={form.formState.errors.fullName?.message}
                {...form.register('fullName')}
              />

              <div className="grid gap-1.5 lg:gap-2">
                <Label className="text-sm font-medium text-foreground">Phone number</Label>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:items-start">
                  <Controller
                    control={form.control}
                    name="phoneCountryIso"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-label="Country and calling code" className={cn('w-full', fieldShell)}>
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_DIAL_CODES.map((c) => (
                            <SelectItem key={c.iso} value={c.iso}>
                              {c.name} ({c.dial})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="su-phoneNational"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="National number (digits only)"
                    className={fieldShell}
                    aria-invalid={form.formState.errors.phoneNational ? true : undefined}
                    {...form.register('phoneNational')}
                  />
                </div>
                <AuthFieldError message={form.formState.errors.phoneCountryIso?.message} />
                <AuthFieldError message={form.formState.errors.phoneNational?.message} />
                <p className="text-[0.6875rem] leading-snug text-muted-foreground lg:text-[0.7rem]">
                  Pick your country code, then digits only — no + or country prefix in the number field.
                </p>
              </div>

              <AuthTextField
                id="su-email"
                label="Email address"
                type="email"
                autoComplete="email"
                appearance="figma"
                placeholder="Type your email address"
                labelEnd={<Info className="shrink-0" strokeWidth={1.75} aria-hidden />}
                title="We’ll use this for sign-in and account recovery."
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />

              <div className="grid gap-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-2">
                <AuthPasswordField
                  id="su-password"
                  label="Password"
                  autoComplete="new-password"
                  appearance="figma"
                  showLockIcon={false}
                  placeholder="Type your password"
                  error={form.formState.errors.password?.message}
                  registration={form.register('password')}
                />

                <AuthPasswordField
                  id="su-confirm"
                  label="Confirm password"
                  autoComplete="new-password"
                  appearance="figma"
                  showLockIcon={false}
                  placeholder="Re-enter your password"
                  error={form.formState.errors.confirm?.message}
                  registration={form.register('confirm')}
                />
              </div>

              <div className="flex flex-col items-stretch gap-3 pt-1 lg:gap-2.5">
                <AuthSubmitButton
                  className="max-w-none"
                  loading={submitting}
                  loadingLabel="Creating account…"
                >
                  Create account
                </AuthSubmitButton>
                <p className="text-center text-sm font-semibold text-primary">
                  <span className="font-normal text-muted-foreground">Already have an account? </span>
                  <Link className="hover:underline" to="/sign-in">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </AuthCard>

        {firebaseEnabled ? (
          <div className="mt-8 flex w-full shrink-0 flex-col gap-5 md:mt-10 md:gap-6">
            <AuthSupportingHighlights density="compact" className="hidden md:grid" />
            <div className="text-center text-sm text-muted-foreground">
              <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
            </div>
          </div>
        ) : (
          <div className="mt-6 shrink-0 text-center text-sm text-muted-foreground">
            <BackToHomeLink className="font-semibold text-primary underline-offset-4 hover:underline" />
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
