import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { savingSchema } from '@/lib/schemas'
import { getFirebaseDb } from '@/services/firebase/config'
import type { Saving } from '@/types/saving'

function savingsCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'savings')
}

export function userSavingsQuery(uid: string) {
  return query(savingsCol(uid), orderBy('createdAt', 'desc'))
}

function sanitizeSavingFromFirestore(docId: string, data: unknown): unknown {
  const o: Record<string, unknown> = { ...(data as Record<string, unknown>), id: docId }
  delete o.updatedAt
  const created = o.createdAt
  if (created instanceof Timestamp) {
    o.createdAt = created.toDate().toISOString()
  }
  if (o.note === null || o.note === '') {
    delete o.note
  }
  return o
}

export function parseSavingDoc(docId: string, data: unknown): Saving | null {
  const parsed = savingSchema.safeParse(sanitizeSavingFromFirestore(docId, data))
  return parsed.success ? parsed.data : null
}

function snapshotToRows(snap: QuerySnapshot): Saving[] {
  const rows: Saving[] = []
  snap.forEach((d) => {
    const row = parseSavingDoc(d.id, d.data())
    if (row) rows.push(row)
  })
  return rows
}

export async function fetchUserSavingsOnce(uid: string): Promise<Saving[]> {
  const snap = await getDocs(userSavingsQuery(uid))
  return snapshotToRows(snap)
}

export function subscribeUserSavings(
  uid: string,
  onData: (rows: Saving[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    userSavingsQuery(uid),
    (snap) => onData(snapshotToRows(snap)),
    (err) => onError(err.message ?? 'Unknown sync error'),
  )
}

export function serializeSavingForWrite(s: Saving, userId: string) {
  return {
    id: s.id,
    userId,
    amount: s.amount,
    title: s.title,
    note: s.note ?? null,
    date: s.date,
    createdAt: s.createdAt,
    updatedAt: serverTimestamp(),
  }
}

export async function createUserSaving(uid: string, s: Saving) {
  await setDoc(doc(getFirebaseDb(), 'users', uid, 'savings', s.id), serializeSavingForWrite(s, uid))
}

export async function deleteUserSaving(uid: string, id: string) {
  await deleteDoc(doc(getFirebaseDb(), 'users', uid, 'savings', id))
}
