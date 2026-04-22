/**
 * Public site origin for links inside emails (must match Firebase authorized domains).
 * Set `PUBLIC_APP_ORIGIN` on Vercel (e.g. https://spendly-two-ochre.vercel.app).
 */
export function publicAppOrigin(): string {
  const raw = process.env.PUBLIC_APP_ORIGIN?.trim().replace(/\/$/, '')
  if (raw) {
    if (/^https?:\/\//i.test(raw)) return raw
    return `https://${raw.replace(/^\/+/, '')}`
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, '')
    return `https://${host}`
  }
  return ''
}
