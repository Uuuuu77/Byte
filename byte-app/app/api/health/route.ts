// Add a new API health check endpoint to verify API keys and model availability

import { NextResponse } from "next/server"
import { getAvailableProviders, isApiKeyAvailable } from "@/utils/ai-helpers"

export async function GET() {
  try {
    const availableProviders = getAvailableProviders()

    const apiStatus = {
      groq: isApiKeyAvailable("groq"),
      google: isApiKeyAvailable("google"),
      openai: isApiKeyAvailable("openai"),
      huggingface: isApiKeyAvailable("huggingface"),
      availableProviders,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      status: "ok",
      apiStatus,
      message: "API health check successful",
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "API health check failed",
      },
      { status: 500 },
    )
  }
}

