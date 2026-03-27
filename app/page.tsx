import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import { PLANS } from "@/lib/stripe"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"

export default async function Home() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#5e17eb]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#5e17eb]/8 border border-[#5e17eb]/20 rounded-full px-4 py-1.5 text-xs text-[#5e17eb] mb-6 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e06832] inline-block"></span>
            Built for Shopify stores
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-gray-900">
            One click.<br />
            <span className="bg-gradient-to-r from-[#5e17eb] to-[#e06832] bg-clip-text text-transparent">
              Your entire social media done.
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Flarvio reads your Shopify products, writes scroll-stopping captions, and auto-schedules posts to Instagram and Facebook — without you lifting a finger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto text-sm font-semibold bg-[#5e17eb] hover:bg-[#4c12c0] transition-colors text-white px-8 py-3.5 rounded-xl shadow-lg shadow-[#5e17eb]/25"
            >
              Start for free — no credit card
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-6 py-3.5"
            >
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] text-center mb-3 font-semibold">How it works</p>
          <h2 className="text-3xl font-bold text-center mb-14 text-gray-900">Three steps, zero effort</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Connect your store",
                desc: "Link your Shopify store in seconds. Flarvio syncs your products, images, and descriptions automatically.",
              },
              {
                step: "02",
                title: "Set your brand voice",
                desc: "Tell us your tone, audience, and style once. Every caption will sound exactly like you — not a robot.",
              },
              {
                step: "03",
                title: "Hit publish",
                desc: "Review AI-generated posts or schedule them automatically. One click sends to Instagram and Facebook.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative p-6 rounded-2xl bg-white border border-black/6 hover:border-[#5e17eb]/30 hover:shadow-md transition-all">
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

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] text-center mb-3 font-semibold">Features</p>
          <h2 className="text-3xl font-bold text-center mb-14 text-gray-900">Everything you need, nothing you don't</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "⚡", title: "AI caption generation", desc: "Gemini-powered captions tailored to your brand voice and each product." },
              { icon: "📅", title: "Auto-scheduling", desc: "Pick a time once. Flarvio handles every future post without you." },
              { icon: "🛍️", title: "Shopify sync", desc: "Your entire product catalog is always up to date — new products appear instantly." },
              { icon: "📣", title: "Instagram & Facebook", desc: "Publish to both platforms simultaneously from one dashboard." },
              { icon: "🎯", title: "Campaign management", desc: "Group posts into campaigns for product launches, sales, and promotions." },
              { icon: "🧠", title: "Brand memory", desc: "Set your tone and audience once. AI remembers and stays consistent." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-white border border-black/6 hover:border-[#5e17eb]/20 hover:shadow-sm transition-all">
                <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof — industries */}
      <section className="py-16 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] mb-3 font-semibold">Industries we serve</p>
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Built for brands across every category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Beauty", "Food & Beverages", "Health & Wellness", "Home Services", "Real Estate", "SaaS", "Travel", "Music", "Pets", "Professional Services"].map((ind) => (
              <span key={ind} className="text-sm bg-white border border-black/8 text-gray-600 px-4 py-1.5 rounded-full">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] text-center mb-3 font-semibold">Pricing</p>
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">Simple, transparent pricing</h2>
          <p className="text-sm text-gray-500 text-center mb-2">
            Every plan comes with a <span className="text-[#5e17eb] font-semibold">7-day free trial</span>. No credit card charged until day 8.
          </p>
          <p className="text-xs text-gray-400 text-center mb-12">Cancel anytime, no questions asked.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
              const isPopular = key === "premium"
              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    isPopular
                      ? "border-[#5e17eb]/40 bg-white shadow-xl shadow-[#5e17eb]/10"
                      : "border-black/8 bg-white"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-[#5e17eb] text-white px-3 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-5">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{plan.name}</div>
                    <div>
                      <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                      <span className="text-xs text-gray-400">/month</span>
                    </div>
                    <p className="text-[11px] text-[#5e17eb] mt-1.5 font-medium">7 days free — no card until trial ends</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 text-xs text-gray-500">
                        <span className="text-[#5e17eb] mt-0.5 shrink-0">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`text-xs font-semibold text-center py-2.5 rounded-xl transition-colors ${
                      isPopular
                        ? "bg-[#5e17eb] hover:bg-[#4c12c0] text-white"
                        : "bg-black/5 hover:bg-black/10 text-gray-900 border border-black/8"
                    }`}
                  >
                    Start free trial
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white/60 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-[#5e17eb]/5 rounded-3xl blur-3xl pointer-events-none" />
          <div className="relative p-12 rounded-3xl border border-[#5e17eb]/15 bg-white shadow-lg">
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight text-gray-900">
              Stop spending hours on social media.<br />
              <span className="bg-gradient-to-r from-[#5e17eb] to-[#e06832] bg-clip-text text-transparent">Start in 60 seconds.</span>
            </h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Join Shopify store owners who are growing on social without the grind.
            </p>
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#5e17eb] hover:bg-[#4c12c0] transition-colors text-white px-10 py-3.5 rounded-xl shadow-lg shadow-[#5e17eb]/25"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
