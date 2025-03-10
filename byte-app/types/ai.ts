// Types related to AI functionality

export type ResearchMode = "auto" | "crypto" | "general" | "scientific" | "code" | "news"

export type AIModel =
  | "auto"
  // Groq models
  | "groq-llama-3-70b"
  | "groq-llama-3-8b"
  | "groq-llama-3-1-8b"
  | "groq-llama-guard"
  | "groq-deepseek-r1"
  | "groq-mixtral-8x7b"
  | "groq-gemma-7b"
  | "groq-falcon-180b"
  | "groq-mixtral-moe"
  | "groq-codellama-70b"
  // Google models
  | "google-gemini-pro"
  | "google-gemini-pro-vision"
  | "google-gemini-ultra"
  | "google-gemma-2-9b"
  | "google-gemma-2-27b"
  | "google-palm-2"
  // OpenAI models
  | "openai-gpt4"
  | "openai-gpt4-turbo"
  | "openai-gpt4o"
  | "openai-gpt3.5-turbo"
  | "openai-davinci"
  | "openai-claude-3-opus"
  | "openai-claude-3-sonnet"
  | "openai-claude-3-haiku"
  // Hugging Face models
  | "hf-mistralai/Mistral-7B-Instruct-v0.2"
  | "hf-meta-llama/Llama-2-70b-chat-hf"
  | "hf-bigcode/starcoder2-15b"
  | "hf-google/flan-t5-xxl"
  | "hf-stabilityai/stablelm-tuned-alpha-7b"
  | string // Allow for custom model strings

export interface ResearchResponse {
  response: string
  model: string
  success: boolean
  error?: string
  query: string
  mode: ResearchMode
  timestamp: string
}

export type ExportFormat = "pdf" | "markdown"

export interface AISettings {
  model: AIModel
  mode: ResearchMode
}

