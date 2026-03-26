import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  fetchShopifyProducts,
  fetchShopifyCollections,
  cleanDescription,
} from "@/lib/shopify"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { shopifyStore: true },
  })

  if (!user?.shopifyStore) {
    return Response.json({ error: "No Shopify store connected" }, { status: 400 })
  }

  const { shopDomain, accessToken, id: storeId } = user.shopifyStore

  const [products, collections] = await Promise.all([
    fetchShopifyProducts(shopDomain, accessToken),
    fetchShopifyCollections(shopDomain, accessToken),
  ])

  const collectionMap = new Map(collections.map((c) => [String(c.id), c.title]))

  let synced = 0
  for (const product of products) {
    const imageUrl = product.images?.[0]?.src || null
    const price = product.variants?.[0]?.price || null
    const description = product.body_html
      ? cleanDescription(product.body_html)
      : null

    await prisma.product.upsert({
      where: { shopifyId_storeId: { shopifyId: String(product.id), storeId } },
      update: {
        title: product.title,
        description,
        price,
        imageUrl,
        handle: product.handle,
        collection: product.product_type || null,
      },
      create: {
        shopifyId: String(product.id),
        storeId,
        title: product.title,
        description,
        price,
        imageUrl,
        handle: product.handle,
        collection: product.product_type || null,
      },
    })
    synced++
  }

  await prisma.shopifyStore.update({
    where: { id: storeId },
    data: { syncedAt: new Date() },
  })

  return Response.json({ synced, total: products.length })
}
