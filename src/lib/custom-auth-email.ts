/**
 * Branded auth emails via Vercel `/api/*` + Resend + Firebase Admin (see `api/`).
 * Enable with `VITE_CUSTOM_AUTH_EMAILS=1` and configure server env on Vercel.
 */

function optionalApiBase(): string {
  const raw = import.meta.env.VITE_EMAIL_API_BASE_URL
  return typeof raw === 'string' && raw.trim() ? raw.trim().replace(/\/$/, '') : ''
}

function requestUrl(path: string): string {
  const base = optionalApiBase()
  return base ? `${base}${path}` : path
}

export function isCustomAuthEmailEnabled(): boolean {
  const v = import.meta.env.VITE_CUSTOM_AUTH_EMAILS
  return v === '1' || v === 'true'
}

export async function sendCustomPasswordResetRequest(email: string): Promise<void> {
  const res = await fetch(requestUrl('/api/send-reset-email'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  })
  if (res.status === 429) {
    throw new Error('Too many attempts. Please wait a few minutes and try again.')
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? 'Could not send reset email.')
  }
}

export async function sendCustomEmailVerificationRequest(idToken: string): Promise<void> {
  const res = await fetch(requestUrl('/api/send-verification-email'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({}),
  })
  if (res.status === 429) {
    throw new Error('Too many attempts. Please wait a few minutes and try again.')
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? 'Could not send verification email.')
  }
}
