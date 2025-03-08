"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStripe } from "@/lib/stripe-provider"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["5 queries/day", "Basic AI models", "Standard response time", "Community support"],
  },
  {
    name: "Pro",
    price: 9.99,
    features: ["Unlimited queries", "Advanced AI models", "Priority support", "Faster response time", "Export results"],
  },
  {
    name: "Enterprise",
    price: 499,
    features: [
      "Custom AI models",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration",
      "Advanced analytics",
    ],
  },
]

export default function PricingPage() {
  const { stripe } = useStripe()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName }),
      })

      const session = await response.json()

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        })

        if (result.error) {
          console.error(result.error)
          toast({
            title: "Error",
            description: "Failed to process checkout. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-secondary-light">
        Choose Your <span className="text-primary-orange">BYTE</span> Plan
      </h1>
      <p className="text-center text-secondary-light/80 mb-8 max-w-2xl mx-auto">
        Select the plan that best fits your research needs. Upgrade or downgrade anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className="flex flex-col bg-primary-black/40 border-gray-800 hover:border-primary-orange/50 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-secondary-light">{plan.name}</CardTitle>
              <CardDescription className="text-secondary-light/80">
                {plan.price === 0 ? (
                  "Free forever"
                ) : (
                  <>
                    <span className="text-2xl font-bold text-primary-orange">${plan.price}</span>
                    <span className="text-secondary-light/60">/month</span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-secondary-light">
                    <Check className="h-4 w-4 mr-2 text-primary-orange" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading || plan.name === "Free"}
                className="w-full bg-primary-orange hover:bg-primary-gold text-white glow-effect transition-all duration-300"
              >
                {plan.name === "Free" ? "Current Plan" : loading ? "Processing..." : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

