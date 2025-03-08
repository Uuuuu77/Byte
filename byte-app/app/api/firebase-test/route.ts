import { NextResponse } from "next/server"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

export async function GET() {
  try {
    // Test Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAbMJ2aAS9-0e5ZD8jw4S9Rh1dNLo8UBLY",
      authDomain: "byte-95662.firebaseapp.com",
      projectId: "byte-95662",
      storageBucket: "byte-95662.appspot.com",
      messagingSenderId: "1074590288555",
      appId: "1:1074590288555:web:9627f5676b0ee6418185ee",
      measurementId: "G-3T9PG4CQS0",
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig, "api-test")
    const auth = getAuth(app)

    return NextResponse.json({
      success: true,
      message: "Firebase initialized successfully",
      config: {
        apiKey: firebaseConfig.apiKey.substring(0, 10) + "...", // Only show part of the API key for security
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
      },
    })
  } catch (error: any) {
    console.error("API Firebase test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

