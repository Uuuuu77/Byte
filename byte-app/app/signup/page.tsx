"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { signup } = useAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await signup(name, email, password)

      toast({
        title: "Account Created",
        description: "Welcome to BYTE! Your account has been created successfully.",
      })

      router.push("/")
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message)

      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md bg-primary-black/40 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-secondary-light">
            Create a <span className="text-primary-orange">BYTE</span> Account
          </CardTitle>
          <CardDescription className="text-center text-secondary-light/80">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-secondary-light">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                />
              </div>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-secondary-light">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-2.5 text-secondary-light/50 hover:text-secondary-light"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-secondary-light">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-3 top-2.5 text-secondary-light/50 hover:text-secondary-light"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-secondary-light/80">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-orange hover:text-primary-gold transition-colors">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

