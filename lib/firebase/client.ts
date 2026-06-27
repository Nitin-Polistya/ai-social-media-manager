import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config"

// Lazily initialised — never runs during SSR / build
let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _firestore: Firestore | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null
  if (!isFirebaseConfigured()) return null
  if (_app) return _app
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return _app
}

export function getFirebaseAuth(): Auth | null {
  if (_auth) return _auth
  const app = getFirebaseApp()
  if (!app) return null
  _auth = getAuth(app)
  return _auth
}

export function getFirebaseFirestore(): Firestore | null {
  if (_firestore) return _firestore
  const app = getFirebaseApp()
  if (!app) return null
  _firestore = getFirestore(app)
  return _firestore
}

// Convenience accessors — safe to import anywhere; return null on server
export const auth = getFirebaseAuth()
export const firestore = getFirebaseFirestore()
