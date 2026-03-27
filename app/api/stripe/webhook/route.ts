import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response(`Webhook error: ${(err as Error).message}`, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== "subscription") break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan

      if (!userId) break

      const item = subscription.items.data[0]
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: item.price.id,
          stripeCurrentPeriodEnd: new Date(item.current_period_end * 1000),
          subscriptionPlan: plan || null,
          subscriptionStatus: subscription.status,
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription

      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      })
      if (!user) break

      const item = subscription.items.data[0]
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripePriceId: item.price.id,
          stripeCurrentPeriodEnd: new Date(item.current_period_end * 1000),
          subscriptionStatus: subscription.status,
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription

      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      })
      if (!user) break

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          subscriptionPlan: null,
          subscriptionStatus: "canceled",
          trialEndsAt: null,
        },
      })
      break
    }
  }

  return new Response("OK", { status: 200 })
}
