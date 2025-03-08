import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get Firebase configuration from environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }

    // Check if all required configuration values are present
    const missingValues = Object.entries(firebaseConfig)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingValues.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Firebase configuration values",
          missingValues,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Firebase configuration is complete",
      config: {
        apiKey: `${firebaseConfig.apiKey?.substring(0, 5)}...`,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

