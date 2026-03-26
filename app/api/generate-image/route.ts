import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generatePostImage } from "@/lib/gemini-image"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { postId } = await request.json()
  if (!postId) {
    return Response.json({ error: "Post ID required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { brandProfile: true },
  })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const post = await prisma.generatedPost.findFirst({
    where: { id: postId, userId: user.id },
  })
  if (!post) return Response.json({ error: "Post not found" }, { status: 404 })

  const imageDataUrl = await generatePostImage({
    hook: post.hook,
    caption: post.caption,
    postType: post.postType,
    brandTone: user.brandProfile?.tone || "professional",
  })

  if (!imageDataUrl) {
    return Response.json({ error: "Image generation failed" }, { status: 500 })
  }

  const updated = await prisma.generatedPost.update({
    where: { id: postId },
    data: { imageUrl: imageDataUrl },
  })

  return Response.json({ imageUrl: updated.imageUrl })
}
