"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setAuthState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            providerData: user.providerData,
            metadata: {
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime,
            },
          },
          isAuthenticated: true,
        })
      } else {
        // User is signed out
        setAuthState({
          user: null,
          isAuthenticated: false,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          variant="outline"
          className="bg-primary-black/80 border-gray-800 text-secondary-light"
        >
          Debug Auth
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="bg-primary-black/90 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-secondary-light">Auth Debug Info</CardTitle>
          <Button
            onClick={() => setShowDebug(false)}
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-primary-black/60 border-gray-800"
          >
            Close
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-secondary-light/80 overflow-auto max-h-[50vh]">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

