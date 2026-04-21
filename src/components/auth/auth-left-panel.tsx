import onboardingHeroUrl from '@/assets/auth/figma-onboarding-hero.svg?url'
import { cn } from '@/lib/utils'

const HEADLINE = 'See your money clearly, in one place'
const DESCRIPTION =
  'Log income and spending, organize categories, and follow your cash flow — Spendly keeps everything synced across your devices.'

const TAGLINE = 'Track. Plan. Save. Thrive.'

/** Blue hero column for auth split layouts (tablet/desktop). Not used on small phones. */
export function AuthLeftPanel() {
  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-chart-2 via-primary to-chart-5',
        'px-6 py-10 md:px-8 md:py-12',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_88%_58%_at_50%_-8%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(ellipse_55%_45%_at_85%_18%,rgba(35,166,240,0.14),transparent_55%),radial-gradient(circle_at_18%_72%,rgba(26,143,212,0.1),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.11)_1px,transparent_1.5px),radial-gradient(circle,rgba(35,166,240,0.14)_1px,transparent_1.5px)] opacity-50 [background-size:22px_22px,34px_34px] [background-position:0_0,11px_11px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/16 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-chart-2/18 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-chart-5/12 blur-2xl"
        aria-hidden
      />

      <div className="relative z-[1] flex w-full max-w-[min(100%,36rem)] flex-col items-center gap-10 md:gap-12 lg:gap-14">
        <div className="flex w-full flex-col gap-1 self-start">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-white sm:text-[0.9375rem]">SPENDLY</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-100/95 sm:text-xs">
            {TAGLINE}
          </p>
        </div>
        <img
          src={onboardingHeroUrl}
          alt=""
          width={524}
          height={391}
          className="w-full max-w-[524px] select-none object-contain brightness-[1.05] contrast-[1.05] saturate-[1.1] hue-rotate-[-4deg] drop-shadow-[0_20px_50px_rgba(11,90,138,0.45)] max-h-[min(46vh,391px)]"
          decoding="async"
        />
        <div className="flex w-full max-w-md flex-col gap-3">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-[1.75rem]">{HEADLINE}</h2>
          <p className="text-sm leading-relaxed text-sky-100/90 sm:text-[0.95rem]">{DESCRIPTION}</p>
        </div>
      </div>
    </div>
  )
}
