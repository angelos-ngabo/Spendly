/**
 * Read Firebase email action params (`oobCode`, `mode`, …) from the current URL.
 *
 * Most links use the query string (`?oobCode=…&mode=resetPassword`). Some redirects
 * or clients only preserve those values in the hash; `useSearchParams()` misses the
 * latter and the reset page would incorrectly show "Missing reset link".
 */
export function parseFirebaseOutOfBandParams(search: string, hash: string): {
  oobCode: string
  mode: string | null
} {
  const fromQuery = (raw: string) => {
    const trimmed = raw.startsWith('?') ? raw.slice(1) : raw
    return new URLSearchParams(trimmed)
  }

  const searchParams = fromQuery(search)
  let oobCode = (searchParams.get('oobCode') ?? searchParams.get('oob_code'))?.trim() ?? ''
  let mode = searchParams.get('mode')

  const h = hash.startsWith('#') ? hash.slice(1) : hash
  if (!oobCode && h) {
    const qIdx = h.indexOf('?')
    const querySlice = qIdx >= 0 ? h.slice(qIdx) : h.includes('oobCode=') ? `?${h}` : ''
    if (querySlice) {
      const hp = fromQuery(querySlice)
      oobCode = (hp.get('oobCode') ?? hp.get('oob_code'))?.trim() ?? oobCode
      mode = mode ?? hp.get('mode')
    }
    if (!oobCode) {
      const m = /(?:^|[?&#])oobCode=([^&]+)/i.exec(h) ?? /(?:^|[?&#])oob_code=([^&]+)/i.exec(h)
      if (m) {
        try {
          oobCode = decodeURIComponent(m[1].replace(/\+/g, ' ')).trim()
        } catch {
          oobCode = m[1].trim()
        }
      }
    }
    if (!mode) {
      const m = /(?:^|[?&#])mode=([^&]+)/.exec(h)
      if (m) {
        try {
          mode = decodeURIComponent(m[1])
        } catch {
          mode = m[1]
        }
      }
    }
  }

  return { oobCode, mode }
}

/** True when `mode` is explicitly something other than Firebase’s password reset action. */
export function isWrongModeForPasswordReset(mode: string | null | undefined): boolean {
  if (!mode) return false
  return mode.toLowerCase() !== 'resetpassword'
}

/** True when `mode` is explicitly something other than Firebase’s email verification action. */
export function isWrongModeForEmailVerification(mode: string | null | undefined): boolean {
  if (!mode) return false
  return mode.toLowerCase() !== 'verifyemail'
}
