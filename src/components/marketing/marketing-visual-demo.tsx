import { landingAssets } from '@/components/marketing/assets'

export function MarketingVisualDemo() {
  return (
    <section id="demo" className="scroll-mt-20 border-t border-[#EAEAEA] bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem]">
            A dashboard designed for clarity and control
          </h2>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            This is the Spendly workspace in action: balances, charts, and summaries arranged so you see what moved,
            why it matters, and what deserves attention next—without hunting through tabs or exports.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <figure className="relative overflow-hidden rounded-sm border border-[#DEDEDE] bg-white shadow-md">
            <div className="relative aspect-[370/250] w-full bg-[#F7F7F7]">
              <img
                src={landingAssets.visualDemo}
                alt="Spendly workspace preview showing balances, charts, and summary cards"
                width={740}
                height={500}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#252B42]">Insight-forward design for individuals and households</h3>
            <p className="text-sm font-medium leading-relaxed text-[#737373]">
              Typography, spacing, and hierarchy are tuned for financial data: dense when you need detail, breathable
              when you need to think. The result is a product surface that feels credible today and still readable after
              months of daily use.
            </p>
            <ul className="space-y-4">
              {[
                'Separate presentation for marketing pages and the signed-in workspace so context always feels intentional.',
                'Exports and backups when you want a portable copy of your ledger or an extra layer of ownership.',
                'Spendly AI runs in your browser for guest sessions—your questions stay with your session, not a third-party model API.',
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
