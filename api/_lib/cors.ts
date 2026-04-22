import type { VercelResponse } from '@vercel/node'

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS?.trim()
  if (raw) {
    return raw
      .split(',')
      .map((s) => s.trim().replace(/\/$/, ''))
      .filter(Boolean)
  }
  const fallback = process.env.PUBLIC_APP_ORIGIN?.trim().replace(/\/$/, '')
  if (fallback) {
    const o = /^https?:\/\//i.test(fallback) ? fallback : `https://${fallback}`
    return [o]
  }
  return []
}

export function applyCors(req: { headers?: { origin?: string } }, res: VercelResponse): void {
  const origin = req.headers?.origin
  const allowed = parseAllowedOrigins()
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  } else if (allowed.length === 1) {
    res.setHeader('Access-Control-Allow-Origin', allowed[0]!)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}
