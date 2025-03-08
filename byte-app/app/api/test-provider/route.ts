import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const provider = url.searchParams.get("provider")

  if (!provider) {
    return NextResponse.json(
      {
        error: "Provider parameter is required",
        success: false,
      },
      { status: 400 },
    )
  }

  try {
    let result = false

    switch (provider) {
      case "groq":
        if (!process.env.GROQ_API_KEY) {
          throw new Error("GROQ_API_KEY is not set")
        }

        // Test with a simple prompt
        await generateText({
          model: groq("deepseek-r1-distill-llama-70b"),
          prompt: "Hello, are you working?",
          maxTokens: 10,
        })

        result = true
        break

      case "google":
        if (!process.env.GOOGLE_AI_API_KEY) {
          throw new Error("GOOGLE_AI_API_KEY is not set")
        }

        // Test with a simple prompt
        await generateText({
          model: google("gemini-pro"),
          prompt: "Hello, are you working?",
          maxTokens: 10,
        })

        result = true
        break

      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OPENAI_API_KEY is not set")
        }

        // Test with a simple prompt
        await generateText({
          model: openai("gpt-4"),
          prompt: "Hello, are you working?",
          maxTokens: 10,
        })

        result = true
        break

      case "huggingface":
        if (!process.env.HUGGINGFACE_API_KEY) {
          throw new Error("HUGGINGFACE_API_KEY is not set")
        }

        // For Hugging Face, we'll just check if the API key exists
        // since we don't have a direct integration with the AI SDK
        result = true
        break

      default:
        throw new Error(`Unknown provider: ${provider}`)
    }

    return NextResponse.json({
      provider,
      success: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error testing provider ${provider}:`, error)

    return NextResponse.json(
      {
        provider,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

