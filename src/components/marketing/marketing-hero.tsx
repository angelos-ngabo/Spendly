import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { landingAssets } from '@/components/marketing/assets'
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
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingAssets.heroCover})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-6 md:pb-28 md:pt-8">
        <MarketingNav firebaseEnabled={firebaseEnabled} onPrimaryCta={onOpenApp} />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="max-w-xl space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-[11px]">
              Your financial assistant
            </p>
            <h1 className="text-balance text-[2.1rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.85rem]">
              Manage money with clarity, not complexity.
            </h1>
            <p className="max-w-lg text-pretty text-sm font-medium leading-relaxed text-white/88 md:text-[15px] md:leading-relaxed">
              Spendly helps you track income and expenses, plan savings, and understand patterns — with Spendly AI for
              plain-language insights. Start on your device, sync when you connect Firebase.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/40 backdrop-blur-[2px]">
              <img
                src={landingAssets.heroSideVisual}
                alt="Spendly dashboard preview illustration from Financen template"
                width={600}
                height={700}
                className="h-auto w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
