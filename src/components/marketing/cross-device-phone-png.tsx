import { motion, useReducedMotion } from 'framer-motion'
import { phoneFloatTransition } from '@/components/marketing/realistic-phone-mockup'
import { cn } from '@/lib/utils'

/** Layout width for the phone column (flow); visual scale applied inside so laptop row footprint stays similar. */
const phoneLayoutWidth =
  'w-[min(260px,54vw)] sm:w-[min(300px,38vw)] md:w-[min(320px,34vw)] lg:w-[min(340px,32vw)] xl:w-[min(360px,30vw)]'

const phoneVisualScale = 'origin-bottom scale-[1.1] sm:scale-[1.12] md:scale-[1.14] lg:scale-[1.16]'

/**
 * High-res PNG device for the cross-device (laptop + phone) section only.
 * No card wrapper — float + shadow belong to the asset.
 */
export function CrossDevicePhonePng({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={cn('relative flex justify-center overflow-visible', className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-[55%] h-[min(300px,62vw)] w-[min(320px,65vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23A6F0]/[0.11] blur-[56px] sm:w-[min(340px,68vw)] lg:h-[min(320px,58vw)]"
        aria-hidden
      />
      <motion.div
        className={cn('relative z-[1]', phoneLayoutWidth)}
        initial={false}
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -10, 0],
                rotateZ: [-1.2, 0.85, -1.2],
              }
        }
        transition={reduceMotion ? undefined : { ...phoneFloatTransition }}
      >
        <div className={cn(phoneVisualScale)} style={{ transformOrigin: '50% 100%' }}>
          <div
            className="pointer-events-none absolute -bottom-4 left-[6%] right-[6%] h-8 rounded-[100%] bg-black/45 blur-2xl"
            aria-hidden
          />
          <img
            src={src}
            alt={alt}
            width={900}
            height={1800}
            className="relative z-[1] h-auto w-full object-contain drop-shadow-[0_22px_48px_rgba(0,0,0,0.35)]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </motion.div>
    </div>
  )
}
