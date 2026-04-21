import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RealisticPhoneMockup } from '@/components/marketing/realistic-phone-mockup'
import { LANDING_PHONE_PNG_PROBE_ORDER } from '@/lib/landing-device-assets'
import { firstLoadableImageUrl } from '@/lib/probe-first-image'
import { cn } from '@/lib/utils'

const heroPhoneFloat = {
  duration: 5,
  repeat: Infinity,
  ease: 'easeInOut',
} as const

/** Layout box max-widths (document flow) — phone is scaled up visually inside without widening the hero column. */
const heroPhoneLayoutMax =
  'w-full max-w-[min(280px,78vw)] sm:max-w-[min(300px,74vw)] md:max-w-[min(320px,70vw)] lg:max-w-[min(340px,100%)]'

const heroPhoneVisualScale =
  'origin-bottom scale-[1.14] sm:scale-[1.16] md:scale-[1.18] lg:scale-[1.22] xl:scale-[1.24]'

/**
 * Hero phone: realistic PNG from `public/landing/phone-icon.png` (or fallbacks). Visual size uses CSS transform scale
 * inside a fixed layout box so the hero column footprint stays unchanged.
 */
export function MarketingHeroPhonePremium({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const [pngSrc, setPngSrc] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    let cancelled = false
    void firstLoadableImageUrl(LANDING_PHONE_PNG_PROBE_ORDER).then((url) => {
      if (!cancelled) {
        setPngSrc(url)
        setResolved(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!resolved) {
    return (
      <div className={cn('relative mx-auto flex w-full justify-center pt-3 lg:pt-5', className)} aria-hidden>
        <div
          className={cn(
            'aspect-[9/19] animate-pulse rounded-3xl bg-white/[0.06]',
            heroPhoneLayoutMax,
          )}
        />
      </div>
    )
  }

  if (!pngSrc) {
    return (
      <div className={cn('relative mx-auto flex w-full justify-center overflow-visible pt-3 lg:pt-5', className)}>
        <div className={cn('relative mx-auto', heroPhoneLayoutMax, heroPhoneVisualScale)}>
          <RealisticPhoneMockup
            variant="overview"
            size="md"
            withAmbientGlow
            floating
            className="w-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative flex w-full justify-center overflow-visible pt-3 pb-1 lg:pt-5', className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-[50%] h-[min(280px,70vw)] w-[min(420px,95vw)] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl sm:w-[min(480px,90vw)] lg:h-[min(300px,52vw)] lg:w-[min(500px,118%)]"
        aria-hidden
      />
      <div className={cn('relative mx-auto', heroPhoneLayoutMax)}>
        <motion.div
          initial={false}
          className="w-full will-change-transform"
          animate={reduceMotion ? {} : { y: [-6, 6, -6] }}
          transition={reduceMotion ? undefined : heroPhoneFloat}
        >
          <div className={cn(heroPhoneVisualScale)} style={{ transformOrigin: '50% 100%' }}>
            <img
              src={pngSrc}
              alt="Spendly on a smartphone"
              width={900}
              height={1800}
              className="relative z-[1] mx-auto h-auto w-full object-contain drop-shadow-2xl"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={() => setPngSrc(null)}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
