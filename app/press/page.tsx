import type { Metadata } from "next"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"

export const metadata: Metadata = {
  title: "Press — Flarvio",
  description: "Flarvio press resources, brand kit, and media enquiries. Download logos, brand assets, and learn about our story.",
}

const brandFacts = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "Remote — Global" },
  { label: "Founder", value: "Yousif" },
  { label: "Category", value: "AI · Social Media · SaaS" },
  { label: "Platforms supported", value: "Instagram, Facebook" },
  { label: "Starting price", value: "$99 / month" },
  { label: "Free trial", value: "7 days — no credit card" },
  { label: "Website", value: "flarvio.com" },
]

const keyMessages = [
  {
    title: "The AI revolution is here",
    body: "We're living through the biggest, earth-shattering revolution of our time. Flarvio was built to make sure every ecommerce brand — not just the ones with big budgets — can benefit from it.",
  },
  {
    title: "Premium content at a fraction of agency cost",
    body: "Bloated agency retainers are a thing of the past. Flarvio delivers AI-powered content with your branding from just $99/month — a fraction of what traditional agencies charge.",
  },
  {
    title: "Shopify-native, brand-first",
    body: "Flarvio connects directly to your Shopify store and learns your brand voice, so every post sounds like you — not a generic AI. Your products, your voice, automatically published.",
  },
  {
    title: "End-to-end social media management",
    body: "From content generation to scheduling to performance monitoring — Flarvio handles the entire social media stack so founders and operators can focus on growing their business.",
  },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#5e17eb]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-4">Press & Media</p>
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Flarvio in{" "}
            <span className="bg-gradient-to-r from-[#5e17eb] to-[#e06832] bg-clip-text text-transparent">
              the press.
            </span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Resources for journalists, bloggers, and media professionals covering Flarvio. For media enquiries, contact{" "}
            <a href="mailto:press@flarvio.com" className="text-[#5e17eb] font-medium hover:underline">press@flarvio.com</a>.
          </p>
        </div>
      </section>

      {/* Brand facts */}
      <section className="py-16 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">Company facts</p>
          <h2 className="text-2xl font-bold text-center mb-10">Flarvio at a glance</h2>
          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden">
            {brandFacts.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < brandFacts.length - 1 ? "border-b border-black/5" : ""
                }`}
              >
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key messages */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">Key messages</p>
          <h2 className="text-2xl font-bold text-center mb-10">What Flarvio stands for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {keyMessages.map(({ title, body }) => (
              <div key={title} className="p-6 bg-white rounded-2xl border border-black/6 hover:border-[#5e17eb]/20 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section className="py-16 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">Brand kit</p>
          <h2 className="text-2xl font-bold text-center mb-4">Brand assets & guidelines</h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Please follow these guidelines when representing Flarvio in your publication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Logo preview */}
            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Logo</p>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5e17eb] to-[#e06832] flex items-center justify-center text-sm font-bold text-white">
                  F
                </div>
                <span className="font-bold text-gray-900 text-lg tracking-tight">Flarvio</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The Flarvio wordmark should always appear with the gradient icon. Minimum size: 24px icon height. Always maintain clear space around the logo.
              </p>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Brand colors</p>
              <div className="space-y-3">
                {[
                  { name: "Primary", hex: "#5e17eb", label: "Purple" },
                  { name: "Secondary", hex: "#e06832", label: "Orange" },
                  { name: "Background", hex: "#fff7ee", label: "Cream" },
                ].map(({ name, hex, label }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-black/8 shrink-0" style={{ backgroundColor: hex }} />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{name} — {label}</p>
                      <p className="text-xs text-gray-400 font-mono">{hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Typography</p>
              <p className="text-sm font-bold text-gray-900 mb-1">Geist Sans</p>
              <p className="text-xs text-gray-400 leading-relaxed">Primary typeface for all Flarvio communications. Available via Google Fonts.</p>
            </div>

            {/* Name usage */}
            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Name usage</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600"><strong>Flarvio</strong> — correct capitalisation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-400">flarvio, FLARVIO, FlarvIO</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600">"Flarvio platform" or "Flarvio app"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-400">"the Flarvio" (no article before brand name)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Press enquiries</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            For interviews, feature stories, or access to additional brand assets, please reach out to our press team. We're happy to provide quotes, data, and executive commentary.
          </p>
          <a
            href="mailto:press@flarvio.com"
            className="inline-block text-sm font-semibold bg-[#5e17eb] hover:bg-[#4c12c0] text-white px-8 py-3 rounded-xl transition-colors shadow-lg shadow-[#5e17eb]/20"
          >
            Contact press team
          </a>
          <p className="text-xs text-gray-400 mt-4">press@flarvio.com · Response within 1 business day</p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
