import { BarChart3, PiggyBank, Sparkles, Wallet } from 'lucide-react'

const cards = [
  {
    icon: Wallet,
    title: 'Expense tracking',
    body: 'Log income and expenses with categories, dates, and notes so your ledger stays audit-friendly.',
  },
  {
    icon: PiggyBank,
    title: 'Savings management',
    body: 'Reserve amounts toward goals while Spendly keeps your balance and savings in sync.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & insights',
    body: 'Trends, category breakdowns, and monthly summaries tuned for fast decisions.',
  },
  {
    icon: Sparkles,
    title: 'Spendly AI assistant',
    body: 'Ask natural-language questions about your activity — powered locally from your data, no external API.',
  },
] as const

export function MarketingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-[#EAEAEA] bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem] lg:text-[2rem]">
            Everything you need to run your personal finances
          </h2>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            The same structure as the Financen template feature band — adapted for Spendly: tracking, savings,
            analytics, and AI in one product story.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="flex flex-col items-center rounded-sm border border-[#F0F0F0] bg-white px-6 py-7 text-center shadow-sm shadow-black/[0.03]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#E8F6FD] text-[#23A6F0]">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#252B42]">{title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#737373]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
