import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { scrapeWebsite } from "@/lib/scraper"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { websiteUrl } = await request.json()
  const url = websiteUrl?.trim()

  if (!url) {
    return Response.json({ error: "Website URL is required" }, { status: 400 })
  }

  const userEmail = session.user.email

  // Save the URL immediately, clear any stale context
  await prisma.user.update({
    where: { email: userEmail },
    data: { websiteUrl: url, websiteContext: undefined, websiteScrapedAt: undefined },
  })

  // Scrape in background — don't block the response
  ;(async () => {
    try {
      const context = await scrapeWebsite(url)
      await prisma.user.update({
        where: { email: userEmail },
        data: {
          websiteContext: context as object,
          websiteScrapedAt: new Date(),
        },
      })
    } catch (err) {
      console.error("[website scrape] failed:", err)
    }
  })()

  return Response.json({ websiteUrl: url, status: "scraping" })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      websiteUrl: true,
      websiteContext: true,
      websiteScrapedAt: true,
    },
  })

  return Response.json({
    websiteUrl: user?.websiteUrl,
    websiteContext: user?.websiteContext,
    websiteScrapedAt: user?.websiteScrapedAt,
  })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { websiteUrl: null, websiteContext: undefined, websiteScrapedAt: undefined },
  })

  return Response.json({ success: true })
}
