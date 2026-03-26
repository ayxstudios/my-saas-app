import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">S</div>
          <span className="font-semibold text-white tracking-tight">SocialAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-1.5 rounded-lg"
          >
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"></span>
            Built for Shopify stores
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            One click.<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Your entire social media done.
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            SocialAI reads your Shopify products, writes scroll-stopping captions, and auto-schedules posts to Instagram and Facebook — without you lifting a finger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto text-sm font-semibold bg-violet-600 hover:bg-violet-500 transition-colors text-white px-8 py-3.5 rounded-xl shadow-lg shadow-violet-900/40"
            >
              Start for free — no credit card
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto text-sm font-medium text-gray-400 hover:text-white transition-colors px-6 py-3.5"
            >
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-violet-400 text-center mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-center mb-14">Three steps, zero effort</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Connect your store",
                desc: "Link your Shopify store in seconds. SocialAI syncs your products, images, and descriptions automatically.",
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
              <div key={step} className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-violet-500/30 transition-colors">
                <span className="text-4xl font-black text-white/5 absolute top-4 right-5 select-none">{step}</span>
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
                  <span className="text-violet-400 text-xs font-bold">{step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-violet-400 text-center mb-3">Features</p>
          <h2 className="text-3xl font-bold text-center mb-14">Everything you need, nothing you don't</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "⚡", title: "AI caption generation", desc: "Gemini-powered captions tailored to your brand voice and each product." },
              { icon: "📅", title: "Auto-scheduling", desc: "Pick a time once. SocialAI handles every future post without you." },
              { icon: "🛍️", title: "Shopify sync", desc: "Your entire product catalog is always up to date — new products appear instantly." },
              { icon: "📣", title: "Instagram & Facebook", desc: "Publish to both platforms simultaneously from one dashboard." },
              { icon: "🎯", title: "Campaign management", desc: "Group posts into campaigns for product launches, sales, and promotions." },
              { icon: "🧠", title: "Brand memory", desc: "Set your tone and audience once. AI remembers and stays consistent." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-colors">
                <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-violet-600/10 rounded-3xl blur-3xl pointer-events-none" />
          <div className="relative p-12 rounded-3xl border border-white/8 bg-white/[0.02]">
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">
              Stop spending hours on social media.<br />
              <span className="text-violet-400">Start in 60 seconds.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Join Shopify store owners who are growing on social without the grind.
            </p>
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-violet-600 hover:bg-violet-500 transition-colors text-white px-10 py-3.5 rounded-xl shadow-lg shadow-violet-900/50"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">S</div>
          <span className="text-gray-500 font-medium">SocialAI</span>
        </div>
        AI-powered social media for ecommerce stores.
      </footer>
    </div>
  )
}
