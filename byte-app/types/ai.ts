// Types related to AI functionality

export type ResearchMode = "auto" | "crypto" | "general" | "scientific" | "code" | "news"

export type AIModel =
  | "auto"
  | "groq-llama-3-3"
  | "groq-llama-3-2"
  | "groq-llama-3-1"
  | "groq-llama-guard"
  | "groq-deepseek-r1"
  | "groq-mixtral-8x7b"
  | "google-gemini-pro"
  | "google-gemma-2"
  | "openai-gpt4"
  | "openai-gpt4-turbo"
  | "hf-auto"
  | "hf-mistralai/Mistral-7B-Instruct-v0.2"
  | "hf-EleutherAI/gpt-neox-20b"
  | "hf-facebook/bart-large-cnn"
  | "hf-Salesforce/codegen-16B-mono"

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

