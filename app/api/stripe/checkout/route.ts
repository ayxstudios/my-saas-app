import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { stripe, PLANS, PlanKey } from "@/lib/stripe"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: PlanKey }

  if (!PLANS[plan]) {
    return Response.json({ error: "Invalid plan" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const planConfig = PLANS[plan]
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId || undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: planConfig.productId,
          unit_amount: planConfig.price * 100,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId: user.id,
        plan,
      },
    },
    metadata: {
      userId: user.id,
      plan,
    },
    success_url: `${baseUrl}/billing?success=true`,
    cancel_url: `${baseUrl}/billing?canceled=true`,
  })

  return Response.json({ url: checkoutSession.url })
}
