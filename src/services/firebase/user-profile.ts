import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'
import { parseDisplayCurrencyCode, type DisplayCurrencyCode } from '@/lib/currencies'
import { getFirebaseDb } from '@/services/firebase/config'

const ACCOUNT_DOC = 'account'

function accountRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, 'profile', ACCOUNT_DOC)
}

export type ColorModePreference = 'light' | 'dark' | 'system'

export type UserAccountProfile = {
  fullName: string
  phoneE164: string
  phoneCountryIso?: string
  /** Workspace appearance; synced for signed-in users only. */
  colorMode?: ColorModePreference
  /** How amounts are formatted in the UI (not an FX conversion). */
  displayCurrency?: DisplayCurrencyCode
}

export async function writeUserAccountProfile(uid: string, data: UserAccountProfile) {
  await setDoc(
    accountRef(uid),
    {
      fullName: data.fullName,
      phoneE164: data.phoneE164,
      phoneCountryIso: data.phoneCountryIso ?? null,
      ...(data.colorMode ? { colorMode: data.colorMode } : {}),
      ...(data.displayCurrency ? { displayCurrency: data.displayCurrency } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function writeUserColorMode(uid: string, mode: ColorModePreference) {
  await setDoc(
    accountRef(uid),
    {
      colorMode: mode,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function writeUserDisplayCurrency(uid: string, code: DisplayCurrencyCode) {
  await setDoc(
    accountRef(uid),
    {
      displayCurrency: code,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export function subscribeUserAccountProfile(
  uid: string,
  onData: (data: UserAccountProfile | null) => void,
): Unsubscribe {
  return onSnapshot(
    accountRef(uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null)
        return
      }
      const d = snap.data() as Record<string, unknown>
      const rawMode = d.colorMode
      const colorMode: ColorModePreference | undefined =
        rawMode === 'light' || rawMode === 'dark' || rawMode === 'system' ? rawMode : undefined
      const displayCurrency = parseDisplayCurrencyCode(d.displayCurrency)
      onData({
        fullName: String(d.fullName ?? ''),
        phoneE164: String(d.phoneE164 ?? ''),
        phoneCountryIso: d.phoneCountryIso != null ? String(d.phoneCountryIso) : undefined,
        ...(colorMode ? { colorMode } : {}),
        ...(displayCurrency ? { displayCurrency } : {}),
      })
    },
    () => {
      // Missing rules or network: do not break the app; profile fields stay empty until fixed.
      onData(null)
    },
  )
}
