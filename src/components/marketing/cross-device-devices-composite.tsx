import { useEffect, useState } from 'react'
import { CrossDeviceLaptopArt } from '@/components/marketing/cross-device-laptop-art'
import { CrossDevicePhonePng } from '@/components/marketing/cross-device-phone-png'
import { RealisticPhoneMockup } from '@/components/marketing/realistic-phone-mockup'
import { LANDING_DEVICE_LAPTOP, LANDING_PHONE_PNG_PROBE_ORDER } from '@/lib/landing-device-assets'
import { firstLoadableImageUrl, probeImage } from '@/lib/probe-first-image'
import { cn } from '@/lib/utils'

type LaptopVisual = 'checking' | 'png' | 'svg'

/**
 * Laptop (`public/landing/devices/laptop.png` when present, else generated SVG) + realistic phone PNG / HTML device.
 * No outer card — devices float in the section.
 */
export function CrossDeviceDevicesComposite({ className }: { className?: string }) {
  const [phoneUrl, setPhoneUrl] = useState<string | null>(null)
  const [phoneDone, setPhoneDone] = useState(false)
  const [laptopVisual, setLaptopVisual] = useState<LaptopVisual>('checking')

  useEffect(() => {
    let cancelled = false
    void firstLoadableImageUrl(LANDING_PHONE_PNG_PROBE_ORDER).then((url) => {
      if (!cancelled) {
        setPhoneUrl(url)
        setPhoneDone(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void probeImage(LANDING_DEVICE_LAPTOP)
      .then(() => {
        if (!cancelled) setLaptopVisual('png')
      })
      .catch(() => {
        if (!cancelled) setLaptopVisual('svg')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className={cn(
        'relative z-[1] mx-auto flex w-full max-w-[min(100%,960px)] flex-col items-center gap-10 px-1 sm:gap-12 sm:px-2 md:flex-row md:items-end md:justify-center md:gap-8 lg:gap-12',
        className,
      )}
      role="img"
      aria-label="Spendly on laptop and mobile"
    >
      <div className="w-full max-w-[min(100%,820px)] shrink md:max-w-[min(100%,680px)]">
        {laptopVisual === 'checking' ? (
          <div
            className="mx-auto aspect-[672/360] w-full max-w-full animate-pulse rounded-2xl bg-[#e8ecef]/90"
            aria-hidden
          />
        ) : laptopVisual === 'png' ? (
          <img
            src={LANDING_DEVICE_LAPTOP}
            alt=""
            width={1600}
            height={1000}
            className="mx-auto block h-auto w-full max-w-full object-contain drop-shadow-[0_24px_48px_rgba(11,90,138,0.12)]"
            loading="lazy"
            decoding="async"
            onError={() => setLaptopVisual('svg')}
          />
        ) : (
          <CrossDeviceLaptopArt className="mx-auto block h-auto w-full" />
        )}
      </div>

      <div className="relative flex shrink-0 justify-center overflow-visible md:-mt-4 md:-ml-4 lg:-ml-8">
        {!phoneDone ? (
          <div
            className="h-[min(280px,50vw)] w-[min(200px,45vw)] animate-pulse rounded-[2rem] bg-[#e8ecef]/80"
            aria-hidden
          />
        ) : phoneUrl ? (
          <CrossDevicePhonePng
            src={phoneUrl}
            alt="Spendly on a modern smartphone"
            className="md:translate-y-2"
          />
        ) : (
          <div
            className="origin-bottom scale-[1.1] md:scale-[1.14] lg:scale-[1.16] md:translate-y-2"
            style={{ transformOrigin: '50% 100%' }}
          >
            <RealisticPhoneMockup variant="signIn" size="md" floating className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
