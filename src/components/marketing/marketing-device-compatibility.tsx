import { LayoutDashboard, RefreshCw, Wallet } from 'lucide-react'
import { MarketingDeviceHero } from '@/components/marketing/marketing-device-hero'
import { cn } from '@/lib/utils'

const highlights = [
  {
    icon: RefreshCw,
    text: 'Sync across devices',
  },
  {
    icon: Wallet,
    text: 'Track money on the go',
  },
  {
    icon: LayoutDashboard,
    text: 'Full dashboard on desktop',
  },
] as const

/** Cross-Device Access — replaces former testimonials; optional Figma PNGs in `public/landing/devices/`. */
export function MarketingDeviceCompatibility() {
  return (
    <section
      id="devices"
      aria-labelledby="cross-device-heading"
      className={cn(
        'scroll-mt-20 border-t border-[#EAEAEA] bg-white py-16 md:py-24',
        'bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(35,166,240,0.07),transparent_55%),linear-gradient(180deg,#FFFFFF_0%,#FAFCFF_100%)]',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#23A6F0]">
          Use Spendly anywhere
        </p>
        <div className="mx-auto mt-2 max-w-2xl text-center">
          <h2
            id="cross-device-heading"
            className="text-balance text-[1.65rem] font-bold leading-snug tracking-tight text-[#252B42] md:text-[1.85rem] lg:text-[2rem]"
          >
            Access your finances anywhere
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#252B42]/80">One account, every device</p>
          <p className="mt-3 text-pretty text-xs font-medium leading-relaxed text-[#737373] sm:text-sm">
            Use Spendly on your laptop or mobile device and stay in control of your income, expenses, and savings
            wherever you are.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl md:mt-12 lg:mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[6%] top-[18%] h-[55%] rounded-[40%] bg-[#23A6F0]/[0.06] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[4%] top-[8%] bottom-[12%] rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(35,166,240,0.09)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.45] mix-blend-multiply"
          />
          <MarketingDeviceHero className="relative z-[1] drop-shadow-sm" />
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6 md:max-w-5xl md:gap-8">
          {highlights.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className={cn(
                'flex w-full flex-col gap-5 rounded-2xl border border-[#E8E8E8] bg-white/95 p-6 shadow-md shadow-black/[0.06] ring-1 ring-black/[0.02] backdrop-blur-sm',
                'sm:min-h-[9.5rem] sm:items-start sm:p-7 md:p-8',
              )}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F6FD] text-[#23A6F0] md:h-14 md:w-14 md:rounded-2xl">
                <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="text-base font-bold leading-snug tracking-tight text-[#252B42] md:text-lg">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
