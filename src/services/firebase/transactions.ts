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
  updateDoc,
  writeBatch,
  Timestamp,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/services/firebase/config'
import type { Transaction } from '@/types/transaction'
import { transactionSchema } from '@/lib/schemas'

function transactionsCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'transactions')
}

export function userTransactionsQuery(uid: string) {
  return query(transactionsCol(uid), orderBy('createdAt', 'desc'))
}

function snapshotToRows(snap: QuerySnapshot): Transaction[] {
  const rows: Transaction[] = []
  snap.forEach((d) => {
    const row = parseTransactionDoc(d.id, d.data())
    if (row) rows.push(row)
  })
  return rows
}

/** One-shot read so the UI is not blocked waiting for the first realtime snapshot. */
export async function fetchUserTransactionsOnce(uid: string): Promise<Transaction[]> {
  const snap = await getDocs(userTransactionsQuery(uid))
  return snapshotToRows(snap)
}

/** Normalize Firestore document fields before Zod (null notes, Timestamp dates, server-only fields). */
function sanitizeTransactionFromFirestore(docId: string, data: unknown): unknown {
  const o: Record<string, unknown> = { ...(data as Record<string, unknown>), id: docId }
  delete o.userId
  delete o.updatedAt
  if (o.note === null || o.note === '') {
    delete o.note
  }
  const created = o.createdAt
  if (created instanceof Timestamp) {
    o.createdAt = created.toDate().toISOString()
  }
  return o
}

export function parseTransactionDoc(docId: string, data: unknown): Transaction | null {
  const parsed = transactionSchema.safeParse(sanitizeTransactionFromFirestore(docId, data))
  return parsed.success ? parsed.data : null
}

export function serializeTransactionForWrite(t: Transaction, userId: string) {
  return {
    id: t.id,
    userId,
    title: t.title,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    note: t.note ?? null,
    createdAt: t.createdAt,
    updatedAt: serverTimestamp(),
  }
}

export function subscribeUserTransactions(
  uid: string,
  onData: (rows: Transaction[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    userTransactionsQuery(uid),
    (snap) => onData(snapshotToRows(snap)),
    (err) => onError(err.message ?? 'Unknown Firestore error'),
  )
}

export async function createUserTransaction(uid: string, t: Transaction) {
  await setDoc(
    doc(getFirebaseDb(), 'users', uid, 'transactions', t.id),
    serializeTransactionForWrite(t, uid),
  )
}

export async function updateUserTransaction(uid: string, t: Transaction) {
  await updateDoc(doc(getFirebaseDb(), 'users', uid, 'transactions', t.id), {
    title: t.title,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    note: t.note ?? null,
    createdAt: t.createdAt,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteUserTransaction(uid: string, id: string) {
  await deleteDoc(doc(getFirebaseDb(), 'users', uid, 'transactions', id))
}

const BATCH_LIMIT = 450

export async function replaceAllUserTransactions(uid: string, next: Transaction[]) {
  const db = getFirebaseDb()
  const col = transactionsCol(uid)
  const existingSnap = await getDocs(col)
  const deletes: string[] = []
  existingSnap.forEach((d) => deletes.push(d.id))

  for (let i = 0; i < deletes.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db)
    for (const id of deletes.slice(i, i + BATCH_LIMIT)) {
      batch.delete(doc(db, 'users', uid, 'transactions', id))
    }
    await batch.commit()
  }

  for (let i = 0; i < next.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db)
    for (const t of next.slice(i, i + BATCH_LIMIT)) {
      batch.set(doc(db, 'users', uid, 'transactions', t.id), serializeTransactionForWrite(t, uid))
    }
    await batch.commit()
  }
}

export async function mergeUserTransactions(uid: string, incoming: Transaction[]) {
  const db = getFirebaseDb()
  for (let i = 0; i < incoming.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db)
    for (const t of incoming.slice(i, i + BATCH_LIMIT)) {
      batch.set(doc(db, 'users', uid, 'transactions', t.id), serializeTransactionForWrite(t, uid), {
        merge: true,
      })
    }
    await batch.commit()
  }
}
