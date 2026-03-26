import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const body = await request.json()
  const allowedFields = ["hook", "caption", "hashtags", "imageUrl", "status", "platform"]
  const data: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) data[field] = body[field]
  }

  const post = await prisma.generatedPost.updateMany({
    where: { id, userId: user.id },
    data,
  })

  if (!post.count) {
    return Response.json({ error: "Post not found" }, { status: 404 })
  }

  const updated = await prisma.generatedPost.findUnique({ where: { id } })
  return Response.json({ post: updated })
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

  await prisma.generatedPost.deleteMany({ where: { id, userId: user.id } })
  return Response.json({ success: true })
}
