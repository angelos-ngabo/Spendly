import { useEffect, useState } from 'react'
import { CrossDeviceDevicesComposite } from '@/components/marketing/cross-device-devices-composite'
import { LANDING_DEVICE_LAPTOP, LANDING_PHONE_PNG_PROBE_ORDER } from '@/lib/landing-device-assets'
import { firstLoadableImageUrl, probeImage } from '@/lib/probe-first-image'
import { cn } from '@/lib/utils'

type LoadState = 'checking' | 'raster' | 'vector'

/**
 * Raster: `laptop.png` + best phone PNG (`phone-icon.png` → `phone icon.png` → `phone-product.png` → `phone.png`).
 * Vector fallback: laptop SVG + realistic phone (PNG or HTML device), no cartoon phone SVG.
 */
export function MarketingDeviceHero({ className }: { className?: string }) {
  const [state, setState] = useState<LoadState>('checking')
  const [phoneSrc, setPhoneSrc] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        await probeImage(LANDING_DEVICE_LAPTOP)
      } catch {
        if (!cancelled) setState('vector')
        return
      }
      const phoneUrl = await firstLoadableImageUrl(LANDING_PHONE_PNG_PROBE_ORDER)
      if (cancelled) return
      if (!phoneUrl) {
        setState('vector')
        return
      }
      setPhoneSrc(phoneUrl)
      setState('raster')
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'checking') {
    return (
      <div
        className={cn(
          'mx-auto flex min-h-[200px] w-full max-w-[min(100%,920px)] items-center justify-center md:min-h-[260px]',
          className,
        )}
        aria-busy
        aria-label="Loading product preview"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#23A6F0] border-t-transparent" />
      </div>
    )
  }

  if (state === 'vector') {
    return <CrossDeviceDevicesComposite className={className} />
  }

  const fallbackToVector = () => setState('vector')

  const onPhoneImgError = () => {
    void firstLoadableImageUrl(LANDING_PHONE_PNG_PROBE_ORDER.filter((u) => u !== phoneSrc)).then((next) => {
      if (next) setPhoneSrc(next)
      else fallbackToVector()
    })
  }

  return (
    <div
      className={cn(
        'relative z-[1] mx-auto flex w-full max-w-[min(100%,920px)] justify-center px-1 sm:px-2',
        className,
      )}
      role="img"
      aria-label="Spendly product experience on laptop and smartphone"
    >
      <div className="relative w-fit max-w-full pb-6 sm:pb-8 md:pb-10 lg:pb-12">
        <img
          src={LANDING_DEVICE_LAPTOP}
          alt=""
          width={1600}
          height={1000}
          className="relative z-0 mx-auto block h-auto w-auto max-w-[min(100vw-1.25rem,860px)] object-contain drop-shadow-[0_24px_48px_rgba(11,90,138,0.12)] sm:max-w-[820px]"
          decoding="async"
          fetchPriority="high"
          onError={fallbackToVector}
        />
        <img
          src={phoneSrc}
          alt=""
          width={900}
          height={1800}
          className={cn(
            'pointer-events-none z-10 h-auto origin-bottom object-contain drop-shadow-[0_24px_52px_rgba(0,0,0,0.32)]',
            'max-sm:relative max-sm:mx-auto max-sm:mt-[-6%] max-sm:w-[min(70%,314px)]',
            'sm:absolute sm:mx-0 sm:mt-0 sm:bottom-[2%] sm:right-[-4%] sm:w-[clamp(172px,27%,300px)]',
            'md:bottom-[3%] md:right-[-6%] md:w-[clamp(190px,25%,322px)]',
            'lg:bottom-[4%] lg:right-[-8%] lg:w-[clamp(206px,24%,338px)]',
          )}
          decoding="async"
          fetchPriority="high"
          onError={onPhoneImgError}
        />
      </div>
    </div>
  )
}
