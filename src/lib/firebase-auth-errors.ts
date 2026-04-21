/** Maps hosted auth error codes to concise, user-facing copy. */
export function mapFirebaseAuthError(e: unknown): string {
  const code =
    e && typeof e === 'object' && 'code' in e ? String((e as { code?: string }).code) : ''

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.'
    case 'auth/weak-password':
      return 'Password is too weak. Use a stronger password (at least 6 characters).'
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if you need help.'
    case 'auth/invalid-action-code':
      return 'This verification link is invalid or has already been used.'
    case 'auth/expired-action-code':
      return 'This verification link has expired. Request a new one from the sign-in page.'
    default:
      if (e instanceof Error && e.message) return e.message
      return 'Something went wrong. Please try again.'
  }
}
