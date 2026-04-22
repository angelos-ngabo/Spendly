import type { ActionCodeSettings } from 'firebase/auth'
import { RESET_PASSWORD_PATH, VERIFY_EMAIL_PATH } from '@/components/layout/nav'

/**
 * Canonical site origin for Firebase `continueUrl` (email verification, etc.).
 *
 * - **Production:** set `VITE_PUBLIC_APP_ORIGIN` in Vercel (e.g. `https://spendly-two-ochre.vercel.app`, no trailing slash).
 *   That host must also appear under Firebase Console → Authentication → Settings → **Authorized domains**
 *   as `spendly-two-ochre.vercel.app` (no `https://`).
 * - **Development:** when unset, falls back to `window.location.origin` (e.g. `http://localhost:5173`).
 */
function appOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_APP_ORIGIN
  const envOrigin =
    typeof fromEnv === 'string' && fromEnv.trim().length > 0 ? fromEnv.trim().replace(/\/$/, '') : ''

  if (import.meta.env.PROD && envOrigin) {
    return envOrigin
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }

  if (envOrigin) {
    return envOrigin
  }

  return ''
}

/**
 * `sendEmailVerification` / resend: `url` must be an absolute URL whose **hostname** is in Firebase Authorized domains.
 */
export function buildEmailVerificationActionCodeSettings(): ActionCodeSettings {
  const origin = appOrigin()
  const url = origin ? `${origin}${VERIFY_EMAIL_PATH}` : ''

  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error(
      'Email verification link could not be built. Set VITE_PUBLIC_APP_ORIGIN to your deployed origin (e.g. https://spendly-two-ochre.vercel.app) and add that hostname to Firebase → Authentication → Authorized domains.',
    )
  }

  return {
    url,
    handleCodeInApp: false,
  }
}

/**
 * `sendPasswordResetEmail`: `url` is the continue / handler URL (must be HTTPS in production, hostname authorized in Firebase).
 * Production: set `VITE_PUBLIC_APP_ORIGIN=https://spendly-two-ochre.vercel.app` so this resolves to that origin + `/reset-password`.
 */
export function buildPasswordResetActionCodeSettings(): ActionCodeSettings {
  const origin = appOrigin()
  const url = origin ? `${origin}${RESET_PASSWORD_PATH}` : ''

  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error(
      'Password reset link could not be built. Set VITE_PUBLIC_APP_ORIGIN to your deployed origin (e.g. https://spendly-two-ochre.vercel.app), add that hostname under Firebase → Authentication → Authorized domains, and set the password reset email template action URL if required by your project.',
    )
  }

  return {
    url,
    handleCodeInApp: false,
  }
}
