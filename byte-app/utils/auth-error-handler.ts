// Enhanced Firebase authentication error handler
export function getAuthErrorMessage(errorCode: string): string {
  console.log("Auth error code:", errorCode)

  switch (errorCode) {
    // Google Auth specific errors
    case "auth/popup-closed-by-user":
      return "Authentication canceled. Please try again."
    case "auth/popup-blocked":
      return "Authentication popup was blocked. Please allow popups for this site."
    case "auth/cancelled-popup-request":
      return "Authentication request was cancelled. Please try again."
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address but different sign-in credentials."

    // General auth errors
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support."
    case "auth/user-not-found":
      return "No account found with this email address."
    case "auth/wrong-password":
      return "Invalid password. Please try again."
    case "auth/invalid-email":
      return "Invalid email address format."
    case "auth/email-already-in-use":
      return "This email is already in use. Please use a different email or login."
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password."
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again."
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later."
    case "auth/internal-error":
      return "An internal error occurred. Please try again later."
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support."
    case "auth/requires-recent-login":
      return "This operation requires a recent login. Please log in again."
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth operations. Please contact support."
    case "auth/invalid-credential":
      return "The authentication credential is invalid. Please try again."
    case "auth/invalid-verification-code":
      return "The verification code is invalid. Please try again."
    case "auth/invalid-verification-id":
      return "The verification ID is invalid. Please try again."
    case "auth/missing-verification-code":
      return "The verification code is missing. Please try again."
    case "auth/missing-verification-id":
      return "The verification ID is missing. Please try again."
    case "auth/quota-exceeded":
      return "Quota exceeded. Please try again later."
    default:
      return `Authentication error (${errorCode}). Please try again.`
  }
}

