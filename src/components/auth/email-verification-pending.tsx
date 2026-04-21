import { Loader2, MailCheck, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Props = {
  email: string | null
  onResend: () => Promise<void>
  onRecheck: () => Promise<void>
  onSignOut: () => Promise<void>
}

export function EmailVerificationPending({ email, onResend, onRecheck, onSignOut }: Props) {
  const [resendBusy, setResendBusy] = useState(false)
  const [recheckBusy, setRecheckBusy] = useState(false)
  const [signOutBusy, setSignOutBusy] = useState(false)

  const handleResend = async () => {
    setResendBusy(true)
    try {
      await onResend()
      toast.success('Verification email sent. Check your inbox.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not send email')
    } finally {
      setResendBusy(false)
    }
  }

  const handleRecheck = async () => {
    setRecheckBusy(true)
    try {
      await onRecheck()
    } finally {
      setRecheckBusy(false)
    }
  }

  const handleSignOut = async () => {
    setSignOutBusy(true)
    try {
      await onSignOut()
    } finally {
      setSignOutBusy(false)
    }
  }

  return (
    <div className="mt-10 flex max-w-[440px] flex-col gap-6">
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <MailCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 space-y-2">
            <h2 className="text-base font-semibold text-foreground">Verify your email to continue</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your account is active, but you need to confirm your email before you can open the Spendly workspace.
              {email ? (
                <>
                  {' '}
                  We sent a link to <span className="font-medium text-foreground">{email}</span>.
                </>
              ) : null}{' '}
              If you don&apos;t see it within a few minutes, check your spam or promotions folder.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="default"
          className="h-11 flex-1 gap-2 sm:min-w-[160px]"
          disabled={resendBusy}
          onClick={() => void handleResend()}
        >
          {resendBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Resend verification email
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 gap-2 sm:min-w-[160px]"
          disabled={recheckBusy}
          onClick={() => void handleRecheck()}
        >
          {recheckBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
          I&apos;ve verified — refresh status
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Wrong account?{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline disabled:opacity-50"
          disabled={signOutBusy}
          onClick={() => void handleSignOut()}
        >
          {signOutBusy ? 'Signing out…' : 'Sign out'}
        </button>
      </p>
    </div>
  )
}
