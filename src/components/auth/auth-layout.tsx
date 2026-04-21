import type { ReactNode } from 'react'
import { AuthLeftPanel } from '@/components/auth/auth-left-panel'
import { SpendlyWordmark } from '@/components/shared/spendly-wordmark'
import { cn } from '@/lib/utils'

export function AuthLayout({
  children,
  footer,
  formMaxWidthClassName = 'max-w-[440px]',
}: {
  children: ReactNode
  footer?: ReactNode
  formMaxWidthClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-svh flex-col bg-background text-foreground',
        'md:h-dvh md:max-h-dvh md:overflow-hidden',
      )}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2 md:overflow-hidden md:min-h-0">
        <aside
          className="relative hidden min-h-0 min-w-0 overflow-hidden md:block md:h-full md:min-h-0"
          aria-label="Spendly product story"
        >
          <AuthLeftPanel />
        </aside>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-background',
            'px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-10 md:max-h-full md:px-8 md:py-10 lg:px-12 xl:px-16',
          )}
        >
          <div className="mb-6 flex shrink-0 justify-center md:mb-0 md:hidden">
            <SpendlyWordmark />
          </div>

          <div className={cn('mx-auto flex w-full min-w-0 flex-col', formMaxWidthClassName)}>
            {children}
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
