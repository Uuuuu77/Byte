// Function to check if a query is related to cryptocurrency
export function isCryptoQuery(query: string): boolean {
  const cryptoTerms = [
    "bitcoin",
    "ethereum",
    "crypto",
    "blockchain",
    "token",
    "defi",
    "nft",
    "web3",
    "mining",
    "wallet",
    "exchange",
    "altcoin",
    "ico",
    "staking",
    "yield",
    "trading",
    "invest",
    "price",
    "market",
  ]

  return cryptoTerms.some((term) => query.toLowerCase().includes(term))
}

// Function to add disclaimer to cryptocurrency-related responses
export function generateResponseWithDisclaimer(query: string, response: string): string {
  if (isCryptoQuery(query)) {
    const disclaimer = `

**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions.`

    return response + disclaimer
  }

  return response
}

