"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loadStripe, type Stripe } from "@stripe/stripe-js"

interface StripeContextType {
  stripe: Stripe | null
}

const StripeContext = createContext<StripeContextType>({ stripe: null })

export const useStripe = () => useContext(StripeContext)

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null)

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      setStripe(stripeInstance)
    }

    initStripe()
  }, [])

  return <StripeContext.Provider value={{ stripe }}>{children}</StripeContext.Provider>
}

