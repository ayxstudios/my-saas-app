import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { scheduledAt, platform } = await request.json()

  if (!scheduledAt) {
    return Response.json({ error: "scheduledAt is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const result = await prisma.generatedPost.updateMany({
    where: { id, userId: user.id },
    data: {
      scheduledAt: new Date(scheduledAt),
      platform: platform || "instagram",
      status: "scheduled",
    },
  })

  if (!result.count) {
    return Response.json({ error: "Post not found" }, { status: 404 })
  }

  const post = await prisma.generatedPost.findUnique({ where: { id } })
  return Response.json({ post })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  await prisma.generatedPost.updateMany({
    where: { id, userId: user.id },
    data: { scheduledAt: null, status: "approved" },
  })

  return Response.json({ success: true })
}
