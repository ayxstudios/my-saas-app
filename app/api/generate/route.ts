import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSocialPosts, generateSocialPostsFromWebsite, type GenerateFromWebsiteInput } from "@/lib/gemini"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { productIds, count = 7, campaignId, websiteUrl, topic } = await request.json()

  const usingWebsite = !productIds?.length && websiteUrl

  if (!productIds?.length && !usingWebsite) {
    return Response.json({ error: "Select at least one product or provide a website URL" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { brandProfile: true },
    // websiteContext is on the base User model
  })

  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  if (!user.brandProfile) {
    return Response.json(
      { error: "Set up your brand profile first" },
      { status: 400 }
    )
  }

  let campaign = null
  if (campaignId) {
    campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: user.id },
    })
  }

  const generatedCount = Math.min(Math.max(1, count), 20)

  const campaignArg = campaign
    ? {
        name: campaign.name,
        description: campaign.description || "",
        discount: campaign.discount || undefined,
      }
    : undefined

  const brandArg = {
    tone: user.brandProfile.tone,
    audience: user.brandProfile.audience,
    exampleCaptions: user.brandProfile.exampleCaptions || undefined,
  }

  let posts
  if (usingWebsite) {
    posts = await generateSocialPostsFromWebsite({
      websiteUrl,
      topic: topic || undefined,
      brandProfile: brandArg,
      campaign: campaignArg,
      count: generatedCount,
      websiteContext: (user.websiteContext as GenerateFromWebsiteInput["websiteContext"]) ?? null,
    })
  } else {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (!products.length) {
      return Response.json({ error: "No valid products found" }, { status: 400 })
    }

    posts = await generateSocialPosts({
      products: products.map((p) => ({
        title: p.title,
        description: p.description || "",
        price: p.price || "N/A",
        imageUrl: p.imageUrl || "",
        collection: p.collection || undefined,
      })),
      brandProfile: brandArg,
      campaign: campaignArg,
      count: generatedCount,
    })

    const saved = await prisma.$transaction(
      posts.map((post, i) => {
        const matchedProduct = products.find(
          (p) => p.imageUrl === post.image_url
        ) || products[i % products.length]

        return prisma.generatedPost.create({
          data: {
            userId: user.id,
            productId: matchedProduct?.id || null,
            campaignId: campaign?.id || null,
            hook: post.hook,
            caption: post.caption,
            hashtags: post.hashtags,
            imageUrl: post.image_url,
            postType: post.post_type,
            status: "draft",
          },
        })
      })
    )

    return Response.json({ posts: saved, count: saved.length })
  }

  // Website mode: save without productId
  const saved = await prisma.$transaction(
    posts.map((post) =>
      prisma.generatedPost.create({
        data: {
          userId: user.id,
          productId: null,
          campaignId: campaign?.id || null,
          hook: post.hook,
          caption: post.caption,
          hashtags: post.hashtags,
          imageUrl: post.image_url || null,
          postType: post.post_type,
          status: "draft",
        },
      })
    )
  )

  return Response.json({ posts: saved, count: saved.length })
}
