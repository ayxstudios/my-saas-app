import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import PostsClient from "@/components/posts/PostsClient"

export default async function PostsPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  })

  const posts = await prisma.generatedPost.findMany({
    where: { userId: user!.id },
    include: {
      product: { select: { title: true } },
      campaign: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Posts</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Review, edit, and approve your AI-generated content.
          </p>
        </div>
        <a
          href="/generate"
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Generate More
        </a>
      </div>
      <PostsClient
        initialPosts={posts.map((p) => ({
          id: p.id,
          hook: p.hook,
          caption: p.caption,
          hashtags: p.hashtags,
          imageUrl: p.imageUrl,
          postType: p.postType,
          status: p.status,
          scheduledAt: p.scheduledAt?.toISOString() || null,
          platform: p.platform,
          productTitle: p.product?.title || null,
          campaignName: p.campaign?.name || null,
        }))}
      />
    </div>
  )
}
