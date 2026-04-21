import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { landingAssets } from '@/components/marketing/assets'
import { MarketingHeroPhonePremium } from '@/components/marketing/marketing-hero-phone-premium'
import { MarketingNav } from '@/components/marketing/marketing-nav'

export function MarketingHero({
  firebaseEnabled,
  onOpenApp,
  onGuestStart,
}: {
  firebaseEnabled: boolean
  onOpenApp: () => void
  onGuestStart: () => void
}) {
  return (
    <section className="relative isolate overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 origin-center scale-[0.92] bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: `url(${landingAssets.heroCover})` }}
        />
      </div>
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-16 pt-6 md:px-10 md:pb-20 md:pt-7 lg:px-16">
        <div className="relative z-20">
          <MarketingNav firebaseEnabled={firebaseEnabled} onPrimaryCta={onOpenApp} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-10 md:mt-12 lg:mt-16 lg:flex-row lg:items-center lg:justify-center lg:gap-8 xl:gap-9">
          <div className="w-full max-w-xl flex-none space-y-6 text-center lg:max-w-[min(100%,28rem)] lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-[11px]">
              Your financial assistant
            </p>
            <h1 className="text-balance text-[2.1rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.85rem]">
              Manage money with clarity, not complexity.
            </h1>
            <p className="mx-auto max-w-lg text-pretty text-sm font-medium leading-relaxed text-white/88 md:text-[15px] md:leading-relaxed lg:mx-0">
              Spendly helps you track income and expenses, plan savings, and understand patterns — with Spendly AI for
              plain-language insights. Start on your device, then turn on cloud sync when you are ready.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Button
                type="button"
                size="lg"
                onClick={onGuestStart}
                className="h-12 gap-2 rounded-[27px] bg-[#23A6F0] px-8 text-sm font-bold text-white shadow-lg shadow-black/30 hover:bg-[#1a8fd4]"
              >
                Track your spending
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={onOpenApp}
                className="h-12 rounded-[27px] border-white/85 bg-transparent px-8 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
              >
                Open workspace
              </Button>
            </div>
            {firebaseEnabled ? (
              <p className="text-xs font-medium text-white/70">
                Need cloud backup?{' '}
                <Link to="/sign-up" className="font-semibold text-white underline-offset-2 hover:underline">
                  Create an account
                </Link>
              </p>
            ) : null}
          </div>

          <div className="relative mt-2 flex w-full max-w-[min(380px,88vw)] shrink-0 justify-center overflow-visible sm:mt-3 lg:mt-8 lg:w-auto lg:max-w-[min(400px,36vw)] xl:mt-10 xl:max-w-[420px]">
            <MarketingHeroPhonePremium className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
