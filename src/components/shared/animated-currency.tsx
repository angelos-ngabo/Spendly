import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function AnimatedCurrency({
  value,
  className,
  durationMs = 520,
}: {
  value: number
  className?: string
  durationMs?: number
}) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    if (Math.abs(from - value) < 0.000001) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    const ease = (t: number) => 1 - (1 - t) ** 3

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const next = from + (value - from) * ease(t)
      setDisplay(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, durationMs])

  return (
    <span className={cn('tabular-nums tracking-tight text-foreground', className)}>
      {formatCurrency(display)}
    </span>
  )
}
