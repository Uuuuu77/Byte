import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  type User,
  type UserCredential,
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"

// Enhanced error logging function
function logAuthError(method: string, error: any): void {
  console.error(`Auth error in ${method}:`, {
    code: error.code,
    message: error.message,
    fullError: error,
  })
}

// Email/Password Login
export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    logAuthError("loginWithEmail", error)
    throw error
  }
}

// Google Login
export async function loginWithGoogle(): Promise<UserCredential> {
  try {
    // Force refresh token to ensure we're not using cached credentials
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })
    return await signInWithPopup(auth, googleProvider)
  } catch (error: any) {
    logAuthError("loginWithGoogle", error)
    throw error
  }
}

// Email/Password Signup
export async function signupWithEmail(email: string, password: string, name: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })
    return userCredential.user
  } catch (error: any) {
    logAuthError("signupWithEmail", error)
    throw error
  }
}

// Google Signup (same as login but semantically different)
export async function signupWithGoogle(): Promise<UserCredential> {
  try {
    // Force refresh token to ensure we're not using cached credentials
    googleProvider.setCustomParameters({
      prompt: "select_account",
    })
    return await signInWithPopup(auth, googleProvider)
  } catch (error: any) {
    logAuthError("signupWithGoogle", error)
    throw error
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    return await signOut(auth)
  } catch (error: any) {
    logAuthError("logout", error)
    throw error
  }
}

// Password Reset
export async function resetPassword(email: string): Promise<void> {
  try {
    return await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    logAuthError("resetPassword", error)
    throw error
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

