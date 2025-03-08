"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, User, Mail, Lock, Bell, Shield, Key, Save, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [researchHistory, setResearchHistory] = useState(true)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [error, setError] = useState("")

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Populate form with user data
      setName(user.name || "")
      setEmail(user.email || "")

      // Simulate loading settings data
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [user, authLoading, router])

  // If still loading auth state, show loading indicator
  if (authLoading || loading) {
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      setError("Failed to update profile. Please try again.")

      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaveLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      setSaveLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      setError("Failed to change password. Please try again.")

      toast({
        title: "Update Failed",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-light">Account Settings</h1>
        <p className="text-secondary-light/80">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 bg-primary-black/60">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
          >
            <Bell className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-secondary-light">Profile Information</CardTitle>
              <CardDescription className="text-secondary-light/80">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-secondary-light">Change Password</CardTitle>
              <CardDescription className="text-secondary-light/80">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-secondary-light">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-secondary-light/50 hover:text-secondary-light"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-secondary-light">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-secondary-light/50" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-secondary-light/50 hover:text-secondary-light"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-secondary-light">
                    Confirm New Password
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-secondary-light/50 hover:text-secondary-light"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-secondary-light">API Keys</CardTitle>
              <CardDescription className="text-secondary-light/80">
                Manage your API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-secondary-light">Your API Key</Label>
                <div className="relative">
                  <Input
                    type={apiKeyVisible ? "text" : "password"}
                    value="sk_byte_12345678abcdefghijklmnopqrstuvwxyz"
                    readOnly
                    className="pr-24 bg-primary-black/60 border-gray-800 text-secondary-light"
                  />
                  <div className="absolute right-2 top-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                      className="h-6 px-2 text-xs border-gray-700"
                    >
                      {apiKeyVisible ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" className="border-gray-700 hover:bg-primary-orange hover:text-white">
                  Regenerate Key
                </Button>
                <Button variant="outline" className="border-gray-700 hover:bg-primary-orange hover:text-white">
                  Copy Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-secondary-light">Notification Settings</CardTitle>
              <CardDescription className="text-secondary-light/80">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-secondary-light">Email Notifications</Label>
                  <p className="text-sm text-secondary-light/60">
                    Receive email updates about your account and research
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-secondary-light">Research History</Label>
                  <p className="text-sm text-secondary-light/60">
                    Save your research queries and results for future reference
                  </p>
                </div>
                <Switch checked={researchHistory} onCheckedChange={setResearchHistory} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
                onClick={() => {
                  toast({
                    title: "Preferences Saved",
                    description: "Your notification preferences have been updated.",
                  })
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

