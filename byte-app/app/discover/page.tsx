"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Newspaper, TrendingUp, Bitcoin, Code, Microscope } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Mock news data (in a real app, this would come from an API)
const mockNews = {
  crypto: [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High",
      description: "Bitcoin has surpassed its previous all-time high, reaching $80,000 for the first time in history.",
      category: "Cryptocurrency",
      date: "2025-03-01",
      source: "CryptoNews",
      url: "#",
    },
    {
      id: 2,
      title: "Ethereum Completes Major Network Upgrade",
      description:
        "Ethereum has successfully implemented its latest upgrade, improving scalability and reducing gas fees.",
      category: "Cryptocurrency",
      date: "2025-02-28",
      source: "BlockchainInsider",
      url: "#",
    },
    {
      id: 3,
      title: "New Regulatory Framework for Cryptocurrencies Announced",
      description:
        "Global regulators have announced a new framework for cryptocurrency oversight, bringing clarity to the industry.",
      category: "Regulation",
      date: "2025-02-25",
      source: "FinancialTimes",
      url: "#",
    },
  ],
  tech: [
    {
      id: 4,
      title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
      description:
        "Researchers have developed a new AI model that demonstrates human-level reasoning capabilities across multiple domains.",
      category: "Artificial Intelligence",
      date: "2025-03-02",
      source: "TechDaily",
      url: "#",
    },
    {
      id: 5,
      title: "Quantum Computing Reaches Major Milestone",
      description:
        "Scientists have achieved quantum supremacy in a new experiment, solving problems impossible for classical computers.",
      category: "Quantum Computing",
      date: "2025-02-27",
      source: "ScienceMag",
      url: "#",
    },
    {
      id: 6,
      title: "New Programming Language Gains Popularity Among Developers",
      description:
        "A new programming language designed for AI applications is rapidly gaining adoption in the developer community.",
      category: "Programming",
      date: "2025-02-24",
      source: "DevWeekly",
      url: "#",
    },
  ],
  finance: [
    {
      id: 7,
      title: "Central Banks Explore Digital Currencies",
      description:
        "Major central banks are accelerating their research and development of central bank digital currencies (CBDCs).",
      category: "Finance",
      date: "2025-03-03",
      source: "EconomicReview",
      url: "#",
    },
    {
      id: 8,
      title: "Stock Market Reaches Record Highs",
      description:
        "Global stock markets have reached new record highs, driven by strong economic data and corporate earnings.",
      category: "Markets",
      date: "2025-02-26",
      source: "MarketWatch",
      url: "#",
    },
    {
      id: 9,
      title: "New Investment Platform Targets Retail Investors",
      description:
        "A new investment platform has launched, offering advanced tools previously only available to institutional investors.",
      category: "Investing",
      date: "2025-02-23",
      source: "InvestorDaily",
      url: "#",
    },
  ],
  science: [
    {
      id: 10,
      title: "Breakthrough in Renewable Energy Storage",
      description:
        "Scientists have developed a new battery technology that could revolutionize renewable energy storage.",
      category: "Energy",
      date: "2025-03-04",
      source: "ScienceToday",
      url: "#",
    },
    {
      id: 11,
      title: "New Cancer Treatment Shows Promising Results",
      description: "A novel cancer treatment approach has shown remarkable results in early clinical trials.",
      category: "Medicine",
      date: "2025-02-22",
      source: "MedicalJournal",
      url: "#",
    },
    {
      id: 12,
      title: "Space Exploration Mission Discovers Potential Signs of Life",
      description: "A recent space mission has discovered potential biosignatures on a distant planetary body.",
      category: "Astronomy",
      date: "2025-02-20",
      source: "SpaceExplorer",
      url: "#",
    },
  ],
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("trending")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    // Simulate loading news data
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, authLoading, router])

  // If still loading auth state, show loading indicator
  if (authLoading || initialLoading) {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)

    // Simulate search delay
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Search Results",
        description: `Found results for "${searchQuery}"`,
      })
    }, 1000)
  }

  // Filter news based on search query
  const filterNews = (news: typeof mockNews) => {
    if (!searchQuery.trim()) return news

    const query = searchQuery.toLowerCase()
    const filtered: typeof mockNews = {
      crypto: [],
      tech: [],
      finance: [],
      science: [],
    }

    Object.entries(news).forEach(([category, items]) => {
      filtered[category as keyof typeof mockNews] = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
    })

    return filtered
  }

  const filteredNews = filterNews(mockNews)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary-orange">Discover</span> <span className="text-white">Research Topics</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary-light/80 max-w-2xl mx-auto">
          Stay updated with the latest news and research in technology, finance, and science
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for topics, news, or research..."
              className="h-12 bg-primary-black/60 border-gray-800 text-secondary-light placeholder-secondary-light/50 pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 bg-primary-orange hover:bg-primary-gold"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </div>

      <Tabs defaultValue="trending" onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex min-w-max bg-primary-black/60">
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              <Bitcoin className="w-4 h-4 mr-2" />
              Crypto
            </TabsTrigger>
            <TabsTrigger
              value="tech"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              <Code className="w-4 h-4 mr-2" />
              Technology
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Finance
            </TabsTrigger>
            <TabsTrigger
              value="science"
              className="data-[state=active]:bg-primary-orange data-[state=active]:text-white transition-all duration-300"
            >
              <Microscope className="w-4 h-4 mr-2" />
              Science
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(filteredNews)
              .flat()
              .slice(0, 6)
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.crypto.length > 0 ? (
              filteredNews.crypto.map((item) => <NewsCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full text-center py-8 text-secondary-light/60">
                No cryptocurrency news found matching your search.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tech" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.tech.length > 0 ? (
              filteredNews.tech.map((item) => <NewsCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full text-center py-8 text-secondary-light/60">
                No technology news found matching your search.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.finance.length > 0 ? (
              filteredNews.finance.map((item) => <NewsCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full text-center py-8 text-secondary-light/60">
                No finance news found matching your search.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="science" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.science.length > 0 ? (
              filteredNews.science.map((item) => <NewsCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full text-center py-8 text-secondary-light/60">
                No science news found matching your search.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NewsItem {
  id: number
  title: string
  description: string
  category: string
  date: string
  source: string
  url: string
}

function NewsCard({ item }: { item: NewsItem }) {
  const { title, description, category, date, source } = item
  const router = useRouter()

  const handleReadMore = () => {
    // In a real app, this would navigate to the news article
    // For now, let's redirect to the research page with a pre-filled query
    router.push(`/?query=${encodeURIComponent(title)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-primary-black/40 border-gray-800 hover:border-primary-orange/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="bg-primary-orange/20 text-primary-orange text-xs px-2 py-1 rounded">{category}</div>
            <div className="text-xs text-secondary-light/60">{date}</div>
          </div>
          <CardTitle className="text-xl mt-2 text-secondary-light">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-secondary-light/80">{description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-secondary-light/60">Source: {source}</div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 hover:bg-primary-orange hover:text-white"
            onClick={handleReadMore}
          >
            <Newspaper className="h-4 w-4 mr-2" />
            Research This
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

