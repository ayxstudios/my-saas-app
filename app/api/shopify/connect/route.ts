import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { validateShopifyCredentials } from "@/lib/shopify"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { shopDomain, accessToken } = await request.json()

  if (!shopDomain || !accessToken) {
    return Response.json(
      { error: "Shop domain and access token are required" },
      { status: 400 }
    )
  }

  const domain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")

  const { valid, storeName, error } = await validateShopifyCredentials(
    domain,
    accessToken
  )

  if (!valid) {
    return Response.json({ error }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const store = await prisma.shopifyStore.upsert({
    where: { userId: user.id },
    update: { shopDomain: domain, accessToken, storeName },
    create: { userId: user.id, shopDomain: domain, accessToken, storeName },
  })

  return Response.json({ store: { id: store.id, shopDomain: domain, storeName } })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { shopifyStore: true },
  })

  return Response.json({
    store: user?.shopifyStore
      ? {
          id: user.shopifyStore.id,
          shopDomain: user.shopifyStore.shopDomain,
          storeName: user.shopifyStore.storeName,
          syncedAt: user.shopifyStore.syncedAt,
        }
      : null,
  })
}
