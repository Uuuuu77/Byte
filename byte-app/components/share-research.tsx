"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Mail, Copy, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareResearchProps {
  researchId: string
  title: string
}

export function ShareResearch({ researchId, title }: ShareResearchProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [shareMode, setShareMode] = useState<"private" | "team" | "public">("private")
  const { toast } = useToast()

  // Generate a share link (in a real app, this would be a unique URL)
  const shareLink = `https://byte-app.vercel.app/shared/${researchId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)

    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    })

    setTimeout(() => setCopied(false), 3000)
  }

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send an email invitation
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${email}`,
    })

    setEmail("")
  }

  return (
    <Card className="bg-primary-black/40 border-gray-800 w-full">
      <CardHeader>
        <CardTitle className="text-xl text-secondary-light flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary-orange" />
          Share Research
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary-black/60">
            <TabsTrigger
              value="link"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              Share Link
            </TabsTrigger>
            <TabsTrigger
              value="invite"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              Invite Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            <div>
              <Label className="text-sm font-medium text-secondary-light mb-1 block">Research Title</Label>
              <div className="text-secondary-light/80 text-sm bg-primary-black/20 p-2 rounded-md border border-gray-800">
                {title}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-secondary-light mb-1 block">Share Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={shareMode === "private" ? "default" : "outline"}
                  className={
                    shareMode === "private"
                      ? "bg-primary-orange hover:bg-primary-gold text-white"
                      : "border-gray-700 hover:bg-primary-orange/20"
                  }
                  onClick={() => setShareMode("private")}
                  size="sm"
                >
                  Private
                </Button>
                <Button
                  variant={shareMode === "team" ? "default" : "outline"}
                  className={
                    shareMode === "team"
                      ? "bg-primary-orange hover:bg-primary-gold text-white"
                      : "border-gray-700 hover:bg-primary-orange/20"
                  }
                  onClick={() => setShareMode("team")}
                  size="sm"
                >
                  Team Only
                </Button>
                <Button
                  variant={shareMode === "public" ? "default" : "outline"}
                  className={
                    shareMode === "public"
                      ? "bg-primary-orange hover:bg-primary-gold text-white"
                      : "border-gray-700 hover:bg-primary-orange/20"
                  }
                  onClick={() => setShareMode("public")}
                  size="sm"
                >
                  Public
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-secondary-light mb-1 block">Share Link</Label>
              <div className="flex">
                <Input
                  readOnly
                  value={shareLink}
                  className="flex-1 bg-primary-black/60 border-gray-800 text-secondary-light"
                />
                <Button className="ml-2 bg-primary-orange hover:bg-primary-gold text-white" onClick={handleCopyLink}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-secondary-light/60">
                {shareMode === "private" && "Only people with the link can view this research"}
                {shareMode === "team" && "Only team members can view this research"}
                {shareMode === "public" && "Anyone with the link can view this research"}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4 pt-4">
            <form onSubmit={handleEmailInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-secondary-light">
                  Team Member Email
                </Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-secondary-light/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-primary-black/60 border-gray-800 text-secondary-light"
                      required
                    />
                  </div>
                  <Button type="submit" className="ml-2 bg-primary-orange hover:bg-primary-gold text-white">
                    Invite
                  </Button>
                </div>
              </div>

              <div className="text-sm text-secondary-light/80 bg-primary-black/20 p-3 rounded-md border border-gray-800">
                <p className="font-medium mb-1">Team Members will be able to:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>View this research</li>
                  <li>Export the results</li>
                  <li>Add comments (coming soon)</li>
                  <li>Collaborate on follow-up research (coming soon)</li>
                </ul>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4 justify-between">
        <Button variant="outline" size="sm" className="border-gray-700 hover:bg-primary-orange hover:text-white">
          Cancel
        </Button>
        <Button size="sm" className="bg-primary-orange hover:bg-primary-gold text-white">
          {shareMode === "private" ? "Create Private Link" : shareMode === "team" ? "Share with Team" : "Make Public"}
        </Button>
      </CardFooter>
    </Card>
  )
}

