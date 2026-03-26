"use client"

import { useState } from "react"

interface SchedulePost {
  id: string
  hook: string
  caption: string
  imageUrl: string | null
  postType: string
  productTitle: string | null
  scheduledAt: string | null
  platform: string | null
  status: string
}

interface Props {
  approvedPosts: SchedulePost[]
  scheduledPosts: SchedulePost[]
}

const OPTIMAL_TIMES = ["09:00", "11:00", "13:00", "17:00", "19:00", "20:00"]

function getOptimalTime(index: number): string {
  return OPTIMAL_TIMES[index % OPTIMAL_TIMES.length]
}

function getDefaultDate(index: number): string {
  const d = new Date()
  d.setDate(d.getDate() + Math.floor(index / 2))
  const [h, m] = getOptimalTime(index).split(":")
  d.setHours(Number(h), Number(m), 0, 0)
  return d.toISOString().slice(0, 16)
}

export default function ScheduleClient({ approvedPosts, scheduledPosts }: Props) {
  const [approved, setApproved] = useState<SchedulePost[]>(approvedPosts)
  const [scheduled, setScheduled] = useState<SchedulePost[]>(scheduledPosts)
  const [scheduling, setScheduling] = useState<Record<string, boolean>>({})
  const [scheduleData, setScheduleData] = useState<
    Record<string, { date: string; platform: string }>
  >({})

  function getScheduleData(id: string, index: number) {
    return scheduleData[id] || { date: getDefaultDate(index), platform: "instagram" }
  }

  function updateScheduleData(id: string, patch: Partial<{ date: string; platform: string }>, index: number) {
    setScheduleData((prev) => ({
      ...prev,
      [id]: { ...getScheduleData(id, index), ...patch },
    }))
  }

  async function schedulePost(post: SchedulePost, index: number) {
    const data = getScheduleData(post.id, index)
    setScheduling((prev) => ({ ...prev, [post.id]: true }))

    const res = await fetch(`/api/posts/${post.id}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt: data.date, platform: data.platform }),
    })

    setScheduling((prev) => ({ ...prev, [post.id]: false }))
    if (res.ok) {
      setApproved((prev) => prev.filter((p) => p.id !== post.id))
      setScheduled((prev) =>
        [
          ...prev,
          { ...post, status: "scheduled", scheduledAt: data.date, platform: data.platform },
        ].sort(
          (a, b) =>
            new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
        )
      )
    }
  }

  async function unschedule(id: string) {
    const res = await fetch(`/api/posts/${id}/schedule`, { method: "DELETE" })
    if (res.ok) {
      const post = scheduled.find((p) => p.id === id)
      if (post) {
        setScheduled((prev) => prev.filter((p) => p.id !== id))
        setApproved((prev) => [...prev, { ...post, status: "approved", scheduledAt: null }])
      }
    }
  }

  async function autoScheduleAll() {
    for (let i = 0; i < approved.length; i++) {
      await schedulePost(approved[i], i)
    }
  }

  return (
    <div className="space-y-8">
      {/* Ready to schedule */}
      {approved.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Ready to Schedule
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {approved.length} approved post{approved.length !== 1 ? "s" : ""} waiting
              </p>
            </div>
            {approved.length > 1 && (
              <button
                onClick={autoScheduleAll}
                className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg transition-colors"
              >
                ⚡ Auto-Schedule All
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            {approved.map((post, i) => {
              const data = getScheduleData(post.id, i)
              return (
                <div key={post.id} className="flex items-center gap-4 px-4 py-3.5">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {post.hook}
                    </div>
                    {post.productTitle && (
                      <div className="text-xs text-gray-400 mt-0.5">{post.productTitle}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="datetime-local"
                      defaultValue={data.date}
                      onChange={(e) => updateScheduleData(post.id, { date: e.target.value }, i)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      defaultValue="instagram"
                      onChange={(e) => updateScheduleData(post.id, { platform: e.target.value }, i)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="both">Both</option>
                    </select>
                    <button
                      onClick={() => schedulePost(post, i)}
                      disabled={scheduling[post.id]}
                      className="text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      {scheduling[post.id] ? "…" : "Schedule"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Scheduled queue */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Scheduled Queue</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {scheduled.length} post{scheduled.length !== 1 ? "s" : ""} queued for publishing
          </p>
        </div>

        {scheduled.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-400 text-sm">
            Nothing scheduled yet.{" "}
            {approved.length === 0 && (
              <a href="/posts" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Approve posts to schedule →
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            {scheduled.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 px-4 py-3.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-400 shrink-0">
                  {i + 1}
                </div>
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
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-green-600 font-medium">
                      {post.scheduledAt
                        ? new Date(post.scheduledAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                    {post.platform && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400 capitalize">{post.platform}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => unschedule(post.id)}
                  className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optimal times hint */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div className="text-xs font-semibold text-indigo-800 mb-2">
          Best times to post for maximum reach
        </div>
        <div className="flex gap-2 flex-wrap">
          {["9:00 AM", "11:00 AM", "1:00 PM", "5:00 PM", "7:00 PM", "8:00 PM"].map((t) => (
            <span
              key={t}
              className="text-xs bg-white border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
