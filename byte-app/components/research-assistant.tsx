"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Send, Settings, Copy, Trash2, RefreshCw, ChevronDown, Bot, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Terminal } from "@/components/ui/terminal"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { ResearchMode, AIModel } from "@/types/ai"
import { addToResearchHistory } from "@/utils/user-preferences"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  model?: string
  timestamp: Date
  loading?: boolean
  error?: string
}

interface ApiKeySettings {
  groq: string
  google: string
  openai: string
  huggingface: string
}

export function ResearchAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<ResearchMode>("auto")
  const [model, setModel] = useState<AIModel>("auto")
  const [apiKeys, setApiKeys] = useState<ApiKeySettings>({
    groq: process.env.GROQ_API_KEY || "",
    google: process.env.GOOGLE_AI_API_KEY || "",
    openai: process.env.OPENAI_API_KEY || "",
    huggingface: process.env.HUGGINGFACE_API_KEY || "",
  })
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Check for query parameter to pre-fill the input
  useEffect(() => {
    const queryParam = searchParams.get("query")
    if (queryParam) {
      setInput(queryParam)
    }
  }, [searchParams])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, autoScroll])

  // Check auth status
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Check available models on mount
  useEffect(() => {
    checkAvailableModels()
  }, [apiKeys])

  // If still loading auth state, show loading indicator
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
      </div>
    )
  }

  // If not authenticated, don't render the component (will redirect in useEffect)
  if (!user) {
    return null
  }

  const checkAvailableModels = async () => {
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.apiStatus.availableProviders || [])
      }
    } catch (error) {
      console.error("Error checking available models:", error)
    }
  }

  const isModelAvailable = (modelName: string): boolean => {
    if (modelName === "auto") return true

    if (modelName.startsWith("groq-")) {
      return availableModels.includes("groq") || apiKeys.groq !== ""
    } else if (modelName.startsWith("google-")) {
      return availableModels.includes("google") || apiKeys.google !== ""
    } else if (modelName.startsWith("openai-")) {
      return availableModels.includes("openai") || apiKeys.openai !== ""
    } else if (modelName.startsWith("hf-")) {
      return availableModels.includes("huggingface") || apiKeys.huggingface !== ""
    }

    return false
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading) return

    // Generate a unique ID for this message pair
    const messageId = Date.now().toString()

    // Add user message
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Add assistant message (loading state)
    const assistantMessage: Message = {
      id: messageId + "-response",
      role: "assistant",
      content: "",
      loading: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setLoading(true)

    // Focus the input after submitting
    if (inputRef.current) {
      inputRef.current.focus()
    }

    try {
      // Prepare API keys to send with the request
      const apiKeysToSend = {
        GROQ_API_KEY: apiKeys.groq || undefined,
        GOOGLE_AI_API_KEY: apiKeys.google || undefined,
        OPENAI_API_KEY: apiKeys.openai || undefined,
        HUGGINGFACE_API_KEY: apiKeys.huggingface || undefined,
      }

      // Call the API with the selected model and mode
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          mode,
          model,
          apiKeys: apiKeysToSend,
        }),
        // Set a timeout to prevent long-running requests
        signal: AbortSignal.timeout(60000), // 60 second timeout
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error ||
            `API request failed with status ${response.status}. Please try again or select a different model.`,
        )
      }

      const data = await response.json()

      if (data.success) {
        // Update the assistant message with the response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: data.response,
                  model: data.model,
                  loading: false,
                }
              : msg,
          ),
        )

        // Save to research history
        if (user) {
          addToResearchHistory(user.id, input, mode, model, data.response)
        }
      } else {
        throw new Error(data.error || "Failed to get AI response")
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get AI response. Please try again or use a different model."

      // Update the assistant message with the error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "I encountered an error while processing your request.",
                error: errorMessage,
                loading: false,
              }
            : msg,
        ),
      )

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const handleRetry = (messageId: string) => {
    // Find the user message that corresponds to this assistant message
    const assistantMessage = messages.find((m) => m.id === messageId)
    if (!assistantMessage) return

    const userMessageIndex = messages.findIndex((m) => m.id === messageId.replace("-response", ""))
    if (userMessageIndex === -1) return

    const userMessage = messages[userMessageIndex]

    // Set the input to the user message content
    setInput(userMessage.content)

    // Remove the user message and assistant message from the messages array
    setMessages((prev) => prev.filter((m) => m.id !== messageId && m.id !== userMessage.id))
  }

  const handleClearChat = () => {
    setMessages([])
    setInput("")
  }

  const renderMessageContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("```")) {
        const codeBlockParts = paragraph.split("\n")
        const language = codeBlockParts[0].replace("```", "").trim() || "text"
        const code = codeBlockParts.slice(1, -1).join("\n")

        return (
          <div key={index} className="my-4">
            <Terminal language={language} code={code} />
          </div>
        )
      }

      // Handle headers
      if (paragraph.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
            {paragraph.replace("# ", "")}
          </h1>
        )
      }
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-bold mt-5 mb-3">
            {paragraph.replace("## ", "")}
          </h2>
        )
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-bold mt-4 mb-2">
            {paragraph.replace("### ", "")}
          </h3>
        )
      }

      // Handle lists
      if (paragraph.includes("\n- ")) {
        const listItems = paragraph.split("\n- ")
        const title = listItems.shift()

        return (
          <div key={index} className="my-4">
            {title && <p className="mb-2">{title}</p>}
            <ul className="list-disc pl-6 space-y-1">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )
      }

      // Handle numbered lists
      if (paragraph.match(/\n\d+\. /)) {
        const listItems = paragraph.split(/\n\d+\. /)
        const title = listItems.shift()

        return (
          <div key={index} className="my-4">
            {title && <p className="mb-2">{title}</p>}
            <ol className="list-decimal pl-6 space-y-1">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        )
      }

      // Handle bold and italic text
      let formattedText = paragraph
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>")

      return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: formattedText }} />
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="text-primary-orange">BYTE</span> <span className="text-white">Research</span>
        </h1>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-700">
                {mode === "auto"
                  ? "Auto-detect"
                  : mode === "crypto"
                    ? "Crypto Expert"
                    : mode === "scientific"
                      ? "Scientific Analysis"
                      : mode === "code"
                        ? "Code & Technology"
                        : mode === "news"
                          ? "News Analysis"
                          : "General Research"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary-black border-gray-800">
              <DropdownMenuItem onClick={() => setMode("auto")}>Auto-detect</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("crypto")}>Crypto Expert</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("general")}>General Research</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("scientific")}>Scientific Analysis</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("code")}>Code & Technology</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("news")}>News Analysis</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-700">
                {model === "auto"
                  ? "Auto-select Model"
                  : model.startsWith("groq-")
                    ? `Groq: ${model.replace("groq-", "")}`
                    : model.startsWith("google-")
                      ? `Google: ${model.replace("google-", "")}`
                      : model.startsWith("openai-")
                        ? `OpenAI: ${model.replace("openai-", "")}`
                        : model.startsWith("hf-")
                          ? `HuggingFace: ${model.replace("hf-", "")}`
                          : model}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary-black border-gray-800">
              <DropdownMenuItem onClick={() => setModel("auto")}>Auto-select Model</DropdownMenuItem>

              <div className="px-2 py-1 text-xs text-secondary-light/60">Groq Models</div>
              <DropdownMenuItem
                onClick={() => setModel("groq-deepseek-r1")}
                disabled={!isModelAvailable("groq-deepseek-r1")}
                className={!isModelAvailable("groq-deepseek-r1") ? "opacity-50" : ""}
              >
                Deepseek R1 (Recommended)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setModel("groq-mixtral-8x7b")}
                disabled={!isModelAvailable("groq-mixtral-8x7b")}
                className={!isModelAvailable("groq-mixtral-8x7b") ? "opacity-50" : ""}
              >
                Mixtral 8x7b
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setModel("groq-llama-3-3")}
                disabled={!isModelAvailable("groq-llama-3-3")}
                className={!isModelAvailable("groq-llama-3-3") ? "opacity-50" : ""}
              >
                Llama 3.3
              </DropdownMenuItem>

              <div className="px-2 py-1 text-xs text-secondary-light/60">Google Models</div>
              <DropdownMenuItem
                onClick={() => setModel("google-gemini-pro")}
                disabled={!isModelAvailable("google-gemini-pro")}
                className={!isModelAvailable("google-gemini-pro") ? "opacity-50" : ""}
              >
                Gemini Pro
              </DropdownMenuItem>

              <div className="px-2 py-1 text-xs text-secondary-light/60">OpenAI Models</div>
              <DropdownMenuItem
                onClick={() => setModel("openai-gpt4")}
                disabled={!isModelAvailable("openai-gpt4")}
                className={!isModelAvailable("openai-gpt4") ? "opacity-50" : ""}
              >
                GPT-4
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setModel("openai-gpt4-turbo")}
                disabled={!isModelAvailable("openai-gpt4-turbo")}
                className={!isModelAvailable("openai-gpt4-turbo") ? "opacity-50" : ""}
              >
                GPT-4 Turbo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary-black border-gray-800 text-secondary-light">
              <SheetHeader>
                <SheetTitle className="text-secondary-light">Settings</SheetTitle>
                <SheetDescription className="text-secondary-light/60">
                  Configure your research experience
                </SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <Tabs defaultValue="api-keys">
                  <TabsList className="grid w-full grid-cols-2 bg-primary-black/60">
                    <TabsTrigger
                      value="api-keys"
                      className="data-[state=active]:bg-primary-orange data-[state=active]:text-white"
                    >
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferences"
                      className="data-[state=active]:bg-primary-orange data-[state=active]:text-white"
                    >
                      Preferences
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="api-keys" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="groq-api-key">Groq API Key</Label>
                      <Textarea
                        id="groq-api-key"
                        placeholder="Enter your Groq API key"
                        value={apiKeys.groq}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, groq: e.target.value }))}
                        className="bg-primary-black/60 border-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="google-api-key">Google AI API Key</Label>
                      <Textarea
                        id="google-api-key"
                        placeholder="Enter your Google AI API key"
                        value={apiKeys.google}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, google: e.target.value }))}
                        className="bg-primary-black/60 border-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                      <Textarea
                        id="openai-api-key"
                        placeholder="Enter your OpenAI API key"
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, openai: e.target.value }))}
                        className="bg-primary-black/60 border-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="huggingface-api-key">Hugging Face API Key</Label>
                      <Textarea
                        id="huggingface-api-key"
                        placeholder="Enter your Hugging Face API key"
                        value={apiKeys.huggingface}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, huggingface: e.target.value }))}
                        className="bg-primary-black/60 border-gray-800"
                      />
                    </div>

                    <Button
                      className="w-full bg-primary-orange hover:bg-primary-gold text-white"
                      onClick={() => {
                        checkAvailableModels()
                        toast({
                          title: "API Keys Saved",
                          description: "Your API keys have been saved for this session",
                        })
                      }}
                    >
                      Save API Keys
                    </Button>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-scroll to bottom</Label>
                        <p className="text-sm text-secondary-light/60">Automatically scroll to the latest message</p>
                      </div>
                      <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                    </div>

                    <div className="pt-4">
                      <Button variant="destructive" className="w-full" onClick={handleClearChat}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Chat History
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 rounded-lg border border-gray-800 bg-primary-black/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-secondary-light/60 p-4">
            <Bot className="h-12 w-12 mb-4 text-primary-orange" />
            <h3 className="text-xl font-semibold mb-2 text-secondary-light">Welcome to BYTE Research</h3>
            <p className="text-center max-w-md mb-6">
              Ask any question to get started. BYTE can help with cryptocurrency analysis, scientific research, coding
              problems, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-primary-orange hover:text-white justify-start"
                onClick={() => setInput("Explain Ethereum's roadmap post-merge")}
              >
                Explain Ethereum's roadmap post-merge
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-primary-orange hover:text-white justify-start"
                onClick={() => setInput("Compare React, Vue, and Angular frameworks")}
              >
                Compare React, Vue, and Angular
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-primary-orange hover:text-white justify-start"
                onClick={() => setInput("Explain CRISPR gene editing technology")}
              >
                Explain CRISPR gene editing
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-primary-orange hover:text-white justify-start"
                onClick={() => setInput("Analyze recent cryptocurrency market movements")}
              >
                Analyze crypto market movements
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {messages.map((message, index) => (
              <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-primary-orange/20 border border-primary-orange/30"
                      : "bg-gray-800/40 border border-gray-700",
                  )}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center mr-2",
                        message.role === "user" ? "bg-primary-orange/30" : "bg-gray-700",
                      )}
                    >
                      {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 text-sm font-medium">{message.role === "user" ? "You" : "BYTE"}</div>
                    <div className="text-xs text-secondary-light/60">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {message.loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary-orange" />
                        <span>Thinking...</span>
                      </div>
                    ) : message.error ? (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{message.error}</AlertDescription>
                      </Alert>
                    ) : (
                      renderMessageContent(message.content)
                    )}

                    {message.model && !message.loading && (
                      <div className="mt-4 pt-2 border-t border-gray-700 flex justify-between items-center">
                        <div className="text-xs text-secondary-light/60">Model: {message.model}</div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {message.role === "assistant" &&
                            (
                              <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-
                              size=\"icon" 
                              className="h-6 w-6"
                              onClick={() => handleRetry(message.id)}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            )}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" &&
                      !message.loading &&
                      (message.content.toLowerCase().includes("crypto") ||
                        message.content.toLowerCase().includes("bitcoin") ||
                        message.content.toLowerCase().includes("blockchain")) && (
                        <div className="mt-4">
                          <DisclaimerBanner />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="pr-10 py-6 bg-primary-black/60 border-gray-800 text-secondary-light rounded-lg"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-primary-orange hover:bg-primary-gold"
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="text-xs text-secondary-light/60 mt-2 text-center">
          BYTE provides research assistance but may not always be accurate. Verify important information.
        </p>
      </div>
    </div>
  )
}

