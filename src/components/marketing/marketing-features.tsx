import { BarChart3, PiggyBank, Sparkles, Wallet } from 'lucide-react'

const cards = [
  {
    icon: Wallet,
    title: 'Cash flow you can trust',
    body: 'Record income and spending with categories, dates, and notes so every line item is traceable. You gain a dependable ledger—and the confidence to plan without second-guessing the numbers.',
  },
  {
    icon: PiggyBank,
    title: 'Savings that stay on track',
    body: 'Allocate balances toward goals and watch progress update as life happens. Spendly keeps savings visible alongside everyday spending so priorities do not quietly slip.',
  },
  {
    icon: BarChart3,
    title: 'Analytics built for decisions',
    body: 'Trends, category splits, and period summaries turn raw transactions into context. See where momentum is building—or where to adjust—before the month closes.',
  },
  {
    icon: Sparkles,
    title: 'Spendly AI',
    body: 'Ask questions in plain language and get answers grounded in your own data. Surface habits, compare periods, and explore scenarios with an assistant designed for money—not generic chat.',
  },
] as const

export function MarketingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-[#EAEAEA] bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem] lg:text-[2rem]">
            One workspace for disciplined personal finance
          </h2>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            Tracking, goals, analytics, and AI live together so you spend less time reconciling spreadsheets and more
            time acting on what the numbers are telling you.
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
