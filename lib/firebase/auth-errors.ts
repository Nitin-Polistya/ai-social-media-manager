import { FirebaseError } from "firebase/app"

const AUTH_MESSAGES: Record<string, string> = {
  "auth/invalid-credential":
    "No account found with these credentials. Please sign up first or check your password.",
  "auth/user-not-found": "No account found. Please sign up first.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
  "auth/popup-blocked": "Pop-up was blocked. Allow pop-ups for this site and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method is not enabled. Contact support.",
}

export function getFirebaseAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && AUTH_MESSAGES[error.code]) {
    return AUTH_MESSAGES[error.code]
  }
  if (error instanceof Error && error.message.includes("auth/")) {
    const code = error.message.match(/auth\/[\w-]+/)?.[0]
    if (code && AUTH_MESSAGES[code]) return AUTH_MESSAGES[code]
  }
  return "Something went wrong. Please try again."
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Please enter a valid email address."
  }
  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters."
  return null
}
