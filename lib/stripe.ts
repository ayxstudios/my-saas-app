import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
})

export const PLANS = {
  basic: {
    name: "Basic",
    price: 50,
    productId: "prod_UDqKYaoJxO8d4o",
    features: [
      "Up to 30 AI posts/month",
      "1 Shopify store",
      "Instagram & Facebook publishing",
      "Basic analytics",
      "Email support",
    ],
  },
  premium: {
    name: "Premium",
    price: 75,
    productId: "prod_UDqLNlO1OcRaFp",
    features: [
      "Up to 100 AI posts/month",
      "3 Shopify stores",
      "Instagram & Facebook publishing",
      "Campaign management",
      "Advanced analytics",
      "Priority support",
    ],
  },
  expert: {
    name: "Expert",
    price: 100,
    productId: "prod_UDqMB3EsfzlZ9V",
    features: [
      "Unlimited AI posts",
      "Unlimited Shopify stores",
      "All platforms",
      "Campaign management",
      "Full analytics suite",
      "Dedicated account manager",
      "Custom brand training",
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
