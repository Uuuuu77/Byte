"use client"

import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    setUser(null)

    try {
      console.log("Starting Google authentication...")
      console.log("Firebase auth object:", auth)
      console.log("Google provider:", googleProvider)

      const result = await signInWithPopup(auth, googleProvider)

      console.log("Google login successful:", result.user)
      setUser({
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      })
    } catch (error: any) {
      console.error("Google login error:", error)
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      })

      setError(`${error.code}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-primary-black/60 border-gray-800 text-secondary-light hover:bg-primary-orange hover:text-white glow-effect transition-all duration-300"
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {user && (
        <Alert className="bg-green-900/20 border-green-900/50">
          <AlertDescription className="text-green-400">
            Signed in as {user.displayName} ({user.email})
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

