/* eslint-disable react-refresh/only-export-components -- auth provider + hook */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { isCustomAuthEmailEnabled, sendCustomEmailVerificationRequest } from '@/lib/custom-auth-email'
import { buildEmailVerificationActionCodeSettings } from '@/lib/firebase-email-action-settings'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { countryByIso } from '@/data/country-dial-codes'
import { getFirebaseAuth, listMissingFirebaseEnvVars } from '@/services/firebase/config'
import { mergeUserTransactions } from '@/services/firebase/transactions'
import {
  subscribeUserAccountProfile,
  writeUserAccountProfile,
  type UserAccountProfile,
} from '@/services/firebase/user-profile'
import {
  clearGuestTransactions,
  migrateLegacyGuestIfNeeded,
  readGuestTransactions,
  readGuestSessionFlag,
  setGuestSessionFlag,
} from '@/lib/guest-storage'
import { migrateGuestSavingsToUser } from '@/services/firebase/migrate-guest-savings'
import { mapFirebaseAuthError } from '@/lib/firebase-auth-errors'
import { toE164 } from '@/lib/phone'
import type { SignUpValues } from '@/lib/auth-schemas'

export type SignInEmailResult = 'verified' | 'unverified'

type AuthContextValue = {
  user: User | null
  authLoading: boolean
  guestSession: boolean
  firebaseEnabled: boolean
  /** Env var names still missing (empty). Only for troubleshooting the setup message. */
  firebaseMissingEnvVars: readonly string[]
  /** Firestore profile (full name, phone). Null for guests or before load. */
  accountProfile: UserAccountProfile | null
  enterGuestSession: () => void
  /**
   * Email/password sign-in. On success, returns whether the account email is verified.
   * Unverified users remain signed in so they can resend verification from the login UI.
   */
  signInWithEmail: (email: string, password: string) => Promise<SignInEmailResult>
  /** Creates account, sends Firebase verification email, then signs out. */
  signUpWithEmail: (values: SignUpValues) => Promise<{ verificationEmailSent: boolean }>
  /** Resend verification link to the current Firebase user (must be signed in). */
  resendEmailVerification: () => Promise<void>
  /** Reload current user from Firebase; returns whether `emailVerified` is now true. */
  refreshAuthUser: () => Promise<boolean>
  signOutEverywhere: () => Promise<void>
  displayLabel: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function migrateGuestDataToUser(uid: string) {
  const guestTx = readGuestTransactions()
  if (guestTx.length) {
    await mergeUserTransactions(uid, guestTx)
    clearGuestTransactions()
    toast.success('Your guest activity was saved to your account')
  }
  await migrateGuestSavingsToUser(uid)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [, bumpAuthRender] = useReducer((n: number) => n + 1, 0)
  const [authLoading, setAuthLoading] = useState(true)
  const [guestSession, setGuestSession] = useState(() => readGuestSessionFlag())
  const [accountProfile, setAccountProfile] = useState<UserAccountProfile | null>(null)

  const firebaseMissingEnvVars = useMemo(() => listMissingFirebaseEnvVars(), [])
  const firebaseEnabled = firebaseMissingEnvVars.length === 0

  useEffect(() => {
    if (!firebaseEnabled) {
      queueMicrotask(() => setAuthLoading(false))
      return
    }
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next)
      if (next) {
        setGuestSessionFlag(false)
        setGuestSession(false)
      }
      setAuthLoading(false)
    })
    return () => unsub()
  }, [firebaseEnabled])

  useEffect(() => {
    if (!firebaseEnabled || !user?.uid) {
      queueMicrotask(() => setAccountProfile(null))
      return
    }
    const unsub = subscribeUserAccountProfile(user.uid, (next) => {
      setAccountProfile(next)
    })
    return () => {
      unsub()
      queueMicrotask(() => setAccountProfile(null))
    }
  }, [firebaseEnabled, user?.uid])

  const enterGuestSession = useCallback(() => {
    migrateLegacyGuestIfNeeded()
    setGuestSessionFlag(true)
    setGuestSession(true)
  }, [])

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<SignInEmailResult> => {
      if (!firebaseEnabled) {
        toast.error('Cloud sign-in is not available in this build.')
        throw new Error('Cloud sign-in is not available in this build.')
      }
      const auth = getFirebaseAuth()
      const hadGuest = readGuestSessionFlag()
      const guestSnapshot = hadGuest ? readGuestTransactions() : []
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
        await reload(cred.user)
        if (guestSnapshot.length) {
          await migrateGuestDataToUser(cred.user.uid)
        }
        setGuestSessionFlag(false)
        setGuestSession(false)
        if (!cred.user.emailVerified) {
          return 'unverified'
        }
        return 'verified'
      } catch (e) {
        throw new Error(mapFirebaseAuthError(e))
      }
    },
    [firebaseEnabled],
  )

  const signUpWithEmail = useCallback(
    async (values: SignUpValues) => {
      if (!firebaseEnabled) {
        toast.error('Cloud sign-in is not available in this build.')
        throw new Error('Cloud sign-in is not available in this build.')
      }
      const country = countryByIso(values.phoneCountryIso)
      if (!country) {
        toast.error('Invalid country selection')
        throw new Error('Invalid country selection')
      }
      const phoneE164 = toE164(country.dial, values.phoneNational)
      const auth = getFirebaseAuth()
      const guestSnapshot = readGuestTransactions()
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          values.email.trim(),
          values.password,
        )
        await updateProfile(cred.user, { displayName: values.fullName.trim() })
        try {
          await writeUserAccountProfile(cred.user.uid, {
            fullName: values.fullName.trim(),
            phoneE164,
            phoneCountryIso: values.phoneCountryIso,
          })
        } catch {
          toast.error('Account created, but profile could not be saved. Try updating details in Settings later.')
        }
        if (guestSnapshot.length) {
          await migrateGuestDataToUser(cred.user.uid)
        }
        let verificationEmailSent = true
        try {
          if (isCustomAuthEmailEnabled()) {
            const token = await cred.user.getIdToken()
            await sendCustomEmailVerificationRequest(token)
          } else {
            await sendEmailVerification(cred.user, buildEmailVerificationActionCodeSettings())
          }
        } catch (e) {
          verificationEmailSent = false
          toast.error(e instanceof Error ? e.message : mapFirebaseAuthError(e))
        }
        setGuestSessionFlag(false)
        setGuestSession(false)
        await signOut(auth)
        return { verificationEmailSent }
      } catch (e) {
        throw new Error(mapFirebaseAuthError(e))
      }
    },
    [firebaseEnabled],
  )

  const resendEmailVerification = useCallback(async () => {
    if (!firebaseEnabled) {
      throw new Error('Cloud sign-in is not available in this build.')
    }
    const auth = getFirebaseAuth()
    const u = auth.currentUser
    if (!u) {
      throw new Error('You must be signed in to resend the verification email.')
    }
    await reload(u)
    if (isCustomAuthEmailEnabled()) {
      const token = await u.getIdToken()
      await sendCustomEmailVerificationRequest(token)
    } else {
      await sendEmailVerification(u, buildEmailVerificationActionCodeSettings())
    }
  }, [firebaseEnabled])

  const refreshAuthUser = useCallback(async (): Promise<boolean> => {
    if (!firebaseEnabled) return false
    const auth = getFirebaseAuth()
    const u = auth.currentUser
    if (!u) return false
    await reload(u)
    bumpAuthRender()
    return u.emailVerified === true
  }, [firebaseEnabled])

  const signOutEverywhere = useCallback(async () => {
    if (firebaseEnabled && getFirebaseAuth().currentUser) {
      await signOut(getFirebaseAuth())
    }
    setGuestSessionFlag(false)
    setGuestSession(false)
    setUser(null)
    setAccountProfile(null)
  }, [firebaseEnabled])

  const displayLabel = useMemo(() => {
    if (guestSession && !user) return 'Guest'
    if (user) {
      return (
        accountProfile?.fullName?.trim() ||
        user.displayName?.trim() ||
        user.email ||
        'Account'
      )
    }
    return 'Signed out'
  }, [guestSession, user, accountProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      guestSession,
      firebaseEnabled,
      firebaseMissingEnvVars,
      accountProfile,
      enterGuestSession,
      signInWithEmail,
      signUpWithEmail,
      resendEmailVerification,
      refreshAuthUser,
      signOutEverywhere,
      displayLabel,
    }),
    [
      user,
      authLoading,
      guestSession,
      firebaseEnabled,
      firebaseMissingEnvVars,
      accountProfile,
      enterGuestSession,
      signInWithEmail,
      signUpWithEmail,
      resendEmailVerification,
      refreshAuthUser,
      signOutEverywhere,
      displayLabel,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
