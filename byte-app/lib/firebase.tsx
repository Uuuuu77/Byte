import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getAnalytics, isSupported } from "firebase/analytics"

// Firebase configuration - updated with correct values
const firebaseConfig = {
  apiKey: "AIzaSyAbMJ2aAS9-Oe5ZD8jw4S9Rh1dNLo8UBLY",
  authDomain: "byte-95662.firebaseapp.com",
  projectId: "byte-95662",
  storageBucket: "byte-95662.appspot.com", // Fixed: Changed from .firebasestorage.com to .appspot.com
  messagingSenderId: "1074590288555",
  appId: "1:1074590288555:web:9627f5676b0ee6418185ee",
  measurementId: "G-3T9PG4CQS0",
}

// Create a function to initialize Firebase with error handling
function initializeFirebase() {
  try {
    console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig))
    // Use a unique app name to avoid conflicts
    return initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    throw error
  }
}

// Initialize Firebase
const app = initializeFirebase()

// Initialize Firebase Authentication
let auth
try {
  auth = getAuth(app)
  console.log("Firebase Auth initialized successfully")
} catch (error) {
  console.error("Error initializing Firebase Auth:", error)
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()
// Configure Google provider with additional scopes and parameters
googleProvider.addScope("email")
googleProvider.addScope("profile")
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Initialize Analytics only in browser environment
const analytics = typeof window !== "undefined" ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)) : null

export { auth, googleProvider, analytics }
export default app

