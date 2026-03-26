import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import OnboardingClient from "@/components/onboarding/OnboardingClient"

export default async function OnboardingPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: {
      shopifyStore: { select: { shopDomain: true, storeName: true, syncedAt: true } },
      socialAccounts: { select: { platform: true, accountName: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Connect your store</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Link your store and social accounts to start generating content.
        </p>
      </div>
      <OnboardingClient
        shopifyStore={
          user?.shopifyStore
            ? {
                shopDomain: user.shopifyStore.shopDomain,
                storeName: user.shopifyStore.storeName,
                syncedAt: user.shopifyStore.syncedAt?.toISOString() || null,
              }
            : null
        }
        websiteUrl={user?.websiteUrl || null}
        socialAccounts={
          user?.socialAccounts?.map((a) => ({
            platform: a.platform,
            accountName: a.accountName,
          })) || []
        }
      />
    </div>
  )
}
