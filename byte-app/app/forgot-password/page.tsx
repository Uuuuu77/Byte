"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send a password reset email
      // For demo purposes, we'll just check if the user exists
      const users = JSON.parse(localStorage.getItem("byte_users") || "[]")
      const userExists = users.some((u: any) => u.email === email)

      if (!userExists) {
        throw new Error("No account found with this email address")
      }

      setSuccess(true)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error: any) {
      console.error("Password reset error:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md bg-primary-black/40 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-secondary-light">
            Reset Your <span className="text-primary-orange">BYTE</span> Password
          </CardTitle>
          <CardDescription className="text-center text-secondary-light/80">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="bg-green-900/20 border-green-900/50">
              <AlertDescription className="text-green-400">
                Password reset email sent! Check your inbox for further instructions.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary-light">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-secondary-light/80">
            <Link
              href="/login"
              className="inline-flex items-center text-primary-orange hover:text-primary-gold transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

