import { confirmPasswordReset, sendPasswordResetEmail, verifyPasswordResetCode } from 'firebase/auth'
import { buildPasswordResetActionCodeSettings } from '@/lib/firebase-email-action-settings'
import { getFirebaseAuth } from '@/services/firebase/config'

function firebaseCode(e: unknown): string {
  return e && typeof e === 'object' && 'code' in e ? String((e as { code?: string }).code) : ''
}

/** Sends Firebase password reset email with Spendly continue URL (see `buildPasswordResetActionCodeSettings`). */
export async function sendSpendlyPasswordResetEmail(email: string): Promise<void> {
  const auth = getFirebaseAuth()
  await sendPasswordResetEmail(auth, email.trim(), buildPasswordResetActionCodeSettings())
}

/** Returns the account email if `oobCode` is valid; throws on invalid/expired code. */
export async function verifySpendlyPasswordResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(getFirebaseAuth(), oobCode)
}

export async function confirmSpendlyPasswordReset(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword)
}

/** True when error should be treated as a successful send (avoid account enumeration). */
export function isForgotPasswordEnumerationSafeSuccess(e: unknown): boolean {
  const code = firebaseCode(e)
  return code === 'auth/user-not-found'
}
