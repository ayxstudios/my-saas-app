import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PLANS, PlanKey } from "@/lib/stripe"

export default async function DashboardPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: {
      shopifyStore: true,
      brandProfile: true,
      socialAccounts: true,
      generatedPosts: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  const totalPosts = await prisma.generatedPost.count({ where: { userId: user!.id } })
  const scheduledPosts = await prisma.generatedPost.count({
    where: { userId: user!.id, status: "scheduled" },
  })
  const draftPosts = await prisma.generatedPost.count({
    where: { userId: user!.id, status: "draft" },
  })

  const setup = {
    shopify: !!user?.shopifyStore,
    brand: !!user?.brandProfile,
    social: (user?.socialAccounts?.length || 0) > 0,
  }
  const setupDone = Object.values(setup).filter(Boolean).length

  const subPlan = user?.subscriptionPlan as PlanKey | null
  const subStatus = user?.subscriptionStatus
  const isTrialing = subStatus === "trialing"
  const hasSubscription = !!(user?.stripeSubscriptionId && subStatus !== "canceled")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Good morning, {session?.user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here's what's happening with your content pipeline.
        </p>
      </div>

      {/* Subscription status */}
      {!hasSubscription ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-900">No active plan</p>
            <p className="text-xs text-amber-700 mt-0.5">Start your 7-day free trial — no credit card charged until day 8.</p>
          </div>
          <Link
            href="/billing"
            className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg transition-colors shrink-0"
          >
            View Plans →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {subPlan ? subPlan[0].toUpperCase() : "?"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {subPlan ? PLANS[subPlan].name : "Active"} Plan
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  isTrialing
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}>
                  {isTrialing ? "Trial" : "Active"}
                </span>
              </div>
              {isTrialing && user.trialEndsAt && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Free trial ends {new Date(user.trialEndsAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/billing"
            className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Manage
          </Link>
        </div>
      )}

      {/* Setup banner */}
      {setupDone < 3 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-indigo-900">
                Finish setting up — {setupDone} of 3 steps complete
              </h2>
              <p className="text-xs text-indigo-500 mt-0.5">
                Complete setup to start generating posts
              </p>
            </div>
            <Link
              href="/onboarding"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Continue →
            </Link>
          </div>
          <div className="flex gap-2">
            {[
              { key: "shopify", label: "Connect Shopify" },
              { key: "brand", label: "Brand Profile" },
              { key: "social", label: "Link Socials" },
            ].map((step) => {
              const done = setup[step.key as keyof typeof setup]
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                    done
                      ? "bg-white border-indigo-200 text-indigo-600"
                      : "bg-white/50 border-indigo-100 text-indigo-400"
                  }`}
                >
                  <span>{done ? "✓" : "·"}</span>
                  {step.label}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: totalPosts, sub: "generated" },
          { label: "Scheduled", value: scheduledPosts, sub: "in queue", accent: true },
          { label: "Drafts", value: draftPosts, sub: "to review" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className={`text-3xl font-semibold ${stat.accent ? "text-indigo-600" : "text-gray-900"}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/generate"
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl p-5 group"
        >
          <div className="text-xl mb-2">⚡</div>
          <div className="font-semibold text-white">Generate Posts</div>
          <div className="text-indigo-200 text-sm mt-1">
            Turn your products into scroll-stopping content
          </div>
        </Link>
        <Link
          href="/schedule"
          className="bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all rounded-xl p-5"
        >
          <div className="text-xl mb-2">📅</div>
          <div className="font-semibold text-gray-900">View Schedule</div>
          <div className="text-gray-500 text-sm mt-1">
            {scheduledPosts > 0
              ? `${scheduledPosts} posts queued`
              : "No posts scheduled yet"}
          </div>
        </Link>
      </div>

      {/* Recent posts */}
      {user?.generatedPosts && user.generatedPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/posts" className="text-xs text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm overflow-hidden">
            {user.generatedPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-4 py-3">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {post.hook}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {post.caption.slice(0, 70)}…
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                    post.status === "scheduled"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : post.status === "approved"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPosts === 0 && setupDone === 3 && (
        <div className="text-center py-14 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="text-3xl mb-3">✦</div>
          <div className="text-gray-900 font-semibold">You&apos;re all set</div>
          <div className="text-gray-500 text-sm mt-1 mb-5">
            Generate your first batch of AI-powered posts
          </div>
          <Link
            href="/generate"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Generate Posts
          </Link>
        </div>
      )}
    </div>
  )
}
