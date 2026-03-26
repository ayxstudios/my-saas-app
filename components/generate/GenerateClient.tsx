"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  title: string
  price: string | null
  imageUrl: string | null
  collection: string | null
}

interface Campaign {
  id: string
  name: string
  discount: string | null
}

interface Props {
  products: Product[]
  campaigns: Campaign[]
  websiteUrl: string | null
}

export default function GenerateClient({ products, campaigns, websiteUrl }: Props) {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [count, setCount] = useState(7)
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [websiteTopic, setWebsiteTopic] = useState("")

  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState("")
  const [newCampaignDesc, setNewCampaignDesc] = useState("")
  const [newCampaignDiscount, setNewCampaignDiscount] = useState("")
  const [campaignList, setCampaignList] = useState(campaigns)

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function createCampaign() {
    if (!newCampaignName) return
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCampaignName,
        description: newCampaignDesc,
        discount: newCampaignDiscount,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setCampaignList((prev) => [data.campaign, ...prev])
      setSelectedCampaign(data.campaign.id)
      setShowNewCampaign(false)
      setNewCampaignName("")
      setNewCampaignDesc("")
      setNewCampaignDiscount("")
    }
  }

  const usingWebsite = products.length === 0 && !!websiteUrl

  async function generate() {
    if (!usingWebsite && !selectedProducts.length) {
      setError("Select at least one product")
      return
    }
    setError("")
    setLoading(true)

    const body = usingWebsite
      ? { websiteUrl, topic: websiteTopic || undefined, count, campaignId: selectedCampaign || null }
      : { productIds: selectedProducts, count, campaignId: selectedCampaign || null }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Generation failed. Check your Gemini API key.")
    } else {
      router.push("/posts")
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Products */}
      <div className="col-span-2">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {usingWebsite ? "Content Source" : "Select Products"}
              </h2>
              {!usingWebsite && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedProducts.length} of {products.length} selected
                </p>
              )}
            </div>
            {!usingWebsite && (
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProducts(filtered.map((p) => p.id))}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Select all
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {!usingWebsite && (
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
            />
          )}

          {products.length === 0 && websiteUrl ? (
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-indigo-500">🌐</span>
                <span className="font-medium">Generating from website</span>
                <span className="text-xs text-gray-400 truncate">{websiteUrl}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Focus topic or product <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. summer collection, new arrivals, skincare routine…"
                  value={websiteTopic}
                  onChange={(e) => setWebsiteTopic(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-xs text-gray-400">
                AI will infer your products and brand from{" "}
                <a href="/onboarding" className="text-indigo-600 hover:text-indigo-700">
                  your website URL
                </a>
                . Connect Shopify to use real product data.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No products synced.{" "}
              <a href="/onboarding" className="text-indigo-600 hover:text-indigo-700">
                Sync your store →
              </a>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {filtered.map((product) => {
                const selected = selectedProducts.includes(product.id)
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selected
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                      }`}
                    >
                      {selected && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs">
                        img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${selected ? "text-indigo-800" : "text-gray-800"}`}>
                        {product.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {product.price ? `$${product.price}` : ""}
                        {product.collection ? ` · ${product.collection}` : ""}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Options */}
      <div className="space-y-4">
        {/* Post count */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Posts to generate</h2>
            <p className="text-xs text-gray-400 mt-0.5">Up to 20 per run</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-2xl font-semibold text-indigo-600 w-8 text-right">
              {count}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[7, 14, 20].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  count === n
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Campaign</h2>
            <span className="text-xs text-gray-400">optional</span>
          </div>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">No campaign</option>
            {campaignList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.discount ? `— ${c.discount}` : ""}
              </option>
            ))}
          </select>

          {!showNewCampaign ? (
            <button
              onClick={() => setShowNewCampaign(true)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + New campaign
            </button>
          ) : (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <input
                type="text"
                placeholder="Campaign name"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Description (e.g. Summer Sale — 20% off)"
                value={newCampaignDesc}
                onChange={(e) => setNewCampaignDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Discount (e.g. 20% off)"
                value={newCampaignDiscount}
                onChange={(e) => setNewCampaignDiscount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={createCampaign}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={generate}
          disabled={loading || (!usingWebsite && !selectedProducts.length)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block">◌</span>
              Generating {count} posts…
            </span>
          ) : (
            `Generate ${count} Posts ⚡`
          )}
        </button>
        <p className="text-xs text-center text-gray-400">~15–30 seconds · Powered by Gemini</p>
      </div>
    </div>
  )
}
