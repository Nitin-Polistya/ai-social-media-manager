import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config"

function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

const app = getFirebaseApp()

export const auth = app ? getAuth(app) : null
export const firestore = app ? getFirestore(app) : null
