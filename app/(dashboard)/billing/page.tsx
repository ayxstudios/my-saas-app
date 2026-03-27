import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import BillingClient from "@/components/billing/BillingClient"

export default async function BillingPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    select: {
      subscriptionPlan: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  })

  const hasSubscription = !!(
    user?.stripeSubscriptionId &&
    user.subscriptionStatus !== "canceled"
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your subscription and billing details.
        </p>
      </div>

      <BillingClient
        subscriptionPlan={user?.subscriptionPlan ?? null}
        subscriptionStatus={user?.subscriptionStatus ?? null}
        trialEndsAt={user?.trialEndsAt ?? null}
        stripeCurrentPeriodEnd={user?.stripeCurrentPeriodEnd ?? null}
        hasSubscription={hasSubscription}
      />
    </div>
  )
}
