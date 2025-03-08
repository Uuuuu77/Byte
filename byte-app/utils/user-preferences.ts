import type { ResearchMode, AIModel } from "@/types/ai"

// Type definitions for user preferences
export interface UserPreferences {
  defaultResearchMode: ResearchMode
  defaultModel: AIModel
  theme: "light" | "dark" | "system"
  cryptoFavorites: string[] // Array of favorite coin IDs
  researchHistory: ResearchHistoryItem[]
  exportFormat: "pdf" | "markdown"
  dataVisualizations: boolean
  notificationsEnabled: boolean
}

export interface ResearchHistoryItem {
  id: string
  query: string
  mode: ResearchMode
  model: AIModel
  createdAt: string
  response?: string
}

// Default user preferences
export const defaultPreferences: UserPreferences = {
  defaultResearchMode: "auto",
  defaultModel: "auto",
  theme: "dark",
  cryptoFavorites: ["bitcoin", "ethereum", "solana"],
  researchHistory: [],
  exportFormat: "pdf",
  dataVisualizations: true,
  notificationsEnabled: true,
}

// Save user preferences to localStorage
export function saveUserPreferences(userId: string, preferences: Partial<UserPreferences>): void {
  try {
    // Get current preferences
    const currentPrefs = getUserPreferences(userId)

    // Merge with new preferences
    const updatedPrefs = {
      ...currentPrefs,
      ...preferences,
    }

    localStorage.setItem(`byte_preferences_${userId}`, JSON.stringify(updatedPrefs))
  } catch (error) {
    console.error("Error saving user preferences:", error)
  }
}

// Get user preferences from localStorage
export function getUserPreferences(userId: string): UserPreferences {
  try {
    const savedPrefs = localStorage.getItem(`byte_preferences_${userId}`)
    if (savedPrefs) {
      return JSON.parse(savedPrefs) as UserPreferences
    }
    return defaultPreferences
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return defaultPreferences
  }
}

// Add a research query to history
export function addToResearchHistory(
  userId: string,
  query: string,
  mode: ResearchMode,
  model: AIModel,
  response?: string,
): void {
  try {
    const prefs = getUserPreferences(userId)

    // Create new history item
    const newItem: ResearchHistoryItem = {
      id: Date.now().toString(),
      query,
      mode,
      model,
      createdAt: new Date().toISOString(),
      response,
    }

    // Add to beginning of array (most recent first)
    const updatedHistory = [newItem, ...prefs.researchHistory].slice(0, 50) // Limit to 50 items

    saveUserPreferences(userId, {
      researchHistory: updatedHistory,
    })
  } catch (error) {
    console.error("Error adding to research history:", error)
  }
}

// Clear research history
export function clearResearchHistory(userId: string): void {
  saveUserPreferences(userId, {
    researchHistory: [],
  })
}

// Add a cryptocurrency to favorites
export function addCryptoFavorite(userId: string, coinId: string): void {
  const prefs = getUserPreferences(userId)
  if (!prefs.cryptoFavorites.includes(coinId)) {
    saveUserPreferences(userId, {
      cryptoFavorites: [...prefs.cryptoFavorites, coinId],
    })
  }
}

// Remove a cryptocurrency from favorites
export function removeCryptoFavorite(userId: string, coinId: string): void {
  const prefs = getUserPreferences(userId)
  saveUserPreferences(userId, {
    cryptoFavorites: prefs.cryptoFavorites.filter((id) => id !== coinId),
  })
}

