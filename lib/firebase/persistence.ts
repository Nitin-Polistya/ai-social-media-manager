import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth"

/** Switch to browserSessionPersistence for session-only login */
export type AuthPersistenceMode = "local" | "session"

export async function configureAuthPersistence(
  auth: Auth,
  mode: AuthPersistenceMode = "local"
): Promise<void> {
  const persistence =
    mode === "session" ? browserSessionPersistence : browserLocalPersistence
  await setPersistence(auth, persistence)
}
