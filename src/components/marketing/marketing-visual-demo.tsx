import { landingAssets } from '@/components/marketing/assets'

export function MarketingVisualDemo() {
  return (
    <section id="demo" className="scroll-mt-20 border-t border-[#EAEAEA] bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem]">
            Built for calm financial routines
          </h2>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            A guided tour of the kind of clarity Spendly surfaces — visual from the Financen template, narrative
            rewritten for budgeting workflows.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <figure className="relative overflow-hidden rounded-sm border border-[#DEDEDE] bg-white shadow-md">
            <div className="relative aspect-[370/250] w-full bg-[#F7F7F7]">
              <img
                src={landingAssets.visualDemo}
                alt="Spendly workspace preview — charts and cards (static image)"
                width={740}
                height={500}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#252B42]">Most trusted structure, rebuilt for individuals</h3>
            <p className="text-sm font-medium leading-relaxed text-[#737373]">
              Spendly keeps the polished layout language of the Financen finance landing — full-width sections, strong
              typographic hierarchy, and generous whitespace — while focusing every paragraph on personal money
              management.
            </p>
            <ul className="space-y-4">
              {[
                'Workspace themes that respect marketing vs. app surfaces',
                'Exports and backups when you are ready to own your data',
                'Spendly AI that never leaves your browser for guest sessions',
              ].map((line) => (
                <li key={line} className="flex gap-3 text-sm font-semibold text-[#252B42]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#23A6F0]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
