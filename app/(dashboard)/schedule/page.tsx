import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ScheduleClient from "@/components/schedule/ScheduleClient"

export default async function SchedulePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  })

  const posts = await prisma.generatedPost.findMany({
    where: {
      userId: user!.id,
      status: { in: ["approved", "scheduled"] },
    },
    include: {
      product: { select: { title: true } },
    },
    orderBy: { scheduledAt: "asc" },
  })

  const approvedPosts = posts.filter((p) => p.status === "approved")
  const scheduledPosts = posts.filter((p) => p.status === "scheduled")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Queue your approved posts for publishing.
        </p>
      </div>
      <ScheduleClient
        approvedPosts={approvedPosts.map((p) => ({
          id: p.id,
          hook: p.hook,
          caption: p.caption,
          imageUrl: p.imageUrl,
          postType: p.postType,
          productTitle: p.product?.title || null,
          scheduledAt: p.scheduledAt?.toISOString() || null,
          platform: p.platform,
          status: p.status,
        }))}
        scheduledPosts={scheduledPosts.map((p) => ({
          id: p.id,
          hook: p.hook,
          caption: p.caption,
          imageUrl: p.imageUrl,
          postType: p.postType,
          productTitle: p.product?.title || null,
          scheduledAt: p.scheduledAt?.toISOString() || null,
          platform: p.platform,
          status: p.status,
        }))}
      />
    </div>
  )
}
