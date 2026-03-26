"use client"

import { useState } from "react"

interface Post {
  id: string
  hook: string
  caption: string
  hashtags: string[]
  imageUrl: string | null
  postType: string
  status: string
  scheduledAt: string | null
  platform: string | null
  productTitle: string | null
  campaignName: string | null
}

const STATUS_FILTERS = ["all", "draft", "approved", "scheduled"]

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  approved: "bg-blue-50 text-blue-600 border-blue-100",
  scheduled: "bg-green-50 text-green-600 border-green-100",
  published: "bg-purple-50 text-purple-600 border-purple-100",
}

export default function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Post>>({})
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null)

  const filtered =
    statusFilter === "all" ? posts : posts.filter((p) => p.status === statusFilter)

  function startEdit(post: Post) {
    setEditingId(post.id)
    setEditData({ hook: post.hook, caption: post.caption, hashtags: post.hashtags })
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...editData } : p)))
      setEditingId(null)
    }
  }

  async function approve(id: string) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    })
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)))
    }
  }

  async function deletePost(id: string) {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  async function generateImage(id: string) {
    setGeneratingImageId(id)
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    })
    const data = await res.json()
    setGeneratingImageId(null)
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, imageUrl: data.imageUrl } : p)))
    }
  }

  async function schedulePost(id: string, scheduledAt: string, platform: string) {
    const res = await fetch(`/api/posts/${id}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt, platform }),
    })
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "scheduled", scheduledAt, platform } : p
        )
      )
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-3xl mb-3">✦</div>
        <div className="text-gray-900 font-semibold">No posts yet</div>
        <div className="text-gray-500 text-sm mt-1 mb-5">
          Generate your first batch of AI-powered posts
        </div>
        <a
          href="/generate"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Generate Posts
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
        {STATUS_FILTERS.map((f) => {
          const count = f === "all" ? posts.length : posts.filter((p) => p.status === f).length
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize font-medium ${
                statusFilter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f} <span className={statusFilter === f ? "opacity-70" : "text-gray-400"}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isEditing={editingId === post.id}
            editData={editData}
            onEdit={() => startEdit(post)}
            onSave={() => saveEdit(post.id)}
            onCancelEdit={() => setEditingId(null)}
            onEditDataChange={(data) => setEditData((prev) => ({ ...prev, ...data }))}
            onApprove={() => approve(post.id)}
            onDelete={() => deletePost(post.id)}
            onSchedule={(date, platform) => schedulePost(post.id, date, platform)}
            onGenerateImage={() => generateImage(post.id)}
            generatingImage={generatingImageId === post.id}
          />
        ))}
      </div>
    </div>
  )
}

function PostCard({
  post,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancelEdit,
  onEditDataChange,
  onApprove,
  onDelete,
  onSchedule,
  onGenerateImage,
  generatingImage,
}: {
  post: Post
  isEditing: boolean
  editData: Partial<Post>
  onEdit: () => void
  onSave: () => void
  onCancelEdit: () => void
  onEditDataChange: (data: Partial<Post>) => void
  onApprove: () => void
  onDelete: () => void
  onSchedule: (date: string, platform: string) => void
  onGenerateImage: () => void
  generatingImage: boolean
}) {
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [schedulePlatform, setSchedulePlatform] = useState("instagram")
  const [copySuccess, setCopySuccess] = useState(false)

  async function copyCaption() {
    const text = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.map((h) => `#${h.replace("#", "")}`).join(" ")}`
    await navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const postTypeLabel: Record<string, string> = {
    product: "Product",
    lifestyle: "Lifestyle",
    promo: "Promo",
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      {post.imageUrl && (
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="text-xs px-2 py-0.5 bg-white/90 text-gray-700 rounded-full border border-gray-200 shadow-sm font-medium capitalize">
              {postTypeLabel[post.postType] || post.postType}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[post.status]}`}>
              {post.status}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* No image status */}
        {!post.imageUrl && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 capitalize">{postTypeLabel[post.postType] || post.postType}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusStyle[post.status]}`}>
              {post.status}
            </span>
          </div>
        )}

        {/* Meta tags */}
        {(post.productTitle || post.campaignName) && (
          <div className="flex gap-1.5 flex-wrap">
            {post.productTitle && (
              <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {post.productTitle}
              </span>
            )}
            {post.campaignName && (
              <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                🏷 {post.campaignName}
              </span>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Hook</label>
              <input
                value={editData.hook || ""}
                onChange={(e) => onEditDataChange({ hook: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Caption</label>
              <textarea
                value={editData.caption || ""}
                onChange={(e) => onEditDataChange({ caption: e.target.value })}
                rows={4}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Hashtags (space-separated)
              </label>
              <input
                value={editData.hashtags?.join(" ") || ""}
                onChange={(e) =>
                  onEditDataChange({ hashtags: e.target.value.split(" ").filter(Boolean) })
                }
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={onSave}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900 leading-snug">{post.hook}</p>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.caption}</p>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {post.hashtags.slice(0, 5).map((tag, i) => (
                <span key={i} className="text-xs text-indigo-500">
                  #{tag.replace("#", "")}
                </span>
              ))}
              {post.hashtags.length > 5 && (
                <span className="text-xs text-gray-400">+{post.hashtags.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Schedule picker */}
        {showSchedule && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={schedulePlatform}
                onChange={(e) => setSchedulePlatform(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (scheduleDate) {
                    onSchedule(scheduleDate, schedulePlatform)
                    setShowSchedule(false)
                  }
                }}
                disabled={!scheduleDate}
                className="text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowSchedule(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Scheduled badge */}
        {post.status === "scheduled" && post.scheduledAt && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center gap-1.5">
            <span>📅</span>
            {new Date(post.scheduledAt).toLocaleString()} · {post.platform}
          </div>
        )}

        {/* Action bar */}
        {!isEditing && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50 flex-wrap">
            {post.status === "draft" && (
              <button
                onClick={onApprove}
                className="text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Approve
              </button>
            )}
            {(post.status === "approved" || post.status === "draft") && !showSchedule && (
              <button
                onClick={() => setShowSchedule(true)}
                className="text-xs font-medium bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Schedule
              </button>
            )}
            <button
              onClick={onEdit}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={copyCaption}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {copySuccess ? "✓ Copied" : "Copy"}
            </button>
            {!post.imageUrl && (
              <button
                onClick={onGenerateImage}
                disabled={generatingImage}
                className="text-xs font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
              >
                {generatingImage ? "Generating…" : "✦ Gen Image"}
              </button>
            )}
            <button
              onClick={onDelete}
              className="text-xs text-gray-300 hover:text-red-400 ml-auto transition-colors p-1.5"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
