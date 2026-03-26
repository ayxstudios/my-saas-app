import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ posts: [] })

  const posts = await prisma.generatedPost.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
    },
    include: {
      product: { select: { title: true, imageUrl: true } },
      campaign: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ posts })
}
