import type { User } from 'firebase/auth'

/**
 * Whether the current session may open the Spendly workspace (`/app`).
 * Guests bypass email verification; Firebase email/password users must be verified.
 *
 * Future: a custom OTP or additional verification layer could extend this helper (e.g. require
 * `accountProfile?.customVerified`) without changing route components.
 */
export function userMayAccessWorkspace(
  user: User | null,
  guestSession: boolean,
  guestFromStorage: boolean,
): boolean {
  if (guestSession || guestFromStorage) return true
  if (!user) return false
  return user.emailVerified === true
}
