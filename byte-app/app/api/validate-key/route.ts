import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const provider = url.searchParams.get("provider")
  const key = url.searchParams.get("key")

  if (!provider || !key) {
    return NextResponse.json(
      {
        error: "Provider and key parameters are required",
        valid: false,
      },
      { status: 400 },
    )
  }

  try {
    let valid = false

    switch (provider) {
      case "groq":
        try {
          // Test with a simple prompt
          await generateText({
            model: groq("mixtral-8x7b-32768", { apiKey: key }),
            prompt: "Test",
            maxTokens: 5,
          })
          valid = true
        } catch (error) {
          console.error("Groq API key validation error:", error)
          valid = false
        }
        break

      case "google":
        try {
          // Test with a simple prompt
          await generateText({
            model: google("gemini-pro", { apiKey: key }),
            prompt: "Test",
            maxTokens: 5,
          })
          valid = true
        } catch (error) {
          console.error("Google API key validation error:", error)
          valid = false
        }
        break

      case "openai":
        try {
          // Test with a simple prompt
          await generateText({
            model: openai("gpt-3.5-turbo", { apiKey: key }),
            prompt: "Test",
            maxTokens: 5,
          })
          valid = true
        } catch (error) {
          console.error("OpenAI API key validation error:", error)
          valid = false
        }
        break

      case "huggingface":
        try {
          // Test with a direct API call to Hugging Face
          const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: "Test",
                parameters: {
                  max_new_tokens: 5,
                },
              }),
            },
          )

          valid = response.ok
        } catch (error) {
          console.error("Hugging Face API key validation error:", error)
          valid = false
        }
        break

      default:
        return NextResponse.json(
          {
            error: `Unknown provider: ${provider}`,
            valid: false,
          },
          { status: 400 },
        )
    }

    return NextResponse.json({
      provider,
      valid,
    })
  } catch (error) {
    console.error(`Error validating ${provider} API key:`, error)

    return NextResponse.json(
      {
        provider,
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

