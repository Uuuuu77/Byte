"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/firebase"

export function FirebaseAnalytics() {
  useEffect(() => {
    if (analytics) {
      analytics.then((analyticsInstance) => {
        if (analyticsInstance) {
          console.log("Firebase Analytics initialized")
        } else {
          console.log("Firebase Analytics not supported in this environment")
        }
      })
    }
  }, [])

  return null
}

