import onboardingHeroUrl from '@/assets/auth/figma-onboarding-hero.svg?url'
import { cn } from '@/lib/utils'

const ONBOARDING_HEADLINE = 'See your money clearly, in one place'
const ONBOARDING_BODY =
  'Log income and spending, organize categories, and follow your cash flow — Spendly keeps everything synced across your devices.'

const SIGN_UP_HEADLINE = 'Build your personal finance hub'
const SIGN_UP_BODY =
  'Create your Spendly profile with secure Firebase sync — budgets, insights, and goals stay with you on every sign-in.'

function CarouselDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm shadow-primary/30" />
      <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
      <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
    </div>
  )
}

export function AuthPromoPanel({ mode, compact }: { mode: 'sign-in' | 'sign-up'; compact?: boolean }) {
  const headline = mode === 'sign-in' ? ONBOARDING_HEADLINE : SIGN_UP_HEADLINE
  const body = mode === 'sign-in' ? ONBOARDING_BODY : SIGN_UP_BODY

  return (
    <div
      className={cn(
        'flex w-full max-w-[min(100%,36rem)] flex-col items-center',
        compact ? 'gap-5' : 'gap-14',
      )}
    >
      <p className="self-start text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Spendly
      </p>
      <img
        src={onboardingHeroUrl}
        alt=""
        width={524}
        height={391}
        className={cn(
          'w-full max-w-[524px] select-none object-contain mix-blend-multiply contrast-[1.02] dark:mix-blend-normal dark:opacity-95',
          compact ? 'max-h-36' : 'max-h-[min(52vh,391px)]',
        )}
        decoding="async"
      />
      <div className={cn('flex w-full max-w-md flex-col', compact ? 'gap-2' : 'gap-3')}>
        <h2
          className={cn(
            'font-bold leading-tight tracking-tight text-foreground',
            compact ? 'text-lg' : 'text-2xl sm:text-[1.75rem]',
          )}
        >
          {headline}
        </h2>
        <p className={cn('leading-relaxed text-muted-foreground', compact ? 'text-xs' : 'text-sm sm:text-[0.95rem]')}>
          {body}
        </p>
      </div>
      <CarouselDots />
    </div>
  )
}
