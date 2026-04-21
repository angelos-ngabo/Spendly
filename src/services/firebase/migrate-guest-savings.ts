import { clearGuestSavings, readGuestSavings } from '@/lib/guest-storage'
import { createUserSaving } from '@/services/firebase/savings'

/** Moves guest localStorage savings into the signed-in user's Firestore collection, then clears guest data. */
export async function migrateGuestSavingsToUser(uid: string) {
  const rows = readGuestSavings()
  if (!rows.length) return
  for (const s of rows) {
    await createUserSaving(uid, { ...s, userId: uid })
  }
  clearGuestSavings()
}
