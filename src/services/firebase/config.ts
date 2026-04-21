import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

function readFirebaseEnv() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
  }
}

/** Names of env vars that are empty or missing (safe to show in UI — no values). */
export function listMissingFirebaseEnvVars(): string[] {
  const e = readFirebaseEnv()
  const missing: string[] = []
  if (!e.apiKey?.trim()) missing.push('VITE_FIREBASE_API_KEY')
  if (!e.authDomain?.trim()) missing.push('VITE_FIREBASE_AUTH_DOMAIN')
  if (!e.projectId?.trim()) missing.push('VITE_FIREBASE_PROJECT_ID')
  if (!e.storageBucket?.trim()) missing.push('VITE_FIREBASE_STORAGE_BUCKET')
  if (!e.messagingSenderId?.trim()) missing.push('VITE_FIREBASE_MESSAGING_SENDER_ID')
  if (!e.appId?.trim()) missing.push('VITE_FIREBASE_APP_ID')
  return missing
}

/** True when all required web client env vars are present (guest mode works when false). */
export function isFirebaseConfigured(): boolean {
  return listMissingFirebaseEnvVars().length === 0
}

function getOrInitApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error('Web client is not configured. Add all keys from .env.example to your .env file.')
  }
  if (!app) {
    const e = readFirebaseEnv()
    app = getApps().length
      ? getApps()[0]!
      : initializeApp({
          apiKey: e.apiKey!,
          authDomain: e.authDomain!,
          projectId: e.projectId!,
          storageBucket: e.storageBucket!,
          messagingSenderId: e.messagingSenderId!,
          appId: e.appId!,
          ...(e.measurementId?.trim() ? { measurementId: e.measurementId.trim() } : {}),
        })
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getOrInitApp())
  }
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getOrInitApp())
  }
  return db
}
