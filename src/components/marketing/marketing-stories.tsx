import { landingAssets } from '@/components/marketing/assets'

const stories = [
  {
    name: 'Alex M.',
    role: 'Freelance designer',
    quote:
      'I finally see where freelance income lands versus subscriptions. Spendly’s categories made tax season less scary.',
    img: landingAssets.storyAvatar1,
  },
  {
    name: 'Jordan K.',
    role: 'Grad student',
    quote:
      'Guest mode let me try everything locally. When I signed up, my ledger moved to Firebase without losing history.',
    img: landingAssets.storyAvatar2,
  },
] as const

export function MarketingStories() {
  return (
    <section id="stories" className="scroll-mt-20 border-t border-[#EAEAEA] bg-[#FAFAFA] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem]">
            Why people choose Spendly
          </h2>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            Real voices, template photography from the Financen community file — copy rewritten for personal finance.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
          {stories.map((s) => (
            <article
              key={s.name}
              className="overflow-hidden rounded-sm border border-[#E8E8E8] bg-white shadow-sm shadow-black/[0.04]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#F5F5F5]">
                <img src={s.img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="space-y-3 px-6 py-6">
                <div>
                  <h3 className="text-base font-bold text-[#252B42]">{s.name}</h3>
                  <p className="text-xs font-semibold text-[#737373]">{s.role}</p>
                </div>
                <div className="flex gap-0.5 text-[#F3CD03]" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#737373]">{s.quote}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
