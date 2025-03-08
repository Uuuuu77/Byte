// Hugging Face API integration
export async function queryHuggingFace(query: string, model = "mistralai/Mistral-7B-Instruct-v0.2") {
  try {
    // Check if API key is available
    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) {
      throw new Error("HUGGINGFACE_API_KEY is not set")
    }

    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

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
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return (
      result[0]?.generated_text || "Sorry, I couldn't generate a response. Please try again or use a different model."
    )
  } catch (error) {
    console.error("Hugging Face API error:", error)
    if (error instanceof Error && error.name === "AbortError") {
      return "The request to Hugging Face timed out. Please try again with a simpler query or a different model."
    }
    throw error
  }
}

// Function to determine the best Hugging Face model for a query
export function getBestHuggingFaceModel(query: string): string {
  const queryLower = query.toLowerCase()

  // Financial/crypto queries
  if (
    queryLower.includes("crypto") ||
    queryLower.includes("bitcoin") ||
    queryLower.includes("finance") ||
    queryLower.includes("market")
  ) {
    return "EleutherAI/gpt-neox-20b" // Good for financial analysis
  }

  // Scientific queries
  if (
    queryLower.includes("science") ||
    queryLower.includes("physics") ||
    queryLower.includes("biology") ||
    queryLower.includes("chemistry")
  ) {
    return "facebook/bart-large-cnn" // Good for scientific explanations
  }

  // Code-related queries
  if (
    queryLower.includes("code") ||
    queryLower.includes("programming") ||
    queryLower.includes("javascript") ||
    queryLower.includes("python")
  ) {
    return "Salesforce/codegen-16B-mono" // Specialized for code
  }

  // Default to a general-purpose model
  return "mistralai/Mistral-7B-Instruct-v0.2"
}

