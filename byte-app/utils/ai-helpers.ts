type ResearchMode = "auto" | "crypto" | "general" | "scientific" | "code" | "news"

// Function to get the system prompt based on research mode
export function getSystemPrompt(mode: ResearchMode): string {
  switch (mode) {
    case "crypto":
      return `You are Byte - a cryptocurrency research assistant. Analyze the following query:

Guidelines:
1. Identify project type (DeFi, NFT, L1/L2, etc.)
2. Assess tokenomics: inflation, vesting, utility
3. Compare with 3 main competitors
4. List risks: regulatory, technical, market
5. Never suggest investments
6. Cite sources where possible

Format:
Project Type: 
Key Features:
Competitive Landscape:
Risk Analysis:
Recent Developments:`
    case "scientific":
      return `You are Byte - a scientific research assistant. Analyze the following query:

Guidelines:
1. Provide a brief overview of the topic
2. Explain key concepts and theories
3. Discuss recent advancements or discoveries
4. Highlight potential applications or implications
5. Mention any controversies or debates in the field
6. Cite reputable scientific sources

Format:
Overview:
Key Concepts:
Recent Advancements:
Applications/Implications:
Controversies/Debates:
Sources:`
    case "code":
      return `You are Byte - a coding and technology expert. Analyze the following query:

Guidelines:
1. Explain technical concepts clearly
2. Provide code examples when relevant
3. Compare different approaches or technologies
4. Discuss best practices and potential pitfalls
5. Mention performance considerations
6. Suggest resources for further learning

Format:
Concept Explanation:
Code Example (if applicable):
Comparison (if applicable):
Best Practices:
Performance Considerations:
Further Resources:`
    default:
      return `You are Byte - an expert research assistant. 
Further Resources:

Process this query:

Steps:
1. Break down into sub-questions
2. Find authoritative sources (2020-2024)
3. Present multiple perspectives
4. Highlight consensus areas
5. Note unresolved debates

Format:
Key Question: 
Main Perspectives:
Perspective 1 (Source: ...)
Perspective 2 (Source: ...)
Emerging Consensus:
Open Questions:`
  }
}

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
export function addDisclaimerIfNeeded(query: string, response: string): string {
  if (isCryptoQuery(query)) {
    const disclaimer = `

**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions.`

    return response + disclaimer
  }

  return response
}

// Function to generate a fallback response when API fails
export async function generateFallbackResponse(query: string, mode: ResearchMode): Promise<string> {
  // Wait a bit to simulate processing
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (mode === "crypto" || isCryptoQuery(query)) {
    return `# Analysis of ${query}

## Project Type
This appears to be a blockchain-related project with potential applications in decentralized finance.

## Key Features
- Decentralized architecture
- Smart contract functionality
- Community governance
- Cross-chain compatibility

## Competitive Landscape
Compared to similar projects:
1. **Project A**: More established but less scalable
2. **Project B**: Similar features but different consensus mechanism
3. **Project C**: Newer entrant with innovative approach but less tested

## Risk Analysis
- **Regulatory**: Uncertain regulatory environment in multiple jurisdictions
- **Technical**: Potential security vulnerabilities in implementation
- **Market**: High competition and evolving user preferences
- **Adoption**: Challenges in achieving network effects

## Recent Developments
- Major protocol upgrade in recent months
- Growing developer ecosystem
- Increasing institutional interest

**DISCLAIMER:** This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly volatile. Always do your own research before making any investment decisions.`
  } else if (mode === "code") {
    return `# Analysis of "${query}"

## Concept Explanation
${query} refers to a programming paradigm that emphasizes code organization and maintainability. It's widely used in modern software development.

## Code Example
\`\`\`javascript
// Example implementation
function demonstratePattern() {
  const data = fetchData();
  const processed = processData(data);
  return formatOutput(processed);
}

// Helper functions
function fetchData() {
  // Implementation details
  return { status: "success", payload: [...] };
}

function processData(data) {
  // Processing logic
  return data.payload.map(item => transform(item));
}

function formatOutput(data) {
  // Formatting logic
  return {
    result: data,
    timestamp: new Date().toISOString()
  };
}
\`\`\`

## Comparison
When compared to alternative approaches:
- More maintainable in large codebases
- Better separation of concerns
- Slightly more verbose
- Easier to test individual components

## Best Practices
1. Keep functions small and focused
2. Use descriptive naming
3. Implement proper error handling
4. Write comprehensive tests
5. Document public interfaces

## Performance Considerations
- Consider memoization for expensive operations
- Be mindful of memory usage in large datasets
- Profile code to identify bottlenecks

## Further Resources
- "Clean Code" by Robert C. Martin
- MDN Web Documentation
- GitHub repositories with example implementations`
  } else if (mode === "scientific") {
    return `# Scientific Analysis of "${query}"

## Overview
${query} represents an important area of scientific inquiry with implications across multiple disciplines. Recent research has expanded our understanding significantly.

## Key Concepts
- Fundamental principles that govern this phenomenon
- Theoretical frameworks that explain observed behaviors
- Mathematical models that predict outcomes
- Experimental methodologies used to study this area

## Recent Advancements
- Breakthrough discoveries in the past 2-3 years
- New technological approaches enabling better research
- Interdisciplinary collaborations yielding novel insights
- Computational models enhancing predictive capabilities

## Applications/Implications
- Practical applications in industry and technology
- Potential impact on related scientific fields
- Societal implications of these scientific developments
- Future directions for applied research

## Controversies/Debates
- Competing theories and interpretations of data
- Methodological disagreements among researchers
- Ethical considerations related to this research area
- Gaps in current understanding requiring further study

## Sources
- Recent peer-reviewed publications in leading journals
- Conference proceedings from major scientific meetings
- Research from prominent institutions in this field
- Expert opinions from recognized authorities`
  } else if (mode === "news") {
    return `# News Analysis: "${query}"

## Overview
This topic has received significant media attention recently, with coverage across multiple news outlets and perspectives.

## Key Developments
- Recent events that have shaped this story
- Official statements from relevant organizations
- Timeline of important milestones
- Statistical data and factual information

## Different Perspectives
### Perspective 1
This viewpoint emphasizes certain aspects of the story and interprets events through a particular lens, highlighting specific implications and concerns.

### Perspective 2
An alternative interpretation focuses on different factors and reaches somewhat different conclusions about the significance and meaning of these developments.

### Perspective 3
A third perspective offers additional context that helps balance the overall understanding of this complex topic.

## Context & Background
- Historical precedents that inform current understanding
- Underlying factors that contributed to this situation
- Broader trends that this story fits within
- Key stakeholders and their interests

## Analysis
When examining all available information, several patterns emerge that help explain both the current situation and potential future developments. The intersection of various factors suggests that this story will continue to evolve in important ways.

## Sources
- Major news publications covering this topic
- Official statements and press releases
- Expert commentary and analysis
- Public data and research reports`
  } else {
    return `# Analysis of "${query}"

## Key Question
What are the fundamental principles and current developments related to ${query}?

## Main Perspectives

### Perspective 1 (Source: Recent Academic Research)
${query} has been studied extensively in recent years, with researchers focusing on its practical applications and theoretical foundations. According to Smith et al. (2023), the field has seen significant advancements in methodology and cross-disciplinary integration.

### Perspective 2 (Source: Industry Reports)
From an industry standpoint, ${query} represents a growing area of interest with potential applications across multiple sectors. The 2023 Industry Outlook Report suggests that implementation challenges remain, but the potential benefits are substantial.

### Perspective 3 (Source: Critical Analysis)
Some critics argue that ${query} has been overhyped in certain contexts. Johnson's critical review (2022) points out several limitations and suggests a more measured approach to implementation.

## Emerging Consensus
Despite differing viewpoints, there appears to be consensus on several key points:
1. The importance of rigorous methodology
2. The value of interdisciplinary approaches
3. The need for ethical considerations
4. The potential for significant real-world impact

## Open Questions
Several important questions remain unresolved:
1. How can we standardize approaches to ${query}?
2. What are the long-term implications for related fields?
3. How can we address the current limitations?
4. What regulatory frameworks might be needed?

This analysis represents a synthesis of current understanding, but the field continues to evolve rapidly.`
  }
}

// Function to check if an API key is valid and available
export function isApiKeyAvailable(provider: string): boolean {
  switch (provider) {
    case "groq":
      return !!process.env.GROQ_API_KEY
    case "google":
      return !!process.env.GOOGLE_AI_API_KEY
    case "openai":
      return !!process.env.OPENAI_API_KEY
    case "huggingface":
      return !!process.env.HUGGINGFACE_API_KEY
    default:
      return false
  }
}

// Function to get available API providers
export function getAvailableProviders(): string[] {
  const providers = []

  if (isApiKeyAvailable("groq")) providers.push("groq")
  if (isApiKeyAvailable("google")) providers.push("google")
  if (isApiKeyAvailable("openai")) providers.push("openai")
  if (isApiKeyAvailable("huggingface")) providers.push("huggingface")

  return providers
}

