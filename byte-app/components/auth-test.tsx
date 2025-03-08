"use client"

import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthTest() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testGoogleAuth = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      // Log Firebase auth state
      console.log("Firebase auth object:", auth)
      console.log("Google provider:", googleProvider)

      // Test Google sign-in
      const userCredential = await signInWithPopup(auth, googleProvider)
      console.log("Sign-in successful:", userCredential)

      setResult(`Sign-in successful! User: ${userCredential.user.displayName || userCredential.user.email}`)
    } catch (error: any) {
      console.error("Auth test error:", error)

      // Detailed error logging
      const errorDetails = {
        code: error.code,
        message: error.message,
        stack: error.stack,
        name: error.name,
      }
      console.error("Error details:", errorDetails)

      setError(`Error: ${error.code} - ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-primary-black/40 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-secondary-light">
          Firebase Authentication Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testGoogleAuth}
          disabled={loading}
          className="w-full bg-primary-orange hover:bg-primary-gold text-white"
        >
          {loading ? "Testing..." : "Test Google Authentication"}
        </Button>

        {result && (
          <div className="p-3 bg-green-900/20 border border-green-900/50 rounded text-green-400 text-sm">{result}</div>
        )}

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">{error}</div>
        )}
      </CardContent>
    </Card>
  )
}

