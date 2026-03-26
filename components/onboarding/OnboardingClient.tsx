"use client"

import { useState } from "react"

interface ShopifyStore {
  shopDomain: string
  storeName: string | null
  syncedAt: string | null
}

interface SocialAccount {
  platform: string
  accountName: string
}

interface Props {
  shopifyStore: ShopifyStore | null
  websiteUrl: string | null
  socialAccounts: SocialAccount[]
}

export default function OnboardingClient({ shopifyStore, websiteUrl: initialWebsiteUrl, socialAccounts }: Props) {
  // Shopify
  const [shopDomain, setShopDomain] = useState(shopifyStore?.shopDomain || "")
  const [accessToken, setAccessToken] = useState("")
  const [shopifyLoading, setShopifyLoading] = useState(false)
  const [shopifyError, setShopifyError] = useState("")
  const [shopifySuccess, setShopifySuccess] = useState(
    shopifyStore ? `Connected to ${shopifyStore.storeName || shopifyStore.shopDomain}` : ""
  )
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(
    shopifyStore?.syncedAt
      ? `Last synced ${new Date(shopifyStore.syncedAt).toLocaleDateString()}`
      : ""
  )

  // Website URL
  const [websiteUrl, setWebsiteUrl] = useState(initialWebsiteUrl || "")
  const [websiteLoading, setWebsiteLoading] = useState(false)
  const [websiteError, setWebsiteError] = useState("")
  const [websiteSuccess, setWebsiteSuccess] = useState(initialWebsiteUrl ? `Connected: ${initialWebsiteUrl}` : "")

  // Social
  const [fbToken, setFbToken] = useState("")
  const [fbPageId, setFbPageId] = useState("")
  const [fbName, setFbName] = useState("")
  const [testMode, setTestMode] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [socialError, setSocialError] = useState("")
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(socialAccounts)

  async function connectShopify() {
    setShopifyLoading(true)
    setShopifyError("")
    setShopifySuccess("")

    const res = await fetch("/api/shopify/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopDomain, accessToken }),
    })
    const data = await res.json()
    setShopifyLoading(false)

    if (!res.ok) {
      setShopifyError(data.error || "Connection failed")
    } else {
      setShopifySuccess(`Connected to ${data.store.storeName || data.store.shopDomain}`)
    }
  }

  async function syncProducts() {
    setSyncing(true)
    setSyncResult("")
    const res = await fetch("/api/shopify/sync", { method: "POST" })
    const data = await res.json()
    setSyncing(false)
    setSyncResult(res.ok ? `${data.synced} products synced` : data.error || "Sync failed")
  }

  async function saveWebsiteUrl() {
    setWebsiteLoading(true)
    setWebsiteError("")
    setWebsiteSuccess("")

    const res = await fetch("/api/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteUrl }),
    })
    const data = await res.json()
    setWebsiteLoading(false)

    if (!res.ok) {
      setWebsiteError(data.error || "Failed to save URL")
    } else {
      setWebsiteSuccess(`Connected: ${data.websiteUrl}`)
    }
  }

  async function disconnectWebsite() {
    await fetch("/api/website", { method: "DELETE" })
    setWebsiteUrl("")
    setWebsiteSuccess("")
  }

  async function connectSocial(platform: string) {
    setSocialLoading(platform)
    setSocialError("")

    const res = await fetch("/api/social/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        accessToken: fbToken || "TEST_TOKEN",
        accountId: fbPageId || "me",
        accountName: fbName || platform,
        pageId: fbPageId || null,
        testMode,
      }),
    })
    const data = await res.json()
    setSocialLoading(null)

    if (!res.ok) {
      setSocialError(data.error || "Connection failed")
    } else {
      setConnectedAccounts((prev) => [
        ...prev.filter((a) => a.platform !== platform),
        { platform, accountName: data.account.accountName },
      ])
      setFbToken("")
      setFbPageId("")
      setFbName("")
    }
  }

  async function disconnectSocial(platform: string) {
    await fetch("/api/social/connect", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    })
    setConnectedAccounts((prev) => prev.filter((a) => a.platform !== platform))
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Shopify */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-lg">
              🛍
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Shopify Store</div>
              <div className="text-xs text-gray-400 mt-0.5">Connect via Admin API</div>
            </div>
          </div>
          {shopifySuccess && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              <span>✓</span> Connected
            </span>
          )}
        </div>

        {!shopifySuccess ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Store domain
              </label>
              <input
                type="text"
                placeholder="your-store.myshopify.com"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Admin API access token
              </label>
              <input
                type="password"
                placeholder="shpat_••••••••••••••"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Shopify Admin → Apps → Develop apps → Create token with{" "}
                <code className="text-gray-600 bg-gray-100 px-1 rounded">read_products</code> scope
              </p>
            </div>
            {shopifyError && (
              <p className="text-sm text-red-500">{shopifyError}</p>
            )}
            <button
              onClick={connectShopify}
              disabled={shopifyLoading || !shopDomain || !accessToken}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {shopifyLoading ? "Connecting…" : "Connect Store"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-900">{shopifySuccess}</div>
              {syncResult && (
                <div className="text-xs text-gray-400 mt-0.5">{syncResult}</div>
              )}
            </div>
            <button
              onClick={syncProducts}
              disabled={syncing}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 border border-indigo-200 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {syncing ? "Syncing…" : "Sync Products"}
            </button>
          </div>
        )}
      </div>

      {/* Website URL */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg">
              🌐
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Website URL</div>
              <div className="text-xs text-gray-400 mt-0.5">Generate posts from your website</div>
            </div>
          </div>
          {websiteSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              <span>✓</span> Connected
            </span>
          )}
        </div>

        {!websiteSuccess ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Your website
              </label>
              <input
                type="url"
                placeholder="https://yourbrand.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                AI will use your website as context to generate relevant posts.
              </p>
            </div>
            {websiteError && <p className="text-sm text-red-500">{websiteError}</p>}
            <button
              onClick={saveWebsiteUrl}
              disabled={websiteLoading || !websiteUrl}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {websiteLoading ? "Saving…" : "Connect Website"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
            <div className="text-sm font-medium text-gray-900 truncate">{websiteSuccess}</div>
            <button
              onClick={disconnectWebsite}
              className="text-xs text-gray-400 hover:text-red-500 ml-3 shrink-0 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Social Accounts */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
              📱
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Social Accounts</div>
              <div className="text-xs text-gray-400 mt-0.5">Instagram & Facebook</div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setTestMode(!testMode)}
              className={`relative w-8 h-4 rounded-full transition-colors ${testMode ? "bg-amber-400" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${testMode ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-gray-500">Test mode</span>
          </label>
        </div>

        {testMode && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 text-xs text-amber-700">
            Test mode skips Meta API validation — use a placeholder name to connect without a real token.
          </div>
        )}

        {connectedAccounts.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {connectedAccounts.map((account) => (
              <div
                key={account.platform}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-green-500 font-medium">✓</span>
                <span className="text-sm text-gray-700 capitalize font-medium">
                  {account.platform}
                </span>
                <span className="text-xs text-gray-400">{account.accountName}</span>
                <button
                  onClick={() => disconnectSocial(account.platform)}
                  className="text-gray-300 hover:text-red-400 text-sm ml-1 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {!testMode && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Page Access Token
              </label>
              <input
                type="password"
                placeholder="EAAxxxx…"
                value={fbToken}
                onChange={(e) => setFbToken(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
          )}
          <div className={`grid gap-3 ${testMode ? "grid-cols-1" : "grid-cols-2"}`}>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Account name
              </label>
              <input
                type="text"
                placeholder="My Brand Page"
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
            {!testMode && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Page ID <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={fbPageId}
                  onChange={(e) => setFbPageId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
            )}
          </div>

          {socialError && <p className="text-sm text-red-500">{socialError}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => connectSocial("instagram")}
              disabled={(!testMode && !fbToken) || !fbName || socialLoading === "instagram"}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              {socialLoading === "instagram" ? "Connecting…" : "Connect Instagram"}
            </button>
            <button
              onClick={() => connectSocial("facebook")}
              disabled={(!testMode && !fbToken) || !fbName || socialLoading === "facebook"}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {socialLoading === "facebook" ? "Connecting…" : "Connect Facebook"}
            </button>
          </div>
          {!testMode && (
            <p className="text-xs text-gray-400">
              Get your token from{" "}
              <span className="text-gray-600">developers.facebook.com → Graph API Explorer</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
