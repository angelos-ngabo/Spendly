/** Very small in-memory limiter (best-effort per serverless instance). */
const buckets = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX = 8

export function rateLimitOrThrow(ip: string): void {
  const now = Date.now()
  const prev = buckets.get(ip) ?? []
  const recent = prev.filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX) {
    const err = new Error('Too many requests')
    ;(err as Error & { statusCode?: number }).statusCode = 429
    throw err
  }
  recent.push(now)
  buckets.set(ip, recent)
}

export function clientIp(req: { headers?: Record<string, string | string[] | undefined> }): string {
  const xf = req.headers?.['x-forwarded-for']
  const first = typeof xf === 'string' ? xf.split(',')[0]?.trim() : Array.isArray(xf) ? xf[0] : ''
  if (first) return first
  const real = req.headers?.['x-real-ip']
  if (typeof real === 'string' && real.trim()) return real.trim()
  return 'unknown'
}
