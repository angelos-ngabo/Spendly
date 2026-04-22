import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SIGN_IN_PATH, SIGN_UP_PATH } from '@/components/layout/nav'
import { Button } from '@/components/ui/button'

export function MarketingCta({
  firebaseEnabled,
  onOpenApp,
}: {
  firebaseEnabled: boolean
  onOpenApp: () => void
}) {
  return (
    <section id="cta" className="scroll-mt-20 border-t border-[#EAEAEA] bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-sm border border-[#E5E5E5] bg-[#FAFAFA] px-6 py-12 text-center shadow-sm md:px-12 md:py-14">
          <h2 className="text-balance text-[1.5rem] font-bold tracking-tight text-[#252B42] md:text-[1.75rem]">
            Take control of your finances in minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm font-medium leading-relaxed text-[#737373]">
            Open Spendly to log transactions, review analytics, and consult Spendly AI on your own numbers—or create an
            account for encrypted sync, backups, and access across every device you use.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 min-w-[200px] gap-2 rounded-md bg-[#23A6F0] px-8 text-sm font-bold text-white shadow-md hover:bg-[#1a8fd4]"
            >
              <Link to={SIGN_UP_PATH} className="inline-flex items-center justify-center gap-2">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={onOpenApp} className="h-12 min-w-[180px] rounded-md border-[#D0D0D0] font-bold">
              Try Spendly as a guest
            </Button>
            {firebaseEnabled ? (
              <Button size="lg" variant="secondary" className="h-12 min-w-[180px] rounded-md font-bold" asChild>
                <Link to={SIGN_IN_PATH}>Sign in</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
