import {
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth"

export type AuthPersistenceMode = "local" | "session" | "inMemory"

/**
 * Configures Firebase Auth persistence:
 * - "local"    → survives browser close (localStorage)
 * - "session"  → survives refresh, cleared on tab/browser close (sessionStorage)
 * - "inMemory" → cleared on every page refresh or browser close (no storage)
 */
export async function configureAuthPersistence(
  auth: Auth,
  mode: AuthPersistenceMode = "inMemory"
): Promise<void> {
  let persistence
  if (mode === "session") {
    persistence = browserSessionPersistence
  } else if (mode === "local") {
    persistence = browserLocalPersistence
  } else {
    persistence = inMemoryPersistence
  }
  await setPersistence(auth, persistence)
}
