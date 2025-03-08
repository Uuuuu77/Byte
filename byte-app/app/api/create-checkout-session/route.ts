import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const { planName } = await req.json()

  let priceId: string

  switch (planName) {
    case "Pro":
      priceId = process.env.STRIPE_PRO_PRICE_ID!
      break
    case "Enterprise":
      priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID!
      break
    default:
      return NextResponse.json({ error: "Invalid plan name" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

