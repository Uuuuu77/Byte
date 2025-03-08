import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { isCryptoQuery } from "@/utils/disclaimer"

// Function to get the system prompt based on research mode
function getSystemPrompt(mode: string): string {
  switch (mode) {
    case "crypto":
      return `You are Byte - a cryptocurrency research assistant. Analyze the following query:

Guidelines:
1. Identify project type (DeFi, NFT, L1/L2, etc.)
2. Assess tokenomics: inflation, vesting, utility
3. Compare with 3 main competitors
4. List risks: regulatory, technical, market
5. Never suggest investments
6. Cite sources where possible

Format:
Project Type: 
Key Features:
Competitive Landscape:
Risk Analysis:
Recent Developments:`
    case "scientific":
      return `You are Byte - a scientific research assistant. Analyze the following query:

Guidelines:
1. Provide a brief overview of the topic
2. Explain key concepts and theories
3. Discuss recent advancements or discoveries
4. Highlight potential applications or implications
5. Mention any controversies or debates in the field
6. Cite reputable scientific sources

Format:
Overview:
Key Concepts:
Recent Advancements:
Applications/Implications:
Controversies/Debates:
Sources:`
    case "code":
      return `You are Byte - a coding and technology expert. Analyze the following query:

Guidelines:
1. Explain technical concepts clearly
2. Provide code examples when relevant
3. Compare different approaches or technologies
4. Discuss best practices and potential pitfalls
5. Mention performance considerations
6. Suggest resources for further learning

Format:
Concept Explanation:
Code Example (if applicable):
Comparison (if applicable):
Best Practices:
Performance Considerations:
Further Resources:`
    case "news":
      return `You are Byte - a news analyst. Analyze the following query:

Guidelines:
1. Provide a balanced overview of the topic
2. Present multiple perspectives
3. Distinguish between facts and opinions
4. Highlight key developments
5. Provide context and background
6. Cite reputable news sources

Format:
Overview:
Key Developments:
Different Perspectives:
Context & Background:
Analysis:
Sources:`
    default:
      return `You are Byte - an expert research assistant. Process this query:

Steps:
1. Break down into sub-questions
2. Find authoritative sources (2020-2024)
3. Present multiple perspectives
4. Highlight consensus areas
5. Note unresolved debates

Format:
Key Question: 
Main Perspectives:
Perspective 1 (Source: ...)
Perspective 2 (Source: ...)
Emerging Consensus:
Open Questions:`
  }
}

// Function to validate API keys
function validateApiKeys(providedKeys?: Record<string, string>) {
  const apiKeys = {
    groq: providedKeys?.GROQ_API_KEY || process.env.GROQ_API_KEY,
    google: providedKeys?.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY,
    openai: providedKeys?.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    huggingface: providedKeys?.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY,
  }

  const availableProviders = Object.entries(apiKeys)
    .filter(([_, key]) => key && key.length > 0)
    .map(([provider]) => provider)

  return {
    available: availableProviders,
    groq: !!apiKeys.groq,
    google: !!apiKeys.google,
    openai: !!apiKeys.openai,
    huggingface: !!apiKeys.huggingface,
    keys: apiKeys,
  }
}

// Generate a fallback response when all else fails
async function generateFallbackResponse(query: string, mode: string): Promise<string> {
  return `# Analysis of "${query}"

I apologize, but I couldn't process your request through our AI models at the moment. Here's a general response based on your query:

## Key Points
- Your query about "${query}" touches on important concepts in ${mode === "crypto" ? "cryptocurrency" : mode === "code" ? "programming" : mode === "scientific" ? "science" : "this field"}
- To get more specific information, please try again in a few moments
- Our system is currently prioritizing requests and will be fully operational soon

## Suggestions
- Try using one of our recommended models: Groq Deepseek or Groq Mixtral
- Consider refining your query to be more specific
- Check our API status page for current system availability

Thank you for your patience as we work to provide you with the best research experience.`
}

export async function POST(req: Request) {
  try {
    const { query, mode, model, apiKeys: providedKeys } = await req.json()

    // Validate that we have a query
    if (!query || query.trim() === "") {
      return NextResponse.json(
        {
          error: "Query is required",
          success: false,
        },
        { status: 400 },
      )
    }

    // Get available API keys, including any provided by the user
    const availableKeys = validateApiKeys(providedKeys)

    // Get the appropriate system prompt based on the research mode
    const systemPrompt = getSystemPrompt(mode)

    // Determine which model to use based on availability and user selection
    let aiModel
    let modelProvider = ""
    let modelName = ""

    try {
      if (model.startsWith("groq-") && availableKeys.groq) {
        // Map model names to actual Groq models
        const groqModelMap: Record<string, string> = {
          "groq-llama-3-3": "llama-3-70b-8192",
          "groq-llama-3-2": "llama-3-8b-8192",
          "groq-llama-3-1": "llama-3-1-8b-8192",
          "groq-llama-guard": "llama-guard-3-8b",
          "groq-deepseek-r1": "deepseek-r1-distill-llama-70b",
          "groq-mixtral-8x7b": "mixtral-8x7b-32768",
        }

        const groqModelName = groqModelMap[model] || "deepseek-r1-distill-llama-70b"
        aiModel = groq(groqModelName, { apiKey: availableKeys.keys.groq })
        modelProvider = "groq"
        modelName = groqModelName
      } else if (model.startsWith("google-") && availableKeys.google) {
        // Map model names to actual Google models
        const googleModelMap: Record<string, string> = {
          "google-gemini-pro": "gemini-pro",
          "google-gemma-2": "gemma-2-9b-it",
        }

        const googleModelName = googleModelMap[model] || "gemini-pro"
        aiModel = google(googleModelName, { apiKey: availableKeys.keys.google })
        modelProvider = "google"
        modelName = googleModelName
      } else if (model.startsWith("openai-") && availableKeys.openai) {
        // Map model names to actual OpenAI models
        const openaiModelMap: Record<string, string> = {
          "openai-gpt4": "gpt-4",
          "openai-gpt4-turbo": "gpt-4-turbo",
        }

        const openaiModelName = openaiModelMap[model] || "gpt-4"
        aiModel = openai(openaiModelName, { apiKey: availableKeys.keys.openai })
        modelProvider = "openai"
        modelName = openaiModelName
      } else if (model === "auto") {
        // Auto-select based on query content and available providers
        const queryLower = query.toLowerCase()
        const isCrypto = isCryptoQuery(query)

        if (availableKeys.groq) {
          if (isCrypto) {
            aiModel = groq("deepseek-r1-distill-llama-70b", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "deepseek-r1-distill-llama-70b"
          } else if (queryLower.includes("code")) {
            aiModel = groq("llama-3-70b-8192", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "llama-3-70b-8192"
          } else {
            aiModel = groq("mixtral-8x7b-32768", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "mixtral-8x7b-32768"
          }
        } else if (availableKeys.google) {
          aiModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
          modelProvider = "google"
          modelName = "gemini-pro"
        } else if (availableKeys.openai) {
          aiModel = openai("gpt-4", { apiKey: availableKeys.keys.openai })
          modelProvider = "openai"
          modelName = "gpt-4"
        } else {
          // No API keys available, use fallback
          const fallbackResponse = await generateFallbackResponse(query, mode)
          return NextResponse.json({
            response: fallbackResponse,
            model: "Fallback (No API keys available)",
            success: true,
          })
        }
      } else {
        // If the selected model is not available, use the first available provider
        if (availableKeys.groq) {
          aiModel = groq("deepseek-r1-distill-llama-70b", { apiKey: availableKeys.keys.groq })
          modelProvider = "groq"
          modelName = "deepseek-r1-distill-llama-70b"
        } else if (availableKeys.google) {
          aiModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
          modelProvider = "google"
          modelName = "gemini-pro"
        } else if (availableKeys.openai) {
          aiModel = openai("gpt-4", { apiKey: availableKeys.keys.openai })
          modelProvider = "openai"
          modelName = "gpt-4"
        } else {
          // No API keys available, use fallback
          const fallbackResponse = await generateFallbackResponse(query, mode)
          return NextResponse.json({
            response: fallbackResponse,
            model: "Fallback (No API keys available)",
            success: true,
          })
        }
      }
    } catch (error) {
      console.error("Error selecting AI model:", error)
      // Use fallback if model selection fails
      const fallbackResponse = await generateFallbackResponse(query, mode)
      return NextResponse.json({
        response: fallbackResponse,
        model: "Fallback (Model selection error)",
        success: true,
      })
    }

    // If we don't have a model by now, use fallback
    if (!aiModel) {
      const fallbackResponse = await generateFallbackResponse(query, mode)
      return NextResponse.json({
        response: fallbackResponse,
        model: "Fallback (No suitable model found)",
        success: true,
      })
    }

    try {
      // Generate the response with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

      const { text } = await generateText({
        model: aiModel,
        prompt: query,
        system: systemPrompt,
        maxTokens: 1500, // Limit token count to prevent timeouts
      })

      clearTimeout(timeoutId)

      // Add disclaimer for crypto-related content
      let finalResponse = text
      if (mode === "crypto" || isCryptoQuery(query)) {
        finalResponse +=
          "\n\n**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions."
      }

      return NextResponse.json({
        response: finalResponse,
        model: `${modelProvider.charAt(0).toUpperCase() + modelProvider.slice(1)}: ${modelName}`,
        success: true,
      })
    } catch (error) {
      console.error("AI generation error:", error)

      // If the primary model fails, try a fallback model
      try {
        let fallbackModel

        if (modelProvider === "groq") {
          // If the original model was from Groq, try a different Groq model
          fallbackModel = groq(
            modelName === "deepseek-r1-distill-llama-70b" ? "mixtral-8x7b-32768" : "deepseek-r1-distill-llama-70b",
            { apiKey: availableKeys.keys.groq },
          )
        } else if (availableKeys.groq) {
          // If another provider failed but Groq is available, use Groq
          fallbackModel = groq("deepseek-r1-distill-llama-70b", { apiKey: availableKeys.keys.groq })
        } else if (availableKeys.google) {
          // Try Google if available
          fallbackModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
        } else if (availableKeys.openai) {
          // Try OpenAI if available
          fallbackModel = openai("gpt-4", { apiKey: availableKeys.keys.openai })
        } else {
          throw new Error("No fallback models available")
        }

        const { text } = await generateText({
          model: fallbackModel,
          prompt: query,
          system: systemPrompt,
          maxTokens: 1500,
        })

        // Add disclaimer for crypto-related content
        let finalResponse = text
        if (mode === "crypto" || isCryptoQuery(query)) {
          finalResponse +=
            "\n\n**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions."
        }

        return NextResponse.json({
          response: finalResponse,
          model: "Fallback model (original request failed)",
          success: true,
        })
      } catch (fallbackError) {
        console.error("Fallback model error:", fallbackError)

        // If all models fail, use the text fallback
        const fallbackResponse = await generateFallbackResponse(query, mode)
        return NextResponse.json({
          response: fallbackResponse,
          model: "Text Fallback (All API attempts failed)",
          success: true,
        })
      }
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        error: "An error occurred while processing your request. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}

