"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUserPreferences, saveUserPreferences, defaultPreferences } from "@/utils/user-preferences"
import type { UserPreferences } from "@/utils/user-preferences"
import type { ResearchMode, AIModel } from "@/types/ai"
import { useAuth } from "@/lib/auth-context"

interface PreferencesContextType {
  preferences: UserPreferences
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void
  setDefaultModel: (model: AIModel) => void
  setDefaultMode: (mode: ResearchMode) => void
  addToFavorites: (coinId: string) => void
  removeFromFavorites: (coinId: string) => void
  clearHistory: () => void
  isLoading: boolean
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  setDefaultModel: () => {},
  setDefaultMode: () => {},
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  clearHistory: () => {},
  isLoading: true,
})

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const userPrefs = getUserPreferences(user.id)
      setPreferences(userPrefs)
    }
    setIsLoading(false)
  }, [user])

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    if (!user) return

    const updatedPrefs = {
      ...preferences,
      ...newPrefs,
    }

    setPreferences(updatedPrefs)
    saveUserPreferences(user.id, newPrefs)
  }

  const setDefaultModel = (model: AIModel) => {
    updatePreferences({ defaultModel: model })
  }

  const setDefaultMode = (mode: ResearchMode) => {
    updatePreferences({ defaultResearchMode: mode })
  }

  const addToFavorites = (coinId: string) => {
    if (!preferences.cryptoFavorites.includes(coinId)) {
      updatePreferences({
        cryptoFavorites: [...preferences.cryptoFavorites, coinId],
      })
    }
  }

  const removeFromFavorites = (coinId: string) => {
    updatePreferences({
      cryptoFavorites: preferences.cryptoFavorites.filter((id) => id !== coinId),
    })
  }

  const clearHistory = () => {
    updatePreferences({ researchHistory: [] })
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        setDefaultModel,
        setDefaultMode,
        addToFavorites,
        removeFromFavorites,
        clearHistory,
        isLoading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)

