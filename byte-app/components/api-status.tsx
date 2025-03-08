"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiStatus {
  groq: boolean
  google: boolean
  openai: boolean
  huggingface: boolean
  availableProviders: string[]
  timestamp: string
}

export function ApiStatus() {
  const [status, setStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const checkApiStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health")

      if (!response.ok) {
        throw new Error(`API health check failed with status ${response.status}`)
      }

      const data = await response.json()
      setStatus(data.apiStatus)
    } catch (error) {
      console.error("API status check error:", error)
      setError(error instanceof Error ? error.message : "Failed to check API status")
    } finally {
      setLoading(false)
    }
  }, [])

  // Test a specific provider
  const testProvider = async (provider: string) => {
    try {
      const response = await fetch(`/api/test-provider?provider=${provider}`)

      if (!response.ok) {
        throw new Error(`Provider test failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error(`Error testing ${provider}:`, error)
      return false
    }
  }

  useEffect(() => {
    checkApiStatus()

    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(checkApiStatus, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [checkApiStatus, retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading && !status) {
    return (
      <Card className="bg-primary-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-secondary-light">Checking API Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-primary-black/40 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-secondary-light">AI API Status</CardTitle>
        <CardDescription className="text-secondary-light/80">Available AI providers and models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-orange" />
              ) : status?.groq ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-secondary-light">Groq</p>
              <p className="text-xs text-secondary-light/60">
                {loading ? "Checking..." : status?.groq ? "Available" : "Not Available"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                const result = await testProvider("groq")
                if (result) {
                  setStatus((prev) => (prev ? { ...prev, groq: true } : null))
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-orange" />
              ) : status?.google ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-secondary-light">Google AI</p>
              <p className="text-xs text-secondary-light/60">
                {loading ? "Checking..." : status?.google ? "Available" : "Not Available"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                const result = await testProvider("google")
                if (result) {
                  setStatus((prev) => (prev ? { ...prev, google: true } : null))
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-orange" />
              ) : status?.openai ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-secondary-light">OpenAI</p>
              <p className="text-xs text-secondary-light/60">
                {loading ? "Checking..." : status?.openai ? "Available" : "Not Available"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                const result = await testProvider("openai")
                if (result) {
                  setStatus((prev) => (prev ? { ...prev, openai: true } : null))
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-orange" />
              ) : status?.huggingface ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-secondary-light">Hugging Face</p>
              <p className="text-xs text-secondary-light/60">
                {loading ? "Checking..." : status?.huggingface ? "Available" : "Not Available"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                const result = await testProvider("huggingface")
                if (result) {
                  setStatus((prev) => (prev ? { ...prev, huggingface: true } : null))
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-sm font-medium text-secondary-light mb-2">Working Models:</h3>
          <div className="flex flex-wrap gap-2">
            <div className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Groq: Deepseek R1
            </div>
            <div className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Groq: Mixtral 8x7b
            </div>
            <div className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Other models (limited reliability)
            </div>
          </div>
        </div>

        <div className="text-xs text-secondary-light/60 pt-2">
          Last checked: {status?.timestamp ? new Date(status.timestamp).toLocaleString() : "Unknown"}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleRetry}
          className="w-full bg-primary-orange hover:bg-primary-gold text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

