"use client"

import { useRef, useState } from "react"

const TONES = [
  { value: "luxury", label: "Luxury", desc: "Premium & aspirational" },
  { value: "playful", label: "Playful", desc: "Fun & energetic" },
  { value: "minimal", label: "Minimal", desc: "Clean & understated" },
  { value: "bold", label: "Bold", desc: "Confident & loud" },
  { value: "professional", label: "Professional", desc: "Expert & trustworthy" },
  { value: "friendly", label: "Friendly", desc: "Warm & conversational" },
]

const MAX_IMAGES = 10
const MAX_SIZE_MB = 4

interface BrandData {
  tone: string
  audience: string
  exampleCaptions: string
  competitors: string
  moodBoardImages: string[]
}

export default function BrandForm({ existing }: { existing: BrandData | null }) {
  const [tone, setTone] = useState(existing?.tone || "")
  const [audience, setAudience] = useState(existing?.audience || "")
  const [exampleCaptions, setExampleCaptions] = useState(existing?.exampleCaptions || "")
  const [competitors, setCompetitors] = useState(existing?.competitors || "")
  const [moodBoardImages, setMoodBoardImages] = useState<string[]>(existing?.moodBoardImages || [])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    setUploadError("")

    const remaining = MAX_IMAGES - moodBoardImages.length
    if (remaining <= 0) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }

    const toProcess = Array.from(files).slice(0, remaining)
    const oversized = toProcess.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      setUploadError(`Each image must be under ${MAX_SIZE_MB}MB.`)
      return
    }

    toProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setMoodBoardImages((prev) => [...prev, dataUrl])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    setMoodBoardImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  async function save() {
    if (!tone || !audience) {
      setError("Tone and audience are required")
      return
    }
    setLoading(true)
    setSaved(false)
    setError("")

    const res = await fetch("/api/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone, audience, exampleCaptions, competitors, moodBoardImages }),
    })

    setLoading(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || "Failed to save")
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Tone */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            Brand Tone <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            How does your brand speak to customers?
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                tone === t.value
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`text-sm font-medium ${tone === t.value ? "text-indigo-700" : "text-gray-800"}`}>
                {t.label}
              </div>
              <div className={`text-xs mt-0.5 ${tone === t.value ? "text-indigo-500" : "text-gray-400"}`}>
                {t.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Audience */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            Target Audience <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Be specific — the more detail, the better the output.
          </p>
        </div>
        <textarea
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Women aged 25–40 who love sustainable fashion, follow wellness influencers, shop online regularly, and prioritise quality over fast fashion"
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
        />
      </div>

      {/* Mood Board */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            Mood Board / Examples{" "}
            <span className="text-gray-400 font-normal text-xs">optional</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload example posts or images that represent the visual style you're going for. Up to {MAX_IMAGES} images.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP up to {MAX_SIZE_MB}MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

        {/* Preview grid */}
        {moodBoardImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {moodBoardImages.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Mood board ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  title="Remove"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {moodBoardImages.length > 0 && (
          <p className="text-xs text-gray-400">{moodBoardImages.length}/{MAX_IMAGES} images</p>
        )}
      </div>

      {/* Example captions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            Example Captions{" "}
            <span className="text-gray-400 font-normal text-xs">optional</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Paste 2–3 of your best captions to teach the AI your exact voice.
          </p>
        </div>
        <textarea
          value={exampleCaptions}
          onChange={(e) => setExampleCaptions(e.target.value)}
          placeholder="Paste your example captions here…"
          rows={4}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
        />
      </div>

      {/* Competitors */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            Competitor Accounts{" "}
            <span className="text-gray-400 font-normal text-xs">optional</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Accounts in your niche — used for context, not copying.
          </p>
        </div>
        <input
          type="text"
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
          placeholder="@brandone, @brandtwo"
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={save}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
      >
        {loading ? "Saving…" : saved ? "✓ Saved!" : "Save Brand Profile"}
      </button>
    </div>
  )
}
