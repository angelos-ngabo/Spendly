import { motion, useReducedMotion } from 'framer-motion'
import { Wallet2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const phoneFloatTransition = {
  duration: 16,
  repeat: Infinity,
  ease: [0.42, 0, 0.58, 1] as const,
}

type Variant = 'overview' | 'signIn'
type Size = 'md' | 'sm'

const sizeWidth: Record<Size, string> = {
  md: 'w-[min(272px,78vw)] sm:w-[min(300px,72vw)] lg:w-[min(318px,40vw)]',
  sm: 'w-[min(200px,52vw)] sm:w-[min(220px,28vw)] md:w-[min(240px,24vw)] lg:w-[min(256px,22vw)]',
}

/**
 * Product-style dark-frame smartphone with HTML screen (Spendly).
 * Not a vector cartoon — physical bezel, island, glass, shadows.
 */
export function RealisticPhoneMockup({
  variant,
  size = 'md',
  className,
  withAmbientGlow = false,
  floating = true,
}: {
  variant: Variant
  size?: Size
  className?: string
  /** Extra blobs for marketing hero only */
  withAmbientGlow?: boolean
  floating?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const motionOff = reduceMotion || !floating

  const shell = (
    <div
      className="relative aspect-[9/19.35] w-full rounded-[2.35rem] p-[3px] shadow-[0_28px_56px_-14px_rgba(0,0,0,0.58),0_10px_22px_-8px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{
        background: 'linear-gradient(160deg, #4a4a50 0%, #2a2a2e 22%, #141416 55%, #0a0a0b 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-[4px] rounded-[2.05rem] ring-1 ring-white/[0.05]" aria-hidden />

      <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-[#020203] ring-1 ring-black/80">
        <div className="absolute inset-0 rounded-[2.05rem] ring-[2.5px] ring-black/90 ring-inset" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[2.05rem] bg-gradient-to-br from-white/[0.1] via-transparent to-transparent opacity-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[2.05rem] bg-gradient-to-tl from-transparent to-white/[0.035]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-[10px] z-20 h-[26px] w-[78px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_-1px_2px_rgba(255,255,255,0.06)]"
          aria-hidden
        />

        {variant === 'overview' ? <OverviewScreen size={size} /> : <SignInScreen size={size} />}
      </div>
    </div>
  )

  const inner = (
    <>
      <div
        className="pointer-events-none absolute -bottom-5 left-[8%] right-[8%] h-9 rounded-[100%] bg-black/50 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-2 left-[14%] right-[14%] h-4 rounded-[100%] bg-black/32 blur-lg"
        aria-hidden
      />
      {shell}
    </>
  )

  return (
    <div className={cn('relative flex justify-center', className)}>
      {withAmbientGlow ? (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] h-[min(420px,75vw)] w-[min(420px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23A6F0]/[0.14] blur-[80px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[48%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[48px]"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(280px,70vw)] w-[min(280px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23A6F0]/[0.1] blur-[64px]"
          aria-hidden
        />
      )}

      <motion.div
        className={cn('relative z-[1]', sizeWidth[size])}
        initial={false}
        animate={
          motionOff
            ? {}
            : {
                y: [0, -10, 0],
                rotateZ: [-1.2, 0.8, -1.2],
              }
        }
        transition={motionOff ? undefined : { ...phoneFloatTransition }}
        style={{ willChange: motionOff ? undefined : 'transform' }}
      >
        {inner}
      </motion.div>
    </div>
  )
}

function OverviewScreen({ size }: { size: Size }) {
  const tight = size === 'sm'
  return (
    <div
      className={cn(
        'relative z-[1] flex h-full flex-col bg-gradient-to-b from-[#0e1014] via-[#0b0d11] to-[#090a0d] px-3 pb-3 text-white',
        tight ? 'pt-9 pb-3' : 'pb-4 pt-[42px]',
      )}
    >
      <div className="flex shrink-0 items-center justify-between">
        <span className={cn('font-semibold tabular-nums text-zinc-500', tight ? 'text-[10px]' : 'text-[11px]')}>
          9:41
        </span>
        <div className="flex items-center gap-1 pr-0.5">
          <span className="h-2 w-3 rounded-[2px] bg-zinc-600/90" />
          <span className="h-2 w-0.5 rounded-full bg-zinc-600/80" />
          <span className="h-2 w-4 rounded-[2px] border border-zinc-600/80 bg-transparent" />
        </div>
      </div>

      <div className={cn('flex items-center gap-2', tight ? 'mt-2' : 'mt-3')}>
        <div
          className={cn(
            'flex items-center justify-center rounded-xl bg-gradient-to-br from-[#23A6F0] to-[#1780c4] text-white shadow-md shadow-[#23A6F0]/25',
            tight ? 'h-7 w-7' : 'h-8 w-8',
          )}
        >
          <Wallet2 className={tight ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={2} aria-hidden />
        </div>
        <div>
          <p className={cn('font-semibold tracking-tight', tight ? 'text-[10px]' : 'text-[11px]')}>Spendly</p>
          <p className={cn('font-medium text-zinc-500', tight ? 'text-[8px]' : 'text-[9px]')}>Dashboard</p>
        </div>
      </div>

      <div
        className={cn(
          'mt-2 rounded-2xl border border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm',
          tight ? 'p-2' : 'mt-3 p-3',
        )}
      >
        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Total balance</p>
        <p className={cn('font-bold leading-none tabular-nums tracking-tight text-white', tight ? 'mt-0.5 text-lg' : 'mt-1 text-[22px]')}>
          $12,847
        </p>
        <p className="mt-1 text-[9px] font-semibold text-emerald-400/90">+4.2% this month</p>
        <div className={cn('flex items-end justify-between gap-1 px-0.5', tight ? 'mt-2 h-8' : 'mt-3 h-10')}>
          {[12, 18, 14, 24, 15, 26, 17].map((px, i) => (
            <div
              key={i}
              className="min-w-0 flex-1 rounded-[3px] bg-[#23A6F0]"
              style={{ height: px, opacity: 0.32 + i * 0.07 }}
            />
          ))}
        </div>
      </div>

      <div className={cn('grid grid-cols-2 gap-1.5', tight ? 'mt-2' : 'mt-2.5 gap-2')}>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-2 py-1.5">
          <p className="text-[8px] font-medium text-zinc-500">Income</p>
          <p className="text-xs font-bold tabular-nums text-white">$8.2k</p>
        </div>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-2 py-1.5">
          <p className="text-[8px] font-medium text-zinc-500">Spend</p>
          <p className="text-xs font-bold tabular-nums text-rose-200/90">$3.1k</p>
        </div>
      </div>

      <div className="mt-auto rounded-xl border border-[#23A6F0]/20 bg-[#23A6F0]/[0.08] px-2 py-1.5">
        <p className="text-[8px] font-semibold leading-snug text-[#7ecbf7]">Spendly AI — insight ready</p>
      </div>
      <div className="mx-auto mt-1.5 h-1 w-20 rounded-full bg-white/15" aria-hidden />
    </div>
  )
}

function SignInScreen({ size }: { size: Size }) {
  const tight = size === 'sm'
  return (
    <div
      className={cn(
        'relative z-[1] flex h-full min-h-0 flex-col bg-gradient-to-b from-[#fafbfc] to-[#f0f2f5] px-3 pb-3',
        tight ? 'pt-9' : 'pt-[42px]',
      )}
    >
      <div className="flex shrink-0 items-center justify-between text-[#64748b]">
        <span className={cn('font-semibold tabular-nums', tight ? 'text-[10px]' : 'text-[11px]')}>9:41</span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-3 rounded-[2px] bg-slate-400/90" />
          <span className="h-2 w-4 rounded-[2px] border border-slate-400/80" />
        </div>
      </div>

      <div className={cn('flex flex-col items-center', tight ? 'mt-5' : 'mt-7')}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23A6F0] text-white shadow-md shadow-[#23A6F0]/20">
          <Wallet2 className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <p className={cn('mt-3 font-bold text-[#1e293b]', tight ? 'text-sm' : 'text-base')}>Spendly</p>
        <p className="mt-1 text-center text-[11px] font-bold text-[#0f172a]">Welcome back</p>
        <p className="mt-0.5 text-center text-[9px] font-medium text-[#64748b]">Secure access to your workspace</p>
      </div>

      <div className={cn('mt-4 space-y-2', tight && 'mt-3')}>
        <div>
          <label className="text-[8px] font-semibold uppercase tracking-wide text-[#64748b]">Email</label>
          <div className="mt-0.5 h-8 rounded-lg border border-[#e2e8f0] bg-white shadow-sm" />
        </div>
        <div>
          <label className="text-[8px] font-semibold uppercase tracking-wide text-[#64748b]">Password</label>
          <div className="mt-0.5 h-8 rounded-lg border border-[#e2e8f0] bg-white shadow-sm" />
        </div>
        <p className="text-right text-[9px] font-semibold text-[#23A6F0]">Forgot?</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end">
        <div className="mt-3 flex h-9 w-full items-center justify-center rounded-xl bg-[#23A6F0] text-[11px] font-bold text-white shadow-md shadow-[#23A6F0]/25">
          Sign in
        </div>
        <p className="mt-2 text-center text-[8px] font-medium text-[#64748b]">New here? Create account</p>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#0f172a]/10" aria-hidden />
      </div>
    </div>
  )
}
