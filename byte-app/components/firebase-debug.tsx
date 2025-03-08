"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/firebase"

export function FirebaseDebug() {
  const [showDebug, setShowDebug] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const testFirebaseConnection = async () => {
    try {
      setTestResult("Testing Firebase connection...")

      // Check if auth is initialized
      if (!auth) {
        throw new Error("Firebase Auth is not initialized")
      }

      // Try to get the current user (this doesn't require authentication)
      const currentUser = auth.currentUser

      setTestResult(`Firebase connection successful! Current user: ${currentUser ? "Logged in" : "Not logged in"}`)
    } catch (error: any) {
      console.error("Firebase test error:", error)
      setTestResult(`Firebase connection error: ${error.message}`)
    }
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          variant="outline"
          className="bg-primary-black/80 border-gray-800 text-secondary-light"
        >
          Debug Firebase
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 max-w-[90vw]">
      <Card className="bg-primary-black/90 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-secondary-light">Firebase Debug</CardTitle>
          <Button
            onClick={() => setShowDebug(false)}
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-primary-black/60 border-gray-800"
          >
            Close
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-secondary-light/80">
            <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Not set"}</p>
            <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Not set"}</p>
            <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Not set"}</p>
            <p>Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Not set"}</p>
          </div>

          <Button
            onClick={testFirebaseConnection}
            className="w-full bg-primary-orange hover:bg-primary-gold text-white"
          >
            Test Firebase Connection
          </Button>

          {testResult && (
            <div className="text-xs p-2 bg-primary-black/60 rounded border border-gray-800 text-secondary-light">
              {testResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

