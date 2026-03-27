import type { Metadata } from "next"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us — Flarvio",
  description: "Learn about Flarvio, the AI-powered social media platform built for ecommerce brands. Our mission, story, and the team behind it.",
}

const values = [
  {
    icon: "🚀",
    title: "Built for speed",
    desc: "The world moves fast. Your content should too. Flarvio lets you go from store to published post in seconds, not hours.",
  },
  {
    icon: "🎨",
    title: "Your brand, amplified",
    desc: "We don't replace your voice — we amplify it. Every caption, every post, every campaign sounds unmistakably like you.",
  },
  {
    icon: "🤝",
    title: "Partners, not vendors",
    desc: "We succeed when you succeed. Our monthly approval process means you're always in control of what goes out.",
  },
  {
    icon: "🌍",
    title: "Accessible expertise",
    desc: "Premium social media management used to mean paying bloated agency fees. We've changed that — starting at just $99/mo.",
  },
]

const industries = [
  "Beauty", "Food & Beverages", "Health & Wellness", "Home Services",
  "Real Estate", "SaaS", "Travel", "Music", "Pets", "Professional Services",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#5e17eb]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-4">About Flarvio</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            We're living through{" "}
            <span className="bg-gradient-to-r from-[#5e17eb] to-[#e06832] bg-clip-text text-transparent">
              the biggest revolution
            </span>{" "}
            of our time.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            AI is reshaping every industry. Flarvio was built so that ecommerce brands of every size can harness that revolution — and compete on the same playing field as the biggest names in their space.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold mb-5">AI-powered content that completely levels up your brand.</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We started Flarvio because we watched great brands struggle with the one thing that shouldn't be a bottleneck: content. Writing posts, scheduling them, keeping the feed fresh — it all takes time that founders and operators simply don't have.
            </p>
            <p className="text-gray-500 leading-relaxed">
              So we built the solution we wished existed. Flarvio connects directly to your Shopify store, learns your brand voice, and handles social media end-to-end — from caption to published post — while you focus on what matters most.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-black/8 p-8 space-y-6">
            {[
              { label: "Posts generated", value: "50,000+" },
              { label: "Platforms supported", value: "Instagram & Facebook" },
              { label: "Starting price", value: "$99/mo" },
              { label: "Industries served", value: "10+" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-bold text-[#5e17eb]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">What we stand for</p>
          <h2 className="text-3xl font-bold text-center mb-12">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-white rounded-2xl border border-black/6 hover:border-[#5e17eb]/20 hover:shadow-sm transition-all">
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">The process</p>
          <h2 className="text-3xl font-bold text-center mb-12">How Flarvio works for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Brand onboarding",
                desc: "We start with a thorough questionnaire to understand your brand, voice, audience, and goals.",
              },
              {
                step: "2",
                title: "Monthly content proofing",
                desc: "Every month we produce your content batch. You review, request revisions, and approve — full control, zero hassle.",
              },
              {
                step: "3",
                title: "Scheduled & monitored",
                desc: "Approved posts are scheduled and published automatically. We monitor performance and iterate every month.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative p-6 bg-white rounded-2xl border border-black/6 hover:border-[#5e17eb]/20 hover:shadow-sm transition-all">
                <span className="text-4xl font-black text-black/5 absolute top-4 right-5 select-none">{step}</span>
                <div className="w-8 h-8 rounded-lg bg-[#5e17eb]/10 border border-[#5e17eb]/20 flex items-center justify-center mb-4">
                  <span className="text-[#5e17eb] text-xs font-bold">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-3">Industries</p>
          <h2 className="text-3xl font-bold mb-4">Built for brands across every category</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg mx-auto">
            Whether you're in beauty, food, real estate, or anything in between — Flarvio adapts to your industry and your audience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span key={ind} className="text-sm bg-white border border-black/8 text-gray-600 px-4 py-1.5 rounded-full">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white/60 border-t border-black/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to level up your brand?</h2>
          <p className="text-gray-500 text-sm mb-8">Join brands already growing on social with Flarvio. Start your 7-day free trial today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="text-sm font-semibold bg-[#5e17eb] hover:bg-[#4c12c0] text-white px-8 py-3 rounded-xl transition-colors shadow-lg shadow-[#5e17eb]/20">
              Start free trial
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-black/10 bg-white px-8 py-3 rounded-xl transition-colors">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
