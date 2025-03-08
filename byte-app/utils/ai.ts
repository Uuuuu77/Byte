import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"

type AIProvider = "groq" | "google"

export async function getAIResponse(query: string, provider: AIProvider = "groq") {
  try {
    if (provider === "groq") {
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: `As a financial research assistant, analyze and provide insights on: ${query}`,
      })
      return text
    } else {
      const { text } = await generateText({
        model: google("gemini-pro"),
        prompt: `As a financial research assistant, analyze and provide insights on: ${query}`,
      })
      return text
    }
  } catch (error) {
    console.error("Failed to get AI response:", error)
    // If one provider fails, try the other one as fallback
    if (provider === "groq") {
      return getAIResponse(query, "google")
    }
    throw error
  }
}

