"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, History, BookOpen, Settings, TrendingUp, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserPreferences } from "@/utils/user-preferences"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && user) {
      // Load user data from preferences
      const loadUserData = async () => {
        try {
          // In a real app, this would fetch from an API
          // For now, we'll use the local storage preferences
          const prefs = getUserPreferences(user.id)

          setUserData({
            totalQueries: prefs.researchHistory?.length || 0,
            thisMonth:
              prefs.researchHistory?.filter((item) => {
                const date = new Date(item.createdAt)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              }).length || 0,
            lastMonth: 0, // In a real app, this would be calculated
            growthRate: 0, // In a real app, this would be calculated
            recentQueries: prefs.researchHistory?.slice(0, 5) || [],
            favoriteModels: calculateFavoriteModels(prefs.researchHistory || []),
            favoriteTopics: calculateFavoriteTopics(prefs.researchHistory || []),
          })

          setLoading(false)
        } catch (error) {
          console.error("Error loading user data:", error)
          setLoading(false)
        }
      }

      loadUserData()
    }
  }, [user, authLoading, router])

  // Helper function to calculate favorite models
  const calculateFavoriteModels = (history) => {
    const models = {}
    history.forEach((item) => {
      models[item.model] = (models[item.model] || 0) + 1
    })

    return Object.entries(models)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Helper function to calculate favorite topics
  const calculateFavoriteTopics = (history) => {
    const topics = {
      Crypto: 0,
      Technology: 0,
      Science: 0,
      Finance: 0,
      Other: 0,
    }

    const cryptoKeywords = ["bitcoin", "ethereum", "crypto", "blockchain", "token"]
    const techKeywords = ["code", "programming", "software", "tech", "computer"]
    const scienceKeywords = ["science", "physics", "biology", "chemistry", "research"]
    const financeKeywords = ["finance", "market", "stock", "investment", "economy"]

    history.forEach((item) => {
      const query = item.query.toLowerCase()

      if (cryptoKeywords.some((keyword) => query.includes(keyword))) {
        topics["Crypto"]++
      } else if (techKeywords.some((keyword) => query.includes(keyword))) {
        topics["Technology"]++
      } else if (scienceKeywords.some((keyword) => query.includes(keyword))) {
        topics["Science"]++
      } else if (financeKeywords.some((keyword) => query.includes(keyword))) {
        topics["Finance"]++
      } else {
        topics["Other"]++
      }
    })

    return Object.entries(topics)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }

  // If still loading auth state or dashboard data, show loading indicator
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

  // If no user data yet, show empty state
  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-light mb-4">No Research Data Yet</h2>
        <p className="text-secondary-light/80 mb-6">Start researching to see your dashboard stats</p>
        <Button className="bg-primary-orange hover:bg-primary-gold text-white" onClick={() => router.push("/")}>
          <BookOpen className="h-4 w-4 mr-2" />
          Start Researching
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-light">
            Welcome back, <span className="text-primary-orange">{user.name}</span>
          </h1>
          <p className="text-secondary-light/80">Here's an overview of your research activity</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-primary-orange hover:text-white"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-primary-orange hover:bg-primary-gold text-white" onClick={() => router.push("/")}>
            <BookOpen className="h-4 w-4 mr-2" />
            New Research
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-secondary-light">Total Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary-orange">{userData.totalQueries}</div>
              <p className="text-secondary-light/60 text-sm mt-1">All-time research queries</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-secondary-light">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary-orange">{userData.thisMonth}</div>
              {userData.growthRate > 0 ? (
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>{userData.growthRate}% increase from last month</span>
                </div>
              ) : (
                <p className="text-secondary-light/60 text-sm mt-1">No previous month data</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-secondary-light">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.favoriteTopics && userData.favoriteTopics.length > 0 ? (
                <>
                  <div className="text-4xl font-bold text-primary-orange">{userData.favoriteTopics[0].category}</div>
                  <p className="text-secondary-light/60 text-sm mt-1">
                    {userData.favoriteTopics[0].count} queries
                    {userData.totalQueries > 0 && (
                      <> ({Math.round((userData.favoriteTopics[0].count / userData.totalQueries) * 100)}% of total)</>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-secondary-light/60">No category data yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid grid-cols-2 bg-primary-black/60">
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
          >
            <History className="w-4 h-4 mr-2" />
            Recent Queries
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Usage Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-primary-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-secondary-light">Recent Research Queries</CardTitle>
              <CardDescription className="text-secondary-light/80">
                Your most recent research activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userData.recentQueries && userData.recentQueries.length > 0 ? (
                <div className="space-y-4">
                  {userData.recentQueries.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border border-gray-800 rounded-lg hover:border-primary-orange/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-secondary-light">{item.query}</h3>
                          <p className="text-xs text-secondary-light/60">Model: {item.model}</p>
                        </div>
                        <div className="text-xs text-secondary-light/60">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 hover:bg-primary-orange hover:text-white"
                          onClick={() => router.push(`/?query=${encodeURIComponent(item.query)}`)}
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          Research Again
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-secondary-light/60">
                  No research history yet. Start researching to see your history.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-primary-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-secondary-light">Model Usage</CardTitle>
                <CardDescription className="text-secondary-light/80">
                  Distribution of AI models used in your research
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.favoriteModels && userData.favoriteModels.length > 0 ? (
                  <div className="space-y-4">
                    {userData.favoriteModels.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-light">{item.model}</span>
                          <span className="text-sm text-secondary-light/80">{item.count} queries</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / userData.totalQueries) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-primary-orange"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary-light/60">
                    No model usage data yet. Start researching to see your stats.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-secondary-light">Category Distribution</CardTitle>
                <CardDescription className="text-secondary-light/80">
                  Types of research topics you've explored
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.favoriteTopics && userData.favoriteTopics.length > 0 ? (
                  <div className="space-y-4">
                    {userData.favoriteTopics.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-light">{item.category}</span>
                          <span className="text-sm text-secondary-light/80">{item.count} queries</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / userData.totalQueries) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-primary-gold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary-light/60">
                    No category data yet. Start researching to see your stats.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

