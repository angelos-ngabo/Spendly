import type { ActionCodeSettings } from 'firebase/auth'
import { VERIFY_EMAIL_PATH } from '@/components/layout/nav'

function appOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }
  const fromEnv = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_PUBLIC_APP_ORIGIN : undefined
  return typeof fromEnv === 'string' ? fromEnv.replace(/\/$/, '') : ''
}

/**
 * `sendEmailVerification` / resend: tells Firebase to redirect here after the user completes the action.
 * Add this exact origin + path to Firebase Console → Authentication → Settings → Authorized domains.
 */
export function buildEmailVerificationActionCodeSettings(): ActionCodeSettings {
  const origin = appOrigin()
  return {
    url: origin ? `${origin}${VERIFY_EMAIL_PATH}` : VERIFY_EMAIL_PATH,
    handleCodeInApp: false,
  }
}
