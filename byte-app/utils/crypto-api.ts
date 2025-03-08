// Utility functions for cryptocurrency API integration

/**
 * CoinGecko API client for fetching cryptocurrency data
 */
export const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d?: number
  price_change_percentage_30d?: number
  sparkline_in_7d?: {
    price: number[]
  }
}

interface MarketChart {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

interface CoinDetails {
  id: string
  symbol: string
  name: string
  description: {
    en: string
  }
  image: {
    small: string
    large: string
  }
  market_data: {
    current_price: {
      usd: number
    }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    market_cap: {
      usd: number
    }
    total_volume: {
      usd: number
    }
    circulating_supply: number
    total_supply: number
    max_supply: number | null
  }
}

/**
 * Fetch top cryptocurrencies by market cap
 */
export async function getTopCryptos(limit = 10, page = 1, sparkline = false, timeframe = "24h"): Promise<CoinData[]> {
  try {
    const url = new URL(`${COINGECKO_API_URL}/coins/markets`)
    url.searchParams.append("vs_currency", "usd")
    url.searchParams.append("order", "market_cap_desc")
    url.searchParams.append("per_page", limit.toString())
    url.searchParams.append("page", page.toString())
    url.searchParams.append("sparkline", sparkline.toString())
    url.searchParams.append("price_change_percentage", timeframe)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Revalidate every minute
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data: CoinData[] = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}

/**
 * Get historical market data for a specific coin
 */
export async function getCoinMarketChart(coinId: string, days = 7): Promise<MarketChart | null> {
  try {
    const url = new URL(`${COINGECKO_API_URL}/coins/${coinId}/market_chart`)
    url.searchParams.append("vs_currency", "usd")
    url.searchParams.append("days", days.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 * 5 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch market chart: ${response.status}`)
    }

    const data: MarketChart = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching market chart:", error)
    return null
  }
}

/**
 * Get detailed information about a specific coin
 */
export async function getCoinDetails(coinId: string): Promise<CoinDetails | null> {
  try {
    const url = new URL(`${COINGECKO_API_URL}/coins/${coinId}`)
    url.searchParams.append("localization", "false")
    url.searchParams.append("tickers", "false")
    url.searchParams.append("market_data", "true")
    url.searchParams.append("community_data", "false")
    url.searchParams.append("developer_data", "false")

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 * 5 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch coin details: ${response.status}`)
    }

    const data: CoinDetails = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching coin details:", error)
    return null
  }
}

/**
 * Search for coins, categories and markets
 */
export async function searchCryptos(query: string) {
  try {
    const url = new URL(`${COINGECKO_API_URL}/search`)
    url.searchParams.append("query", query)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search cryptos: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching cryptos:", error)
    return { coins: [], categories: [], exchanges: [] }
  }
}

