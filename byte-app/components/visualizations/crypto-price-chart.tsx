"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getCoinMarketChart } from "@/utils/crypto-api"
import { Loader2 } from "lucide-react"

interface CryptoPriceChartProps {
  coinId: string
  coinName: string
  color?: string
}

export function CryptoPriceChart({ coinId, coinName, color = "#ff6a00" }: CryptoPriceChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"7" | "30" | "90" | "365">("7")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      setLoading(true)
      setError(null)

      try {
        const days = Number.parseInt(timeframe)
        const data = await getCoinMarketChart(coinId, days)

        if (!data) {
          throw new Error("Failed to fetch chart data")
        }

        // Format data for the chart
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price,
          time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp,
        }))

        setChartData(formattedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        setError("Could not load price data")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [coinId, timeframe])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value)
  }

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 }

    const firstPrice = chartData[0].price
    const lastPrice = chartData[chartData.length - 1].price
    const change = lastPrice - firstPrice
    const percentage = (change / firstPrice) * 100

    return { change, percentage }
  }

  const { change, percentage } = calculatePriceChange()

  return (
    <Card className="bg-primary-black/40 border-gray-800 w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-secondary-light">{coinName} Price</CardTitle>
            <CardDescription className="text-secondary-light/80">
              {loading ? "Loading..." : `Last ${timeframe} days price history`}
            </CardDescription>
          </div>
          {!loading && (
            <div className={`text-sm font-medium ${percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentage >= 0 ? "▲" : "▼"} {percentage.toFixed(2)}%
              <span className="block text-xs">{formatCurrency(Math.abs(change))}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList className="grid grid-cols-4 mb-4 bg-primary-black/60">
            <TabsTrigger value="7" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white">
              1W
            </TabsTrigger>
            <TabsTrigger value="30" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white">
              1M
            </TabsTrigger>
            <TabsTrigger value="90" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white">
              3M
            </TabsTrigger>
            <TabsTrigger value="365" className="data-[state=active]:bg-primary-orange data-[state=active]:text-white">
              1Y
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="mt-0">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
              </div>
            ) : error ? (
              <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      fontSize={12}
                      tickMargin={10}
                      tickFormatter={(value) => {
                        // Handle different timeframes differently
                        if (timeframe === "7") {
                          return value.split("/")[1] // Just the day
                        }
                        return value
                      }}
                    />
                    <YAxis stroke="#888" fontSize={12} tickFormatter={formatCurrency} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#222", border: "1px solid #444" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value: any) => [formatCurrency(value), "Price"]}
                      labelFormatter={(label) => {
                        const dataPoint = chartData.find((point) => point.date === label)
                        return `${label} ${dataPoint?.time || ""}`
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

