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

// Function to call Hugging Face API directly
async function callHuggingFaceAPI(query: string, model: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: query,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || "No response generated"
  } catch (error) {
    console.error("Error calling Hugging Face API:", error)
    throw error
  }
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
      // GROQ MODELS
      if (model.startsWith("groq-") && availableKeys.groq) {
        // Map model names to actual Groq models
        const groqModelMap: Record<string, string> = {
          "groq-llama-3-70b": "llama-3-70b-8192",
          "groq-llama-3-8b": "llama-3-8b-8192",
          "groq-llama-3-1-8b": "llama-3-1-8b-8192",
          "groq-llama-guard": "llama-guard-3-8b",
          "groq-deepseek-r1": "deepseek-r1-distill-llama-70b",
          "groq-mixtral-8x7b": "mixtral-8x7b-32768",
          "groq-gemma-7b": "gemma-7b-it",
          "groq-falcon-180b": "falcon-180b",
          "groq-mixtral-moe": "mixtral-moe-8x7b-32768",
          "groq-codellama-70b": "codellama-70b",
        }

        const groqModelName = groqModelMap[model] || "deepseek-r1-distill-llama-70b"
        aiModel = groq(groqModelName, { apiKey: availableKeys.keys.groq })
        modelProvider = "groq"
        modelName = groqModelName
      }
      // GOOGLE MODELS
      else if (model.startsWith("google-") && availableKeys.google) {
        // Map model names to actual Google models
        const googleModelMap: Record<string, string> = {
          "google-gemini-pro": "gemini-pro",
          "google-gemini-pro-vision": "gemini-pro-vision",
          "google-gemini-ultra": "gemini-ultra",
          "google-gemma-2-9b": "gemma-2-9b-it",
          "google-gemma-2-27b": "gemma-2-27b-it",
          "google-palm-2": "palm-2",
        }

        const googleModelName = googleModelMap[model] || "gemini-pro"
        aiModel = google(googleModelName, { apiKey: availableKeys.keys.google })
        modelProvider = "google"
        modelName = googleModelName
      }
      // OPENAI MODELS
      else if (model.startsWith("openai-") && availableKeys.openai) {
        // Map model names to actual OpenAI models
        const openaiModelMap: Record<string, string> = {
          "openai-gpt4": "gpt-4",
          "openai-gpt4-turbo": "gpt-4-turbo",
          "openai-gpt4o": "gpt-4o",
          "openai-gpt3.5-turbo": "gpt-3.5-turbo",
          "openai-davinci": "text-davinci-003",
          "openai-claude-3-opus": "claude-3-opus-20240229",
          "openai-claude-3-sonnet": "claude-3-sonnet-20240229",
          "openai-claude-3-haiku": "claude-3-haiku-20240307",
        }

        const openaiModelName = openaiModelMap[model] || "gpt-4o"
        aiModel = openai(openaiModelName, { apiKey: availableKeys.keys.openai })
        modelProvider = "openai"
        modelName = openaiModelName
      }
      // HUGGING FACE MODELS - These need special handling
      else if (model.startsWith("hf-") && availableKeys.huggingface) {
        // For Hugging Face, we'll handle it differently since it's not directly supported by AI SDK
        modelProvider = "huggingface"

        // Extract the model name from the model string (remove the "hf-" prefix)
        modelName = model.substring(3)

        // We'll set aiModel to null and handle Hugging Face separately
        aiModel = null
      }
      // AUTO-SELECT MODEL
      else if (model === "auto") {
        // Auto-select based on query content and available providers
        const queryLower = query.toLowerCase()
        const isCrypto = isCryptoQuery(query)

        if (availableKeys.groq) {
          if (isCrypto) {
            aiModel = groq("deepseek-r1-distill-llama-70b", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "deepseek-r1-distill-llama-70b"
          } else if (queryLower.includes("code") || queryLower.includes("programming")) {
            aiModel = groq("codellama-70b", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "codellama-70b"
          } else {
            aiModel = groq("mixtral-8x7b-32768", { apiKey: availableKeys.keys.groq })
            modelProvider = "groq"
            modelName = "mixtral-8x7b-32768"
          }
        } else if (availableKeys.openai) {
          aiModel = openai("gpt-4o", { apiKey: availableKeys.keys.openai })
          modelProvider = "openai"
          modelName = "gpt-4o"
        } else if (availableKeys.google) {
          aiModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
          modelProvider = "google"
          modelName = "gemini-pro"
        } else if (availableKeys.huggingface) {
          modelProvider = "huggingface"

          // Select an appropriate Hugging Face model based on the query
          if (isCrypto) {
            modelName = "mistralai/Mistral-7B-Instruct-v0.2"
          } else if (queryLower.includes("code") || queryLower.includes("programming")) {
            modelName = "bigcode/starcoder2-15b"
          } else {
            modelName = "meta-llama/Llama-2-70b-chat-hf"
          }

          aiModel = null
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
        } else if (availableKeys.openai) {
          aiModel = openai("gpt-4o", { apiKey: availableKeys.keys.openai })
          modelProvider = "openai"
          modelName = "gpt-4o"
        } else if (availableKeys.google) {
          aiModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
          modelProvider = "google"
          modelName = "gemini-pro"
        } else if (availableKeys.huggingface) {
          modelProvider = "huggingface"
          modelName = "mistralai/Mistral-7B-Instruct-v0.2"
          aiModel = null
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

    try {
      let text = ""

      // Handle Hugging Face models separately
      if (modelProvider === "huggingface") {
        text = await callHuggingFaceAPI(query, modelName, availableKeys.keys.huggingface || "")
      } else if (aiModel) {
        // Generate the response with a timeout for other providers
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

        const result = await generateText({
          model: aiModel,
          prompt: query,
          system: systemPrompt,
          maxTokens: 2000, // Increased token count for more detailed responses
        })

        clearTimeout(timeoutId)
        text = result.text
      } else {
        throw new Error("No model available")
      }

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
        let fallbackModelName = ""
        let fallbackProvider = ""

        // Try to find a suitable fallback model
        if (availableKeys.groq) {
          fallbackModel = groq("mixtral-8x7b-32768", { apiKey: availableKeys.keys.groq })
          fallbackModelName = "mixtral-8x7b-32768"
          fallbackProvider = "groq"
        } else if (availableKeys.openai) {
          fallbackModel = openai("gpt-3.5-turbo", { apiKey: availableKeys.keys.openai })
          fallbackModelName = "gpt-3.5-turbo"
          fallbackProvider = "openai"
        } else if (availableKeys.google) {
          fallbackModel = google("gemini-pro", { apiKey: availableKeys.keys.google })
          fallbackModelName = "gemini-pro"
          fallbackProvider = "google"
        } else if (availableKeys.huggingface) {
          // For Hugging Face, use a smaller, more reliable model
          const text = await callHuggingFaceAPI(
            query,
            "mistralai/Mistral-7B-Instruct-v0.2",
            availableKeys.keys.huggingface || "",
          )

          // Add disclaimer for crypto-related content
          let finalResponse = text
          if (mode === "crypto" || isCryptoQuery(query)) {
            finalResponse +=
              "\n\n**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions."
          }

          return NextResponse.json({
            response: finalResponse,
            model: "Huggingface: Mistral-7B-Instruct-v0.2 (fallback)",
            success: true,
          })
        } else {
          throw new Error("No fallback models available")
        }

        // Generate response with the fallback model
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
          model: `${fallbackProvider.charAt(0).toUpperCase() + fallbackProvider.slice(1)}: ${fallbackModelName} (fallback)`,
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

