import type { ReactNode } from 'react'
import { AuthPromoPanel } from '@/components/auth/auth-promo-panel'
import { cn } from '@/lib/utils'

export function AuthLayout({
  mode,
  children,
  footer,
  formMaxWidthClassName = 'max-w-[440px]',
}: {
  mode: 'sign-in' | 'sign-up'
  children: ReactNode
  footer?: ReactNode
  formMaxWidthClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-svh flex-col bg-background text-foreground',
        /* Desktop: lock to viewport — no page scroll; phones keep natural min-height + overflow. */
        'lg:h-dvh lg:max-h-dvh lg:overflow-hidden',
      )}
    >
      <div className="border-b border-border/40 bg-gradient-to-b from-accent via-accent to-primary/[0.08] px-4 py-6 lg:hidden">
        <AuthPromoPanel mode={mode} compact />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,49.3%)_minmax(0,1fr)] lg:overflow-hidden">
        <aside
          className={cn(
            'relative hidden min-h-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-accent via-accent to-primary/[0.08] px-8 py-12 lg:flex lg:h-full',
          )}
          aria-label="Product onboarding"
        >
          <AuthPromoPanel mode={mode} />
        </aside>

        <div
          className={cn(
            'flex min-h-0 flex-col justify-start overflow-hidden bg-background px-4 py-10 sm:px-8 lg:h-full lg:justify-center lg:overflow-hidden lg:px-12 lg:py-16 xl:px-20',
          )}
        >
          <div className={cn('mx-auto w-full', formMaxWidthClassName)}>
            {children}
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
