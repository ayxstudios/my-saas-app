import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import GenerateClient from "@/components/generate/GenerateClient"

export default async function GeneratePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: {
      shopifyStore: {
        include: {
          products: {
            orderBy: { title: "asc" },
            take: 100,
          },
        },
      },
      brandProfile: true,
      campaigns: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!user?.shopifyStore && !user?.websiteUrl) {
    redirect("/onboarding")
  }

  if (!user?.brandProfile) {
    redirect("/brand")
  }

  const products = user.shopifyStore?.products || []
  const campaigns = user.campaigns || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Generate Posts</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Select products and let AI create high-converting social content.
        </p>
      </div>
      <GenerateClient
        products={products.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          imageUrl: p.imageUrl,
          collection: p.collection,
        }))}
        campaigns={campaigns.map((c) => ({
          id: c.id,
          name: c.name,
          discount: c.discount,
        }))}
        websiteUrl={user.websiteUrl || null}
      />
    </div>
  )
}
