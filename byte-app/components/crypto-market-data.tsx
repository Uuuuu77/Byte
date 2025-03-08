"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getTopCryptos, searchCryptos } from "@/utils/crypto-api"
import { usePreferences } from "@/contexts/preferences-context"
import { Loader2, Search, Star, RefreshCw } from "lucide-react"
import { CryptoPriceChart } from "@/components/visualizations/crypto-price-chart"

export function CryptoMarketData() {
  const [cryptos, setCryptos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const { preferences, addToFavorites, removeFromFavorites } = usePreferences()

  useEffect(() => {
    fetchCryptoData()
    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(fetchCryptoData, 2 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchCryptoData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTopCryptos(10, 1, false, "24h,7d")
      setCryptos(data)

      // Select the first coin by default if none is selected
      if (!selectedCoin && data.length > 0) {
        setSelectedCoin(data[0].id)
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error)
      setError("Failed to load cryptocurrency data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    setLoading(true)
    setError(null)

    try {
      const results = await searchCryptos(searchQuery)
      if (results.coins.length === 0) {
        setError("No cryptocurrencies found matching your search")
        setCryptos([])
      } else {
        // Format search results to match our expected structure
        const formattedResults = results.coins.slice(0, 10).map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.large || coin.thumb,
          current_price: 0, // Will be filled in later
          price_change_percentage_24h: 0,
          market_cap: 0,
          market_cap_rank: coin.market_cap_rank || 9999,
        }))

        setCryptos(formattedResults)

        // If we got results, select the first one
        if (formattedResults.length > 0) {
          setSelectedCoin(formattedResults[0].id)
        }
      }
    } catch (error) {
      console.error("Error searching cryptos:", error)
      setError("Failed to search cryptocurrencies")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value)
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`
    } else {
      return formatCurrency(value)
    }
  }

  const isFavorite = (coinId: string) => {
    return preferences.cryptoFavorites.includes(coinId)
  }

  const toggleFavorite = (coinId: string) => {
    if (isFavorite(coinId)) {
      removeFromFavorites(coinId)
    } else {
      addToFavorites(coinId)
    }
  }

  const selectedCoinData = cryptos.find((crypto) => crypto.id === selectedCoin)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-primary-black/40 border-gray-800 md:col-span-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-secondary-light">Top Cryptocurrencies</CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8 border-gray-700" onClick={fetchCryptoData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-primary-black/60 border-gray-800 text-secondary-light"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7 bg-primary-orange hover:bg-primary-gold"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : cryptos.length === 0 ? (
            <div className="text-secondary-light/60 text-center py-4">No cryptocurrencies found</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {cryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  onClick={() => setSelectedCoin(crypto.id)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                    selectedCoin === crypto.id
                      ? "bg-primary-orange/20 border border-primary-orange/50"
                      : "hover:bg-primary-black/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium text-secondary-light">{crypto.name}</div>
                      <div className="text-xs text-secondary-light/60">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-secondary-light">
                        {crypto.current_price ? formatCurrency(crypto.current_price) : "N/A"}
                      </div>
                      <div
                        className={`text-xs ${
                          crypto.price_change_percentage_24h > 0
                            ? "text-green-500"
                            : crypto.price_change_percentage_24h < 0
                              ? "text-red-500"
                              : "text-secondary-light/60"
                        }`}
                      >
                        {crypto.price_change_percentage_24h
                          ? `${crypto.price_change_percentage_24h > 0 ? "+" : ""}${crypto.price_change_percentage_24h.toFixed(2)}%`
                          : "N/A"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(crypto.id)
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isFavorite(crypto.id) ? "fill-yellow-500 text-yellow-500" : "text-secondary-light/60"
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary-black/40 border-gray-800 md:col-span-2">
        {selectedCoin && selectedCoinData ? (
          <CryptoPriceChart coinId={selectedCoin} coinName={selectedCoinData.name} />
        ) : loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-secondary-light/60">
            Select a cryptocurrency to view its price chart
          </div>
        )}
      </Card>
    </div>
  )
}

